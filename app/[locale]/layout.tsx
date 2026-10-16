import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMessages, isLocale, localeDirections, locales } from '@/lib/i18n'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: `LifeHealth ID — ${getMessages(locale).localeName}` }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <div lang={locale} dir={localeDirections[locale]}>{children}</div>
}
