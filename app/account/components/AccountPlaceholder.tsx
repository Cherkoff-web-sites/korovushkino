import AccountSectionCard from './AccountSectionCard'

export default function AccountPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <AccountSectionCard title={title}>
      <p className="text-sm leading-relaxed text-[#232326]/80 sm:text-[15px]">{description}</p>
    </AccountSectionCard>
  )
}
