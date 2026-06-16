import Image from 'next/image'

const ACCOUNT_ICON = '/images/header/icon-account.svg'

type ReviewAccountAvatarProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { box: 'h-9 w-9', icon: 18 },
  md: { box: 'h-11 w-11', icon: 22 },
  lg: { box: 'h-14 w-14', icon: 28 },
} as const

export default function ReviewAccountAvatar({ size = 'md', className = '' }: ReviewAccountAvatarProps) {
  const { box, icon } = sizeMap[size]

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[10px] border border-[#D2B48C]/80 bg-white ${box} ${className}`}
      aria-hidden
    >
      <Image src={ACCOUNT_ICON} alt="" width={icon} height={icon} className="shrink-0 object-contain" />
    </div>
  )
}
