import { withAuth } from "next-auth/middleware";
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from "next/server";
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/connexion',
    },
  }
);

export default function middleware(req: NextRequest) {
  const isProtectedPath = /^\/([a-z]{2}\/)?(mon-espace|profil|dashboard-rh)/.test(req.nextUrl.pathname);

  if (isProtectedPath) {
    return (authMiddleware as any)(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
