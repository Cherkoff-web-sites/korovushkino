const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export async function readImageAsDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выберите файл изображения')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Изображение слишком большое (макс. 2 МБ)')
  }

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
