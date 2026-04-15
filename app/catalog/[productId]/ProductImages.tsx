'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImagesProps {
  images: string[]
  productName: string
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div>
      {/* Главное изображение */}
      <div className="bg-[#2A2529] rounded-lg p-4 sm:p-8 mb-4 flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={images[activeImage]}
            alt={productName}
            width={400}
            height={400}
            className="object-contain max-w-full max-h-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Миниатюры */}
      <div className="flex gap-3 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`flex-1 aspect-square bg-[#2A2529] rounded-lg p-2 border-2 transition-all ${
              activeImage === index
                ? 'border-[#3D8C13]'
                : 'border-transparent hover:border-[#3D8C13]/50'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-contain rounded"
                sizes="(max-width: 1024px) 33vw, 16vw"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
