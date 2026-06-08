/**
 * Next.js Middleware for Route Protection
 * Handles authentication and authorization at the edge
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role hierarchy for permission checking
const roleHierarchy: Record<string, number> = {
  superadmin: 4,
  admin: 3,
  staff: 2,
  cashier: 1,
  customer: 0,
};

// Route definitions with required roles
const PROTECTED_ROUTES = {
  // Admin routes - require admin or higher
  "/admin": ["admin", "superadmin"],
  "/admin/dashboard": ["admin", "superadmin", "staff", "cashier"],
  "/admin/products": ["admin", "superadmin", "staff"],
  "/admin/orders": ["admin", "superadmin", "staff", "cashier"],
  "/admin/customers": ["admin", "superadmin", "staff"],
  "/admin/coupons": ["admin", "superadmin"],
  "/admin/reports": ["admin", "superadmin"],
  "/admin/settings": ["admin", "superadmin"],
  
  // POS routes - require cashier or higher
  "/pos": ["admin", "superadmin", "staff", "cashier"],
  "/pos/billing": ["admin", "superadmin", "staff", "cashier"],
  "/pos/credit": ["admin", "superadmin", "staff"],
  "/pos/expenses": ["admin", "superadmin", "staff", "cashier"],
  
  // Customer routes - require authentication
  "/account": ["customer", "admin", "superadmin", "staff", "cashier"],
  "/account/orders": ["customer", "admin", "superadmin", "staff", "cashier"],
  "/account/wishlist": ["customer", "admin", "superadmin", "staff", "cashier"],
  "/account/addresses": ["customer", "admin", "superadmin", "staff", "cashier"],
  "/checkout": ["customer", "admin", "superadmin", "staff", "cashier"],
  "/order-success": ["customer", "admin", "superadmin", "staff", "cashier"],
};

// Public routes that should not be accessible when logged in
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string;

  // Check if accessing auth routes while logged in
  if (isAuthenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Find matching protected route
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    // Not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role authorization
    const allowedRoles = PROTECTED_ROUTES[matchedRoute as keyof typeof PROTECTED_ROUTES];
    
    if (!allowedRoles.includes(userRole)) {
      // User doesn't have required role
      if (userRole === "customer") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Staff trying to access admin-only route
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    // POS routes
    "/pos/:path*",
    // Account routes
    "/account/:path*",
    "/checkout",
    "/order-success",
    // Auth routes (to prevent access when logged in)
    "/auth/:path*",
    // API routes that need protection
    "/api/admin/:path*",
  ],
};
