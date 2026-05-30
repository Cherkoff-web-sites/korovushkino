import { useEffect } from 'react'

/** Блокирует прокрутку страницы под модалкой (в т.ч. на iOS). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollY = window.scrollY
    const { body, documentElement: html } = document

    const bodyOverflow = body.style.overflow
    const bodyPosition = body.style.position
    const bodyTop = body.style.top
    const bodyWidth = body.style.width
    const bodyPaddingRight = body.style.paddingRight
    const htmlOverflow = html.style.overflow

    const scrollbarWidth = window.innerWidth - html.clientWidth

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = bodyOverflow
      body.style.position = bodyPosition
      body.style.top = bodyTop
      body.style.width = bodyWidth
      body.style.paddingRight = bodyPaddingRight
      html.style.overflow = htmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
