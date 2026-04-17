import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export interface Invitee {
  phone: string;
  actual_name: string;
  greeting_nickname: string | null;
  rsvp_status: "yes" | "no" | "maybe" | null;
  plus_one: boolean;
  plus_one_name: string | null;
  needs_overnight: boolean;
  additional_notes: string | null;
  user_birthday: string | null;
  birthday_prompted: boolean;
  created_at: string;
  updated_at: string;
}

// Normalize phone number for consistent lookups
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

// Look up an invitee by phone number
export async function getInviteeByPhone(phone: string): Promise<Invitee | null> {
  const normalizedPhone = normalizePhone(phone);

  const { data, error } = await supabase
    .from("invitees")
    .select("*")
    .eq("phone", normalizedPhone)
    .single();

  if (error || !data) {
    // Also try with +1 prefix if not found
    if (!normalizedPhone.startsWith("+")) {
      const withPrefix = `+1${normalizedPhone}`;
      const { data: data2, error: error2 } = await supabase
        .from("invitees")
        .select("*")
        .eq("phone", withPrefix)
        .single();

      if (!error2 && data2) {
        return data2 as Invitee;
      }
    }
    return null;
  }

  return data as Invitee;
}

// Create or update an invitee's RSVP
export async function upsertInvitee(invitee: Partial<Invitee> & { phone: string }): Promise<Invitee | null> {
  const normalizedPhone = normalizePhone(invitee.phone);

  const { data, error } = await supabase
    .from("invitees")
    .upsert(
      {
        ...invitee,
        phone: normalizedPhone,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "phone",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting invitee:", error);
    return null;
  }

  return data as Invitee;
}

// Check if user has already submitted RSVP
export async function hasSubmittedRsvp(phone: string): Promise<boolean> {
  const invitee = await getInviteeByPhone(phone);
  return invitee?.rsvp_status !== null;
}

// Mark that user has been prompted for birthday (even if they skipped)
export async function markBirthdayPrompted(phone: string): Promise<void> {
  const normalizedPhone = normalizePhone(phone);

  await supabase
    .from("invitees")
    .update({ birthday_prompted: true, updated_at: new Date().toISOString() })
    .eq("phone", normalizedPhone);
}
