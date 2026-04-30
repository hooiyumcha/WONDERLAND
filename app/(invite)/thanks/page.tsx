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

  const displayName = invitee?.actual_name || guestName || "Rider";

  if (!isVerified || !rsvpStatus) return null;

  const getThankYouText = () => {
    switch (rsvpStatus) {
      case "yes":
        return `Hell yeah, ${displayName}! You're in! See you on the road!`;
      case "no":
        return `We'll miss you, ${displayName}. Safe travels wherever the road takes you!`;
      case "maybe":
        return `Noted, ${displayName}! Take your time. The road will wait!`;
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
          <p className="text-[10px] text-center mb-3">MOTO LOG:</p>

          <div className="space-y-2 text-[10px]">
            <div className="flex justify-between items-center border-b border-[#333333] pb-2">
              <span className="text-[#9ca3af]">RSVP:</span>
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
              <div className="flex justify-between items-center border-b border-[#333333] pb-2">
                <span className="text-[#9ca3af]">RIDER:</span>
                <span className="text-[#f97316]">{plusOneName || "YES"}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-[#333333] pb-2">
              <span className="text-[#9ca3af]">OVERNIGHT:</span>
              <span
                className={needsOvernight ? "text-[#34d399]" : "text-[#9ca3af]"}
              >
                {needsOvernight ? "YES" : "NO"}
              </span>
            </div>

            {additionalNotes && (
              <div className="border-b border-[#333333] pb-2">
                <span className="text-[#9ca3af]">NOTES:</span>
                <p className="text-[#f97316] mt-1">{additionalNotes}</p>
              </div>
            )}

            {submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-[#9ca3af]">SAVED:</span>
                <span className="text-[#9ca3af]">
                  {new Date(submittedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {textIndex >= 1 && (
        <div className="pokemon-dialog p-4 space-y-3">
          <p className="text-[10px] text-center mb-3">THE RIDE:</p>
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
        <p className="text-[8px] text-center text-[#9ca3af]">
          See you on the road 🏍️
        </p>
      )}
    </div>
  );
}
