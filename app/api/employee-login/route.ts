import { NextResponse } from "next/server";

const DEMO_EMPLOYEE_ID = "SOC001";
const DEMO_PASSWORD = "CyberBank@2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const employeeId = String(body.employeeId || "");
    const password = String(body.password || "");

    if (
      employeeId !== DEMO_EMPLOYEE_ID ||
      password !== DEMO_PASSWORD
    ) {
      return NextResponse.json(
        {
          error: "Invalid employee ID or password.",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Employee authentication successful.",
    });

    response.cookies.set({
      name: "cyberbank_employee_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid authentication request.",
      },
      {
        status: 400,
      }
    );
  }
}