import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("alcohol_signups")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, signups: data });
  } catch (error) {
    console.error("Error fetching alcohol signups:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch signups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, item } = await request.json();

    if (!name || !item) {
      return NextResponse.json(
        { success: false, error: "Name and item are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("alcohol_signups")
      .insert({ name, item })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, signup: data });
  } catch (error) {
    console.error("Error creating alcohol signup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create signup" },
      { status: 500 }
    );
  }
}
