import { NextResponse } from "next/server";
import { sendVerificationCode } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // For development/testing without Twilio credentials
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log(`[DEV MODE] Would send OTP to ${phone}`);
      return NextResponse.json({
        success: true,
        message: "Development mode - use code 123456",
      });
    }

    const verification = await sendVerificationCode(phone);

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
