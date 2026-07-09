export type HeadingTag = 'h1' | 'h2' | 'h3' | 'p'
export type ContentBlockType = 'h2' | 'h3' | 'p'

export type ContentBlock = {
  type: ContentBlockType
  text: string
}

export const HEADING_TAG_OPTIONS: { value: HeadingTag; label: string }[] = [
  { value: 'p', label: 'Текст' },
  { value: 'h2', label: 'Заголовок H2' },
  { value: 'h3', label: 'Заголовок H3' },
]

export const PAGE_TITLE_TAG_OPTIONS: { value: HeadingTag; label: string }[] = [
  { value: 'h1', label: 'Заголовок H1' },
  ...HEADING_TAG_OPTIONS.filter((item) => item.value !== 'p'),
]

export function resolveHeadingTag(
  tag: HeadingTag | undefined,
  fallback: HeadingTag | undefined
): HeadingTag {
  return tag ?? fallback ?? 'p'
}

export function paragraphsToBlocks(paragraphs: string[]): ContentBlock[] {
  return paragraphs.map((text) => ({ type: 'p', text }))
}

export function normalizeContentBlocks(
  blocks: ContentBlock[] | undefined,
  paragraphs: string[] | undefined,
  fallback: ContentBlock[]
): ContentBlock[] {
  if (blocks?.length) return blocks
  if (paragraphs?.length) return paragraphsToBlocks(paragraphs)
  return fallback
}
