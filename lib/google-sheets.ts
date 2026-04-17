import { google } from "googleapis";

// Lazy initialization to avoid errors when credentials aren't set
let sheetsClient: ReturnType<typeof google.sheets> | null = null;

function getSheets() {
  if (sheetsClient) return sheetsClient;

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.warn("Google Sheets credentials not configured");
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

export interface Invitee {
  actual_name: string;
  phone: string;
  greeting_nickname: string | null;
}

export interface RsvpData {
  actual_name: string;
  phone: string;
  rsvp_status: "yes" | "no" | "maybe";
  plus_one: boolean;
  plus_one_name: string | null;
  user_birthday: string | null;
}

function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  return phone.replace(/[^\d+]/g, "");
}

export async function lookupInvitee(phone: string): Promise<Invitee | null> {
  const sheets = getSheets();
  if (!sheets) return null;

  const spreadsheetId = process.env.INVITEE_SPREADSHEET_ID;
  if (!spreadsheetId) return null;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Invitees!A:C", // actual_name, phone, greeting_nickname
    });

    const rows = response.data.values || [];

    // Skip header row if it exists
    const dataRows = rows.length > 0 && rows[0][0]?.toLowerCase() === "actual_name"
      ? rows.slice(1)
      : rows;

    const normalizedSearchPhone = normalizePhone(phone);

    for (const row of dataRows) {
      const rowPhone = normalizePhone(row[1] || "");
      if (rowPhone === normalizedSearchPhone) {
        return {
          actual_name: row[0] || "",
          phone: row[1] || "",
          greeting_nickname: row[2] || null,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error looking up invitee:", error);
    return null;
  }
}

export async function saveRsvp(rsvp: RsvpData): Promise<boolean> {
  const sheets = getSheets();
  if (!sheets) return false;

  const spreadsheetId = process.env.RSVP_SPREADSHEET_ID;
  if (!spreadsheetId) return false;

  const now = new Date().toISOString();

  try {
    // First, check if this phone already has an RSVP
    const existingResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "RSVPs!A:H",
    });

    const rows = existingResponse.data.values || [];
    const normalizedPhone = normalizePhone(rsvp.phone);

    // Find existing row index (1-based for sheets, accounting for header)
    let existingRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (normalizePhone(rows[i][1] || "") === normalizedPhone) {
        existingRowIndex = i + 1; // 1-based index for Sheets API
        break;
      }
    }

    const rowData = [
      rsvp.actual_name,
      rsvp.phone,
      rsvp.rsvp_status,
      rsvp.plus_one ? "Yes" : "No",
      rsvp.plus_one_name || "",
      rsvp.user_birthday || "",
      existingRowIndex > 0 ? rows[existingRowIndex - 1][6] : now, // submitted_at
      now, // last_modified
    ];

    if (existingRowIndex > 0) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `RSVPs!A${existingRowIndex}:H${existingRowIndex}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [rowData],
        },
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "RSVPs!A:H",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [rowData],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return false;
  }
}

export async function getRsvpByPhone(phone: string): Promise<RsvpData | null> {
  const sheets = getSheets();
  if (!sheets) return null;

  const spreadsheetId = process.env.RSVP_SPREADSHEET_ID;
  if (!spreadsheetId) return null;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "RSVPs!A:H",
    });

    const rows = response.data.values || [];
    const normalizedPhone = normalizePhone(phone);

    for (const row of rows) {
      if (normalizePhone(row[1] || "") === normalizedPhone) {
        return {
          actual_name: row[0] || "",
          phone: row[1] || "",
          rsvp_status: row[2] as "yes" | "no" | "maybe",
          plus_one: row[3]?.toLowerCase() === "yes",
          plus_one_name: row[4] || null,
          user_birthday: row[5] || null,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting RSVP:", error);
    return null;
  }
}
