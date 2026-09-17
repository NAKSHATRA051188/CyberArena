import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const session = request.cookies.get(
    "cyberbank_employee_session"
  )?.value;

  if (session !== "authenticated") {
    const loginUrl = new URL(
      "/employee-login",
      request.url
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bank-security/:path*"],
};