import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"
import { usersTable } from "./db/user"
import { accounts, sessions, verificationTokens } from "./db/auth"
import { eq } from "drizzle-orm"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: usersTable,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    session: { strategy: "database" },
    callbacks: {
        async session({ session, user }) {
            // Fetch user role from DB and attach to session
            const dbUser = await db.query.usersTable.findFirst({
                where: eq(usersTable.id, user.id),
                columns: { role: true },
            });
            session.user.id = user.id;
            (session.user as any).role = dbUser?.role ?? "user";
            return session;
        },
    },
})
