import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4 py-16 sm:py-24">
      <div className="flex w-full max-w-[720px] flex-col items-center">
        <div className="w-full rounded-xl border border-[#C88C39] bg-[#FFF6E7] px-6 py-10 text-center sm:px-10 sm:py-12">
          <h1 className="text-2xl font-normal text-black sm:text-[28px]">Ошибка 404</h1>
          <p className="mx-auto mt-5 max-w-[560px] text-sm leading-relaxed text-black sm:text-base sm:leading-7">
            К сожалению, запрашиваемая Вами страница не найдена. Вероятно, Вы указали несуществующий
            адрес, страница была удалена, перемещена или сейчас она временно недоступна!
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#3D8C13] px-10 text-base font-medium text-white transition-colors hover:bg-[#347710]"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
