import LandingPage from '@/components/landing-page'
import type { Locale } from '@/lib/i18n'

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return <LandingPage locale={locale} />
}
