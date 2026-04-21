import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing Supabase env vars");
    _client = createClient(url, key);
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export async function getInviteeByPhone(phone: string): Promise<Invitee | null> {
  const normalizedPhone = normalizePhone(phone);

  const { data, error } = await getClient()
    .from("invitees")
    .select("*")
    .eq("phone", normalizedPhone)
    .single();

  if (error || !data) {
    if (!normalizedPhone.startsWith("+")) {
      const withPrefix = `+1${normalizedPhone}`;
      const { data: data2, error: error2 } = await getClient()
        .from("invitees")
        .select("*")
        .eq("phone", withPrefix)
        .single();

      if (!error2 && data2) return data2 as Invitee;
    }
    return null;
  }

  return data as Invitee;
}

export async function upsertInvitee(invitee: Partial<Invitee> & { phone: string }): Promise<Invitee | null> {
  const normalizedPhone = normalizePhone(invitee.phone);

  const { data, error } = await getClient()
    .from("invitees")
    .upsert(
      { ...invitee, phone: normalizedPhone, updated_at: new Date().toISOString() },
      { onConflict: "phone" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting invitee:", error);
    return null;
  }

  return data as Invitee;
}

export async function hasSubmittedRsvp(phone: string): Promise<boolean> {
  const invitee = await getInviteeByPhone(phone);
  return invitee?.rsvp_status !== null;
}

export async function markBirthdayPrompted(phone: string): Promise<void> {
  const normalizedPhone = normalizePhone(phone);
  await getClient()
    .from("invitees")
    .update({ birthday_prompted: true, updated_at: new Date().toISOString() })
    .eq("phone", normalizedPhone);
}
