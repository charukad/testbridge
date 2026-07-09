import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role-based route protection
    if (path.startsWith("/developer") && token?.role !== "Developer") {
      return NextResponse.redirect(new URL("/tester/dashboard", req.url));
    }

    if (path.startsWith("/tester") && token?.role !== "Tester") {
      return NextResponse.redirect(new URL("/developer/dashboard", req.url));
    }

    // Redirect root to correct dashboard if logged in
    if (path === "/") {
      if (token?.role === "Developer") {
        return NextResponse.redirect(new URL("/developer/dashboard", req.url));
      }
      if (token?.role === "Tester") {
        return NextResponse.redirect(new URL("/tester/dashboard", req.url));
      }
    }

    // Redirect logged-in users away from login/register pages
    if ((path === "/login" || path === "/register") && token) {
      if (token.role === "Developer") {
        return NextResponse.redirect(new URL("/developer/dashboard", req.url));
      }
      if (token.role === "Tester") {
        return NextResponse.redirect(new URL("/tester/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      // Only require auth for /developer and /tester routes
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/developer") || path.startsWith("/tester")) {
          return !!token;
        }
        // Allow all other routes (landing, login, register) without auth
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/register", "/developer/:path*", "/tester/:path*"],
};
