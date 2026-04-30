"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { useInviteStore } from "@/stores/invite-store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Stage = "greeting" | "ask_name" | "confirm";

export default function GreetingPage() {
  const router = useRouter();
  const { invitee, guestName, setGuestName, isVerified } = useInviteStore();

  const [stage, setStage] = useState<Stage>(
    !invitee && !guestName ? "ask_name" : "greeting"
  );
  const [name, setName] = useState(guestName || "");
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!isVerified) {
      router.replace("/verify");
    }
  }, [isVerified, router]);

  const advanceText = useCallback(() => {
    setTextIndex((prev) => prev + 1);
  }, []);

  const resetText = useCallback(() => {
    setTextIndex(0);
  }, []);

  const displayName =
    invitee?.greeting_nickname ||
    invitee?.actual_name ||
    guestName ||
    name ||
    "Rider";

  const handleContinue = () => {
    if (stage === "ask_name" && name.trim()) {
      setGuestName(name.trim());
      setStage("confirm");
      resetText();
    } else {
      router.push("/details");
    }
  };

  if (!isVerified) return null;

  return (
    <div className="space-y-6">
      <DialogBox>
        {stage === "ask_name" && (
          <>
            <TypewriterText
              text="Unknown rider detected... what's your name?"
              speed={40}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="pokemon-input w-full text-center"
                  autoFocus
                />
                <button
                  onClick={handleContinue}
                  disabled={!name.trim()}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  THAT'S ME!
                </button>
              </div>
            )}
          </>
        )}

        {stage === "confirm" && (
          <>
            <TypewriterText
              text={`So you're ${displayName}!`}
              speed={40}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4">
                <TypewriterText
                  text="Welcome to MotoGParty!"
                  speed={40}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 2 && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => router.push("/details")}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  CONTINUE
                </button>
                <button
                  onClick={() => {
                    setStage("ask_name");
                    resetText();
                  }}
                  className="pokemon-btn w-full"
                >
                  WAIT, THAT'S NOT RIGHT
                </button>
              </div>
            )}
          </>
        )}

        {stage === "greeting" && (
          <>
            <TypewriterText
              text={`${displayName}! Glad you made it to the garage!`}
              speed={40}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4">
                <TypewriterText
                  text="You've been called to ride at MotoGParty!"
                  speed={40}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 2 && (
              <div className="mt-4">
                <button
                  onClick={() => router.push("/details")}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  LET'S GO!
                </button>
              </div>
            )}
          </>
        )}
      </DialogBox>
    </div>
  );
}
