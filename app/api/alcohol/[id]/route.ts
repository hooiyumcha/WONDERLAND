import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, item } = await request.json();

    if (!name || !item) {
      return NextResponse.json(
        { success: false, error: "Name and item are required" },
        { status: 400 }
      );
    }

    const { data, error } = await db()
      .from("alcohol_signups")
      .update({ name, item, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, signup: data });
  } catch (error) {
    console.error("Error updating alcohol signup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update signup" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await db()
      .from("alcohol_signups")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting alcohol signup:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete signup" },
      { status: 500 }
    );
  }
}
