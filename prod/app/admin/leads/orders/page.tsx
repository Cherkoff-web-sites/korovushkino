import LeadsTableView from '@/components/admin/LeadsTableView'

export default function AdminOrdersLeadsPage() {
  return (
    <LeadsTableView
      title="Заказы"
      description="Оформленные заказы с сайта и корзины."
      dataSource="orders"
      columns={[
        { key: 'date', label: 'Дата' },
        { key: 'name', label: 'Имя' },
        { key: 'phone', label: 'Телефон' },
        { key: 'email', label: 'Email' },
        { key: 'items', label: 'Позиций' },
        { key: 'summary', label: 'Состав' },
        { key: 'status', label: 'Статус' },
      ]}
      emptyLabel="Заказов пока нет"
    />
  )
}
