'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiUpdateProfile } from '@/lib/api/authApi'
import { useToast } from '@/contexts/ToastContext'
import AccountSectionCard from '../components/AccountSectionCard'

export default function AccountSettingsPage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [surname, setSurname] = useState('')
  const [firstName, setFirstName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setSurname(user?.surname ?? '')
    setFirstName(user?.firstName ?? '')
    setPhone(user?.phone ?? '')
  }, [user])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await apiUpdateProfile({
        surname: surname.trim(),
        firstName: firstName.trim(),
        phone: phone.trim(),
      })
      await refreshUser()
      showToast('Данные сохранены')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Не удалось сохранить')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AccountSectionCard title="Учетная запись">
      <p className="mb-6 text-sm text-[#707070]">
        Изменения синхронизируются с вашим профилем на сайте.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm text-[#707070]">Email</span>
          <input
            type="email"
            readOnly
            value={user?.email || user?.login || ''}
            className="w-full rounded-lg border border-[#D2B48C]/60 bg-[#f7f8fa] px-4 py-2.5 text-sm text-[#707070]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[#707070]">Фамилия</span>
          <input
            type="text"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            className="w-full rounded-lg border border-[#D2B48C]/60 px-4 py-2.5 text-sm outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[#707070]">Имя</span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-lg border border-[#D2B48C]/60 px-4 py-2.5 text-sm outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-[#707070]">Телефон</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-lg border border-[#D2B48C]/60 px-4 py-2.5 text-sm outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#3D8C13] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#367c11] disabled:opacity-60"
        >
          {submitting ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>
    </AccountSectionCard>
  )
}
