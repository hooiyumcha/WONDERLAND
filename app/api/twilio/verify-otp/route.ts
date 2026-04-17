import { NextResponse } from "next/server";
import { checkVerificationCode } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Phone and code are required" },
        { status: 400 }
      );
    }

    // For development/testing without Twilio credentials
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log(`[DEV MODE] Verifying code ${code} for ${phone}`);
      // Accept "123456" as valid code in dev mode
      const valid = code === "123456";
      return NextResponse.json({
        success: true,
        valid,
        message: valid ? "Verified" : "Invalid code (use 123456 in dev mode)",
      });
    }

    const verification = await checkVerificationCode(phone, code);

    return NextResponse.json({
      success: true,
      valid: verification.status === "approved",
      status: verification.status,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
