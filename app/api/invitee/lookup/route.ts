import { NextResponse } from "next/server";
import { getInviteeByPhone } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    const invitee = await getInviteeByPhone(phone);

    if (invitee) {
      return NextResponse.json({
        success: true,
        invitee: {
          actual_name: invitee.actual_name,
          phone: invitee.phone,
          greeting_nickname: invitee.greeting_nickname,
        },
        hasExistingRsvp: invitee.rsvp_status !== null,
        birthdayPrompted: invitee.birthday_prompted,
        existingRsvp: invitee.rsvp_status ? {
          rsvp_status: invitee.rsvp_status,
          plus_one: invitee.plus_one,
          plus_one_name: invitee.plus_one_name,
          needs_overnight: invitee.needs_overnight,
          additional_notes: invitee.additional_notes,
        } : null,
      });
    }

    // Not found - return null invitee (they can still continue as a new guest)
    return NextResponse.json({
      success: true,
      invitee: null,
      hasExistingRsvp: false,
      birthdayPrompted: false,
    });
  } catch (error) {
    console.error("Error looking up invitee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to lookup invitee" },
      { status: 500 }
    );
  }
}
