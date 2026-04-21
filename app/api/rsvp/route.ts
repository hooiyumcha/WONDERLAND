import { NextResponse } from "next/server";
import { upsertInvitee, getInviteeByPhone } from "@/lib/supabase";

interface RsvpRequestData {
  actual_name: string;
  phone: string;
  rsvp_status: "yes" | "no" | "maybe";
  plus_one: boolean;
  plus_one_name: string | null;
  needs_overnight: boolean;
  additional_notes: string | null;
  user_birthday: string | null;
}

export async function POST(request: Request) {
  try {
    const data: RsvpRequestData = await request.json();

    if (!data.phone || !data.rsvp_status) {
      return NextResponse.json(
        { success: false, error: "Phone and RSVP status are required" },
        { status: 400 }
      );
    }

    const result = await upsertInvitee({
      phone: data.phone,
      actual_name: data.actual_name,
      rsvp_status: data.rsvp_status,
      plus_one: data.plus_one,
      plus_one_name: data.plus_one_name,
      needs_overnight: data.needs_overnight,
      additional_notes: data.additional_notes,
      user_birthday: data.user_birthday,
      birthday_prompted: true, // Mark as prompted since they've gone through the flow
    });

    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to save RSVP" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save RSVP" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Same as POST - upsertInvitee handles updates
  return POST(request);
}

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

    // Transform to match expected response format
    const rsvp = invitee && invitee.rsvp_status ? {
      actual_name: invitee.actual_name,
      phone: invitee.phone,
      rsvp_status: invitee.rsvp_status,
      plus_one: invitee.plus_one,
      plus_one_name: invitee.plus_one_name,
      needs_overnight: invitee.needs_overnight,
      additional_notes: invitee.additional_notes,
      user_birthday: invitee.user_birthday,
      birthday_prompted: invitee.birthday_prompted,
    } : null;

    return NextResponse.json({
      success: true,
      rsvp,
    });
  } catch (error) {
    console.error("Error getting RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get RSVP" },
      { status: 500 }
    );
  }
}
