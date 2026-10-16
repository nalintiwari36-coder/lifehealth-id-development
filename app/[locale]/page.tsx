import LandingPage from '@/components/landing-page'

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: 'en' | 'hi' }> }) {
  const { locale } = await params
  return <LandingPage locale={locale} />
}
