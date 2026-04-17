"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { useInviteStore } from "@/stores/invite-store";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const PARTY_DETAILS = {
  date: "Friday, April 25th, 2026",
  time: "8:00 PM - Late",
  location: "1524 Garden Street",
  city: "Santa Barbara, CA",
  mapLink: "https://maps.google.com/?q=1524+Garden+Street+Santa+Barbara+CA",
};

export default function ThanksPage() {
  const router = useRouter();
  const {
    isVerified,
    rsvpStatus,
    submittedAt,
    invitee,
    guestName,
    plusOne,
    plusOneName,
    needsOvernight,
    additionalNotes,
    reset,
  } = useInviteStore();

  const [hasConfetti, setHasConfetti] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!isVerified || !rsvpStatus) {
      router.replace("/verify");
    }
  }, [isVerified, rsvpStatus, router]);

  useEffect(() => {
    if (rsvpStatus === "yes" && !hasConfetti) {
      setHasConfetti(true);
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#a78bfa", "#fbbf24", "#34d399", "#ffffff"],
        });
      }, 300);
    }
  }, [rsvpStatus, hasConfetti]);

  const advanceText = useCallback(() => {
    setTextIndex((prev) => prev + 1);
  }, []);

  const displayName = invitee?.actual_name || guestName || "Friend";

  if (!isVerified || !rsvpStatus) return null;

  const getThankYouText = () => {
    switch (rsvpStatus) {
      case "yes":
        return `Wonderful, ${displayName}! Your invitation is confirmed! We'll see you down the rabbit hole!`;
      case "no":
        return `We understand, ${displayName}. Thank you for letting us know. Perhaps another adventure awaits!`;
      case "maybe":
        return `Noted, ${displayName}! Take your time. WONDERLAND will await your final answer!`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <DialogBox>
        <TypewriterText
          text={getThankYouText()}
          speed={35}
          onComplete={advanceText}
        />
      </DialogBox>

      {textIndex >= 1 && (
        <div className="pokemon-dialog p-4 space-y-3">
          <p className="text-[10px] text-center mb-3">WONDERLAND LOG:</p>

          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between items-center border-b border-[#2d1b5e] pb-2">
              <span className="text-[#9b89cc]">RSVP:</span>
              <span
                className={
                  rsvpStatus === "yes"
                    ? "text-[#34d399]"
                    : rsvpStatus === "no"
                    ? "text-[#ef4444]"
                    : "text-[#fbbf24]"
                }
              >
                {rsvpStatus === "yes" && "YES!"}
                {rsvpStatus === "no" && "NO"}
                {rsvpStatus === "maybe" && "MAYBE"}
              </span>
            </div>

            {plusOne && (
              <div className="flex justify-between items-center border-b border-[#2d1b5e] pb-2">
                <span className="text-[#9b89cc]">COMPANION:</span>
                <span className="text-[#a78bfa]">{plusOneName || "YES"}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-[#2d1b5e] pb-2">
              <span className="text-[#9b89cc]">OVERNIGHT:</span>
              <span className={needsOvernight ? "text-[#34d399]" : "text-[#9b89cc]"}>
                {needsOvernight ? "YES" : "NO"}
              </span>
            </div>

            {additionalNotes && (
              <div className="border-b border-[#2d1b5e] pb-2">
                <span className="text-[#9b89cc]">NOTES:</span>
                <p className="text-[#a78bfa] mt-1">{additionalNotes}</p>
              </div>
            )}

            {submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-[#9b89cc]">SAVED:</span>
                <span className="text-[#9b89cc]">
                  {new Date(submittedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {textIndex >= 1 && (
        <div className="pokemon-dialog p-4 space-y-3">
          <p className="text-[10px] text-center mb-3">THE GATHERING:</p>
          <div className="space-y-2 text-[10px]">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{PARTY_DETAILS.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕖</span>
              <span>{PARTY_DETAILS.time}</span>
            </div>
            <a
              href={PARTY_DETAILS.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#a78bfa] hover:underline"
            >
              <span>📍</span>
              <span>{PARTY_DETAILS.location}, {PARTY_DETAILS.city}</span>
            </a>
          </div>
        </div>
      )}

      {textIndex >= 1 && (
        <div className="space-y-2">
          <button
            onClick={() => router.push("/rsvp")}
            className="pokemon-btn pokemon-btn-primary w-full"
          >
            EDIT RESPONSE
          </button>
          <button onClick={() => { reset(); router.push("/verify"); }} className="pokemon-btn w-full">
            START OVER
          </button>
        </div>
      )}

      {textIndex >= 1 && (
        <p className="text-[8px] text-center text-[#9b89cc]">
          See you down the rabbit hole 🐇
        </p>
      )}
    </div>
  );
}
