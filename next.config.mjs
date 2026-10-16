/** @type {import('next').NextConfig} */
export const buildSecurityHeaders = (environment = process.env.NODE_ENV) => {
  const scriptSource = environment === 'development'
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com"
    : "'self' 'unsafe-inline' https://va.vercel-scripts.com"

  return [
    { key: 'Content-Security-Policy', value: `default-src 'self'; script-src ${scriptSource}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ]
}

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async headers() {
    return [{ source: '/(.*)', headers: buildSecurityHeaders() }]
  },
}

export default nextConfig
