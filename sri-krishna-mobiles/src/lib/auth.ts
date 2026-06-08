/**
 * NextAuth.js Configuration
 * Supports: Credentials (email/password), Google OAuth, JWT with role-based access
 */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/models";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Credentials
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.isActive || user.isBlocked) {
          throw new Error("Account is disabled or blocked");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // JWT callback - add user data to token
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }

      // Handle session update (e.g., profile update)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
      }

      // For Google OAuth, check if user exists or create new
      if (account?.provider === "google" && token.email) {
        await connectDB();
        
        let dbUser = await User.findOne({ email: token.email });
        
        if (!dbUser) {
          // Create new user from Google OAuth
          dbUser = await User.create({
            email: token.email,
            name: token.name || token.email.split("@")[0],
            image: token.picture,
            emailVerified: new Date(),
            role: "customer",
          });
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.image = dbUser.image;
      }

      return token;
    },

    // Session callback - add token data to session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    // SignIn callback - additional checks
    async signIn({ user, account, profile }) {
      // Allow credentials provider
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers
      if (account?.provider === "google") {
        // Check if user is blocked
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        
        if (dbUser && dbUser.isBlocked) {
          return false; // Blocked users can't sign in
        }
        
        return true;
      }

      return false;
    },

    // Redirect callback
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/register",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: process.env.NODE_ENV === "development",
};

// Helper to check if user has required role
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

// Role hierarchy for permission checking
const roleHierarchy: Record<string, number> = {
  superadmin: 4,
  admin: 3,
  staff: 2,
  cashier: 1,
  customer: 0,
};

// Check if user has minimum role level
export function hasMinimumRole(userRole: string, minRole: string): boolean {
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[minRole] || 0);
}

export default authOptions;
