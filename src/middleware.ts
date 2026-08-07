import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // une session valide
    return NextResponse.next();
  },
  {
    callbacks: {
      // accès  si un token de session existe
      authorized: ({ token }) => !!token,
    },
    pages: {
      // page de connexion si user n'est pas connecté
      signIn: '/connexion',
    },
  }
);

// définir routes protégées par ce middleware
export const config = {
  matcher: [
    "/mon-espace/:path*",  
    "/profil/:path*",     
    "/dashboard-rh/:path*",
  ],
};
