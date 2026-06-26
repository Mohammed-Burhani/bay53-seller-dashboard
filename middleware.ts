import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/seller/auth", "/seller/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("seller_session");

  if (pathname.startsWith("/seller/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/seller/auth/login", request.url));
    }
  }

  if (pathname.startsWith("/seller/auth") && session && pathname !== "/seller/auth/verify-email") {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/dashboard/:path*", "/seller/auth/:path*"],
};
