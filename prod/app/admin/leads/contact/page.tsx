import LeadsTableView from '@/components/admin/LeadsTableView'

export default function AdminContactLeadsPage() {
  return (
    <LeadsTableView
      title="Обратная связь"
      description="Сообщения с форм обратной связи на сайте."
      dataSource="contacts"
      columns={[
        { key: 'date', label: 'Дата' },
        { key: 'name', label: 'Имя' },
        { key: 'phone', label: 'Телефон' },
        { key: 'email', label: 'Email' },
        { key: 'message', label: 'Сообщение' },
        { key: 'source', label: 'Источник' },
        { key: 'status', label: 'Статус' },
      ]}
    />
  )
}
