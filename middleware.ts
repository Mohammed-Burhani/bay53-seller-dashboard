
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/seller/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/seller/auth/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    pathname.startsWith("/seller/auth") &&
    session &&
    pathname !== "/seller/auth/verify-email"
  ) {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/seller/dashboard/:path*", "/seller/auth/:path*"],
};

