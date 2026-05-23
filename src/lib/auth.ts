import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Check against environment-based admin credentials
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (!adminEmail || !adminPassword) {
                    console.error('Admin credentials not configured in environment variables');
                    return null;
                }

                // Verify credentials match admin environment variables
                if (
                    credentials.email === adminEmail &&
                    credentials.password === adminPassword
                ) {
                    // Return admin user object
                    return {
                        id: 'admin',
                        name: 'Admin',
                        email: adminEmail,
                        image: null,
                        role: 'ADMIN',
                    };
                }

                // No valid credentials
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                if (token && session.user) {
                    session.user.id = token.sub as string;
                    session.user.role = token.role;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        }
    }
};
