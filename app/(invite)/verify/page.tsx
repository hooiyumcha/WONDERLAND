"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { useInviteStore } from "@/stores/invite-store";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Stage = "intro" | "phone" | "checking";

export default function VerifyPage() {
  const router = useRouter();
  const {
    setPhone,
    setVerified,
    setInvitee,
    restoreFromDb,
    phone: storedPhone,
  } = useInviteStore();

  const [stage, setStage] = useState<Stage>("intro");
  const [phone, setPhoneInput] = useState(storedPhone || "");
  const [error, setError] = useState<string | null>(null);
  const [textIndex, setTextIndex] = useState(0);

  const advanceText = useCallback(() => {
    setTextIndex((prev) => prev + 1);
  }, []);

  const resetText = useCallback(() => {
    setTextIndex(0);
  }, []);

  const handleSubmitPhone = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number!");
      return;
    }

    setStage("checking");
    setError(null);

    const formattedPhone = phone.startsWith("+")
      ? phone
      : `+1${phone.replace(/\D/g, "")}`;

    try {
      setPhone(formattedPhone);
      setVerified(true);

      const lookupRes = await fetch(
        `/api/invitee/lookup?phone=${encodeURIComponent(formattedPhone)}`
      );
      const lookupData = await lookupRes.json();

      if (lookupData.invitee) {
        setInvitee(lookupData.invitee);
      }

      if (lookupData.hasExistingRsvp && lookupData.existingRsvp) {
        restoreFromDb({
          rsvpStatus: lookupData.existingRsvp.rsvp_status,
          plusOne: lookupData.existingRsvp.plus_one,
          plusOneName: lookupData.existingRsvp.plus_one_name,
          needsOvernight: lookupData.existingRsvp.needs_overnight,
          additionalNotes: lookupData.existingRsvp.additional_notes,
          birthdayPrompted: lookupData.birthdayPrompted,
        });
        router.push("/thanks");
      } else {
        router.push("/greeting");
      }
    } catch {
      setError("Something went wrong!");
      setStage("phone");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-center text-2xl font-bold text-[#fbbf24] tracking-wider">
        WONDERLAND
      </h1>

      <DialogBox>
        {stage === "intro" && (
          <>
            <TypewriterText
              text="Curiouser and curiouser... welcome to WONDERLAND!"
              speed={40}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4">
                <TypewriterText
                  text="You've been invited to tumble down the rabbit hole with us!"
                  speed={40}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 2 && (
              <div className="mt-4">
                <TypewriterText
                  text="But first, I must know who you are..."
                  speed={40}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 3 && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setStage("phone");
                    resetText();
                  }}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  LET'S GO!
                </button>
              </div>
            )}
          </>
        )}

        {stage === "phone" && (
          <>
            <TypewriterText
              text="What is your phone number?"
              speed={40}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-4">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="pokemon-input w-full text-center"
                  autoFocus
                />
                {error && <p className="text-[10px] text-red-500">{error}</p>}
                <button
                  onClick={handleSubmitPhone}
                  disabled={phone.replace(/\D/g, "").length < 10}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  CONTINUE
                </button>
              </div>
            )}
          </>
        )}

        {stage === "checking" && (
          <TypewriterText text="Searching through the looking glass..." speed={40} />
        )}
      </DialogBox>
    </div>
  );
}
