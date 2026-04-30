"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { useInviteStore } from "@/stores/invite-store";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const PARTY_DETAILS = {
  date: "Friday, May 1st, 2026",
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
          colors: ["#f97316", "#fbbf24", "#dc2626", "#ffffff"],
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
        return `Let's go, ${displayName}! So stoked you're coming!`;
      case "no":
        return `We'll miss you, ${displayName}. Hope to see you at the next one!`;
      case "maybe":
        return `No rush, ${displayName}! Let us know whenever you decide.`;
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
          <p className="text-[10px] text-center mb-3">YOUR RSVP:</p>

          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between items-center border-b border-[#d4d4d4] pb-2">
              <span className="text-[#6b7280]">STATUS:</span>
              <span
                className={
                  rsvpStatus === "yes"
                    ? "text-[#34d399]"
                    : rsvpStatus === "no"
                    ? "text-[#ef4444]"
                    : "text-[#f97316]"
                }
              >
                {rsvpStatus === "yes" && "YES!"}
                {rsvpStatus === "no" && "NO"}
                {rsvpStatus === "maybe" && "MAYBE"}
              </span>
            </div>

            {plusOne && (
              <div className="flex justify-between items-center border-b border-[#d4d4d4] pb-2">
                <span className="text-[#6b7280]">GUEST:</span>
                <span className="text-[#f97316]">{plusOneName || "YES"}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-[#d4d4d4] pb-2">
              <span className="text-[#6b7280]">OVERNIGHT:</span>
              <span
                className={needsOvernight ? "text-[#34d399]" : "text-[#6b7280]"}
              >
                {needsOvernight ? "YES" : "NO"}
              </span>
            </div>

            {additionalNotes && (
              <div className="border-b border-[#d4d4d4] pb-2">
                <span className="text-[#6b7280]">NOTES:</span>
                <p className="text-[#1a1a1a] mt-1">{additionalNotes}</p>
              </div>
            )}

            {submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-[#6b7280]">SAVED:</span>
                <span className="text-[#6b7280]">
                  {new Date(submittedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {textIndex >= 1 && (
        <div className="pokemon-dialog p-4 space-y-3">
          <p className="text-[10px] text-center mb-3">THE PARTY:</p>
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
              className="flex items-center gap-2 text-[#f97316] hover:underline"
            >
              <span>📍</span>
              <span>
                {PARTY_DETAILS.location}, {PARTY_DETAILS.city}
              </span>
            </a>
          </div>
        </div>
      )}

      {textIndex >= 1 && (
        <div className="space-y-2">
          <a
            href="/alc"
            target="_blank"
            rel="noopener noreferrer"
            className="pokemon-btn pokemon-btn-primary w-full flex items-center justify-center gap-2"
          >
            SIGN UP TO BRING A BOTTLE ↗
          </a>
          <button
            onClick={() => router.push("/rsvp")}
            className="pokemon-btn w-full"
          >
            EDIT RESPONSE
          </button>
          <button
            onClick={() => {
              reset();
              router.push("/verify");
            }}
            className="pokemon-btn w-full"
          >
            START OVER
          </button>
        </div>
      )}

      {textIndex >= 1 && (
        <p className="text-[8px] text-center text-[#6b7280]">
          See you there 🏍️
        </p>
      )}
    </div>
  );
}
