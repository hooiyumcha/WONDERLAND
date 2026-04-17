import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.warn("Twilio credentials not configured. SMS verification will not work.");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendVerificationCode(phone: string) {
  if (!client || !verifyServiceSid) {
    throw new Error("Twilio not configured");
  }

  return client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({
      to: phone,
      channel: "sms",
    });
}

export async function checkVerificationCode(phone: string, code: string) {
  if (!client || !verifyServiceSid) {
    throw new Error("Twilio not configured");
  }

  return client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({
      to: phone,
      code,
    });
}
