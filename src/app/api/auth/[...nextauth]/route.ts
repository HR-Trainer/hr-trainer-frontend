import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          //  vérifier les identifiants
          const res = await fetch("http://localhost:5000/api/connexion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const user = await res.json();

          if (res.ok && user) {
            // infos de l'utilisateur
            return {
              id: user.id,
              name: user.nom,
              email: user.email,
              profil: user.profil,
              statutAcces: user.statutAcces,
              photo: user.photo,
              telephone: user.telephone,
              poste: user.poste,
              role: user.role
            };
          }
          
          return null; 
        } catch (error) {
          console.error("Erreur auth:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Enregistrer user Google dans  backend 
        try {
          const res = await fetch("http://localhost:5000/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image
            })
          });
          const dbUser = await res.json();
          if (res.ok && dbUser) {
            // Associer backend au user Google
            user.id = dbUser.id;
            (user as any).profil = dbUser.profil;
            (user as any).statutAcces = dbUser.statutAcces;
            (user as any).photo = dbUser.photo;
            (user as any).telephone = dbUser.telephone;
            (user as any).poste = dbUser.poste;
            (user as any).role = dbUser.role;
            return true;
          }
        } catch (error) {
          console.error("Erreur création user Google:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // if user update son profil
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.photo !== undefined) token.photo = session.photo;
        if (session.telephone !== undefined) token.telephone = session.telephone;
        if (session.poste !== undefined) token.poste = session.poste;
      }
      
      if (user) {
        token.id = user.id;
        token.profil = (user as any).profil;
        token.statutAcces = (user as any).statutAcces;
        token.photo = (user as any).photo;
        token.telephone = (user as any).telephone;
        token.poste = (user as any).poste;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).profil = token.profil;
        (session.user as any).statutAcces = token.statutAcces;
        (session.user as any).photo = token.photo;
        (session.user as any).telephone = token.telephone;
        (session.user as any).poste = token.poste;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/connexion', 
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-temporaire-pour-le-mvp-12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
