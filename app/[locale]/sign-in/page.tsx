import SignInPage from '@/app/sign-in/page'

export default async function LocalizedSignInPage({ searchParams }: { searchParams: Promise<{ returnTo?: string; mode?: string }> }) {
  const params = await searchParams
  return <SignInPage returnTo={params.returnTo} initialMode={params.mode === 'sign-up' ? 'sign-up' : 'sign-in'} />
}
