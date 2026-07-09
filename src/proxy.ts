import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/developer") && token?.role !== "Developer") {
      return NextResponse.redirect(new URL("/tester/dashboard", req.url));
    }

    if (path.startsWith("/tester") && token?.role !== "Tester") {
      return NextResponse.redirect(new URL("/developer/dashboard", req.url));
    }

    if (path === "/") {
      if (token?.role === "Developer") {
        return NextResponse.redirect(new URL("/developer/dashboard", req.url));
      }
      if (token?.role === "Tester") {
        return NextResponse.redirect(new URL("/tester/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/developer/:path*", "/tester/:path*"],
};
