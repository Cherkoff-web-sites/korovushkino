'use client'

import Image from 'next/image'

type ContentImageProps = {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

export default function ContentImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: ContentImageProps) {
  if (src.startsWith('data:')) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className ?? ''}`} />
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return <Image src={src} alt={alt} width={800} height={600} className={className} sizes={sizes} priority={priority} />
}
