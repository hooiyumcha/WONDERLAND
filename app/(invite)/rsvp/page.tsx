"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInviteStore, type RsvpStatus } from "@/stores/invite-store";
import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const RSVP_OPTIONS: {
  value: RsvpStatus;
  label: string;
  emoji: string;
}[] = [
  { value: "yes", label: "YES!", emoji: "🎉" },
  { value: "no", label: "NO...", emoji: "😢" },
  { value: "maybe", label: "MAYBE", emoji: "🤔" },
];

export default function RsvpPage() {
  const router = useRouter();
  const {
    isVerified,
    hasViewedDetails,
    rsvpStatus,
    setRsvpStatus,
    submitRsvp,
  } = useInviteStore();

  const [selected, setSelected] = useState<RsvpStatus | null>(rsvpStatus);
  const [textIndex, setTextIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [showTomatoes, setShowTomatoes] = useState(false);
  const [showPeekaboo, setShowPeekaboo] = useState(false);

  useEffect(() => {
    if (!isVerified) {
      router.replace("/verify");
    } else if (!hasViewedDetails) {
      router.replace("/details");
    }
  }, [isVerified, hasViewedDetails, router]);

  const advanceText = useCallback(() => {
    setTextIndex((prev) => prev + 1);
  }, []);

  const resetText = useCallback(() => {
    setTextIndex(0);
  }, []);

  const handleSelect = (status: RsvpStatus) => {
    setSelected(status);

    if (status === "yes") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#fbbf24", "#34d399", "#ffffff"],
      });
    } else if (status === "no") {
      setShowTomatoes(true);
      setTimeout(() => setShowTomatoes(false), 2000);
    } else if (status === "maybe") {
      setShowPeekaboo(true);
      setTimeout(() => setShowPeekaboo(false), 4000);
    }
  };

  const handleContinue = () => {
    if (selected) {
      setRsvpStatus(selected);
      resetText();
      setShowResponse(true);
    }
  };

  const handleResponseComplete = useCallback(async () => {
    const state = useInviteStore.getState();
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: state.phone,
          actual_name: state.invitee?.actual_name || state.guestName,
          rsvp_status: state.rsvpStatus,
          plus_one: state.plusOne,
          plus_one_name: state.plusOneName,
          needs_overnight: state.needsOvernight,
          additional_notes: state.additionalNotes,
          user_birthday: null,
        }),
      });
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
    }
    submitRsvp();
    setTimeout(() => router.push("/thanks"), 1000);
  }, [router, submitRsvp]);

  if (!isVerified || !hasViewedDetails) return null;

  const getResponseText = () => {
    switch (selected) {
      case "yes":
        return "WONDERFUL! We're all mad here, and we simply can't wait for you to arrive!";
      case "no":
        return "Oh dear... Most unfortunate. Perhaps another rabbit hole awaits you someday...";
      case "maybe":
        return "Still uncertain? Take your time. WONDERLAND will wait for you!";
      default:
        return "";
    }
  };

  return (
    <>
      {showPeekaboo && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style jsx>{`
            @keyframes peekFromBottom {
              0% { transform: translateY(0); }
              8% { transform: translateY(-70px); }
              12% { transform: translateY(-50px); }
              60% { transform: translateY(-50px); }
              100% { transform: translateY(0); }
            }
            @keyframes peekFromTop {
              0% { transform: translateY(0); }
              8% { transform: translateY(70px); }
              12% { transform: translateY(50px); }
              60% { transform: translateY(50px); }
              100% { transform: translateY(0); }
            }
            @keyframes peekFromLeft {
              0% { transform: translateX(0); }
              8% { transform: translateX(70px); }
              12% { transform: translateX(50px); }
              60% { transform: translateX(50px); }
              100% { transform: translateX(0); }
            }
            @keyframes peekFromRight {
              0% { transform: translateX(0); }
              8% { transform: translateX(-70px); }
              12% { transform: translateX(-50px); }
              60% { transform: translateX(-50px); }
              100% { transform: translateX(0); }
            }
          `}</style>
          {[0, 1, 2].map((i) => (
            <div key={`bottom-${i}`} className="absolute text-4xl"
              style={{ bottom: "-60px", left: `${20 + i * 30}%`, animation: `peekFromBottom 3s ease-out forwards`, animationDelay: `${i * 0.2}s` }}>
              🐱
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`top-${i}`} className="absolute text-4xl"
              style={{ top: "-60px", left: `${30 + i * 40}%`, animation: `peekFromTop 3s ease-out forwards`, animationDelay: `${0.1 + i * 0.3}s` }}>
              🐱
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`left-${i}`} className="absolute text-4xl"
              style={{ left: "-60px", top: `${25 + i * 35}%`, animation: `peekFromLeft 3s ease-out forwards`, animationDelay: `${0.05 + i * 0.35}s` }}>
              🐱
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`right-${i}`} className="absolute text-4xl"
              style={{ right: "-60px", top: `${20 + i * 40}%`, animation: `peekFromRight 3s ease-out forwards`, animationDelay: `${0.15 + i * 0.25}s` }}>
              🐱
            </div>
          ))}
        </div>
      )}

      {showTomatoes && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style jsx>{`
            @keyframes fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(calc(100vh + 50px)) rotate(360deg); opacity: 0; }
            }
          `}</style>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-3xl"
              style={{ left: `${(i * 17) % 100}%`, top: "-50px", animation: `fall ${1.5 + (i % 5) * 0.3}s linear forwards`, animationDelay: `${(i % 8) * 0.1}s` }}>
              🃏
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        <DialogBox>
          {!showResponse ? (
            <>
              <TypewriterText
                text="The moment of truth! Will you tumble into WONDERLAND with us?"
                speed={35}
                onComplete={advanceText}
              />
              {textIndex >= 1 && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    {RSVP_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full pokemon-btn flex items-center justify-center gap-2",
                          selected === option.value && "pokemon-btn-primary"
                        )}
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[8px] text-center text-[#9b89cc]">
                    (You can change your answer later)
                  </p>
                  <button
                    onClick={handleContinue}
                    disabled={!selected}
                    className="pokemon-btn pokemon-btn-primary w-full"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </>
          ) : (
            <TypewriterText
              text={getResponseText()}
              speed={35}
              onComplete={handleResponseComplete}
            />
          )}
        </DialogBox>

        {textIndex >= 1 && !showResponse && selected && (
          <div className="pokemon-dialog p-3 text-center">
            <p className="text-[10px]">
              Selected: <span className="text-[#fbbf24]">{selected.toUpperCase()}</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
