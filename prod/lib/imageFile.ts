const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_OUTPUT_DIMENSION = 1920
const JPEG_QUALITY = 0.82

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Не удалось прочитать изображение'))
    }
    image.src = url
  })
}

function canvasToJpegDataUrl(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL('image/jpeg', quality)
}

/** Compress/resize image so product saves stay under server body limits. */
export async function readImageAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выберите файл изображения')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Изображение слишком большое (макс. 8 МБ)')
  }

  // SVG and tiny files — keep as-is
  if (file.type === 'image/svg+xml' || file.size <= 120 * 1024) {
    return readFileAsDataUrl(file)
  }

  try {
    const image = await loadImageFromFile(file)
    const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return readFileAsDataUrl(file)
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)

    let quality = JPEG_QUALITY
    let dataUrl = canvasToJpegDataUrl(canvas, quality)

    // Keep shrinking quality until under ~1.5MB data URL (~1.1MB binary)
    const maxDataUrlChars = 1.5 * 1024 * 1024
    while (dataUrl.length > maxDataUrlChars && quality > 0.45) {
      quality -= 0.08
      dataUrl = canvasToJpegDataUrl(canvas, quality)
    }

    return dataUrl
  } catch {
    return readFileAsDataUrl(file)
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }
      reject(new Error('Не удалось прочитать файл'))
    }
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })
}
