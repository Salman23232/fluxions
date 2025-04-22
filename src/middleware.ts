import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/site',
  '/api/uploadthing',
])

export default clerkMiddleware(async (auth, req) => {


  const url = req.nextUrl
  const searchParams = url.searchParams.toString()
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? '?' + searchParams : ''}`

  const hostname = req.headers.get('host') || ''
  const customSubDomain = hostname.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)?.filter(Boolean)[0]

  // Only rewrite if subdomain exists and is valid
  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url))
  }

  // Redirect / or /site to /site (only on main domain)
  if (url.pathname === '/' || (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
    return NextResponse.rewrite(new URL('/site', req.url))
  }

  // Redirect /sign-in or /sign-up to /agency/sign-in
  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
  }

  // Allow /agency or /subaccount on main domain
  if (
    url.pathname.startsWith( '/agency') || url.pathname.startsWith('/subaccount')
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
