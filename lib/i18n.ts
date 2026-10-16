import en from '@/messages/en.json'
import hi from '@/messages/hi.json'

export const locales = ['en', 'hi'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = { en: 'ltr', hi: 'ltr' }
export const messages = { en, hi } as const

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getMessages(locale: string) {
  return messages[isLocale(locale) ? locale : defaultLocale]
}

export function formatDate(date: Date | number, locale: Locale = defaultLocale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
}

export function formatNumber(value: number, locale: Locale = defaultLocale) {
  return new Intl.NumberFormat(locale).format(value)
}
