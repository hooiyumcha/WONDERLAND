"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { cn } from "@/lib/utils";
import { useInviteStore } from "@/stores/invite-store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const PARTY_DETAILS = {
  title: "WONDERLAND",
  date: "Friday, April 25th, 2026",
  time: "8:00 PM - Late",
  location: "1524 Garden Street",
  city: "Santa Barbara, CA",
  mapLink: "https://maps.google.com/?q=1524+Garden+Street+Santa+Barbara+CA",
};

type Stage = "intro" | "details" | "notes" | "plusone" | "logistics" | "ready";

export default function DetailsPage() {
  const router = useRouter();
  const {
    setPartyDetails,
    isVerified,
    plusOne: existingPlusOne,
    plusOneName: existingPlusOneName,
    needsOvernight: existingNeedsOvernight,
    additionalNotes: existingAdditionalNotes,
  } = useInviteStore();

  const [stage, setStage] = useState<Stage>("intro");
  const [plusOne, setPlusOne] = useState(existingPlusOne);
  const [plusOneName, setPlusOneName] = useState(existingPlusOneName || "");
  const [guestCount, setGuestCount] = useState(1);
  const [needsOvernight, setNeedsOvernight] = useState(existingNeedsOvernight);
  const [additionalNotes, setAdditionalNotes] = useState(
    existingAdditionalNotes || ""
  );
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

  const handleContinue = () => {
    setPartyDetails({
      plusOne,
      plusOneName: plusOneName || undefined,
      needsOvernight,
      additionalNotes: additionalNotes || undefined,
    });
    router.push("/rsvp");
  };

  const nextStage = () => {
    resetText();
    const stages: Stage[] = [
      "intro",
      "details",
      "notes",
      "plusone",
      "logistics",
      "ready",
    ];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
    }
  };

  if (!isVerified) return null;

  return (
    <div className="space-y-6">
      <DialogBox>
        {stage === "intro" && (
          <>
            <TypewriterText
              text="Excellent! You've made it through!"
              speed={35}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4">
                <TypewriterText
                  text="Now let me tell you about this peculiar gathering..."
                  speed={35}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 2 && (
              <div className="mt-4">
                <button
                  onClick={nextStage}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  TELL ME MORE!
                </button>
              </div>
            )}
          </>
        )}

        {stage === "details" && (
          <>
            <TypewriterText
              text={PARTY_DETAILS.title}
              speed={50}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-3">
                <div className="pokemon-dialog p-3 text-[10px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span>📅</span>
                    <span>{PARTY_DETAILS.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
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
                    <span>
                      {PARTY_DETAILS.location}, {PARTY_DETAILS.city}
                    </span>
                  </a>
                </div>
                <button
                  onClick={nextStage}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  GOT IT!
                </button>
              </div>
            )}
          </>
        )}

        {stage === "notes" && (
          <>
            <TypewriterText
              text="A few things to keep in mind..."
              speed={35}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-3">
                <div className="pokemon-dialog p-3 text-[10px] space-y-2">
                  <div className="flex items-center gap-2">
                    <span>🍾</span>
                    <span>Bringing something to drink would be appreciated!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎵</span>
                    <span>After party TBD!</span>
                  </div>
                </div>
                <button
                  onClick={nextStage}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  SOUNDS FUN!
                </button>
              </div>
            )}
          </>
        )}

        {stage === "plusone" && (
          <>
            <TypewriterText
              text="Will any companions be joining you on this adventure?"
              speed={35}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlusOne(false)}
                    className={cn(
                      "pokemon-btn flex-1",
                      !plusOne && "pokemon-btn-primary"
                    )}
                  >
                    JUST ME
                  </button>
                  <button
                    onClick={() => setPlusOne(true)}
                    className={cn(
                      "pokemon-btn flex-1",
                      plusOne && "pokemon-btn-primary"
                    )}
                  >
                    + GUESTS
                  </button>
                </div>

                {plusOne && (
                  <div className="pokemon-dialog p-3 space-y-3">
                    <div>
                      <p className="text-[10px] mb-2">How many?</p>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() =>
                            setGuestCount(Math.max(1, guestCount - 1))
                          }
                          disabled={guestCount <= 1}
                          className="pokemon-btn w-10 h-10 p-0"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-8 text-center">
                          {guestCount}
                        </span>
                        <button
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="pokemon-btn w-10 h-10 p-0"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {guestCount === 1 && (
                      <div>
                        <p className="text-[10px] mb-2">Their name?</p>
                        <input
                          type="text"
                          value={plusOneName}
                          onChange={(e) => setPlusOneName(e.target.value)}
                          placeholder="Guest name"
                          className="pokemon-input w-full"
                        />
                      </div>
                    )}

                    {guestCount > 1 && (
                      <div className="bg-[#a78bfa]/20 p-2 rounded text-[9px]">
                        Please share the invite link with your guests!
                      </div>
                    )}

                    <div className="bg-[#ef4444]/20 p-2 rounded text-[9px] text-[#ef4444]">
                      ⚠️ This party is NOT open invite! Check with me first!
                    </div>
                  </div>
                )}

                <button
                  onClick={nextStage}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  CONTINUE
                </button>
              </div>
            )}
          </>
        )}

        {stage === "logistics" && (
          <>
            <TypewriterText
              text="A couple more questions..."
              speed={35}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4 space-y-4">
                <div className="pokemon-dialog p-3 space-y-2">
                  <p className="text-[10px]">
                    Will you need to stay overnight?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNeedsOvernight(false)}
                      className={cn(
                        "pokemon-btn flex-1",
                        !needsOvernight && "pokemon-btn-primary"
                      )}
                    >
                      NO, I'M GOOD
                    </button>
                    <button
                      onClick={() => setNeedsOvernight(true)}
                      className={cn(
                        "pokemon-btn flex-1",
                        needsOvernight && "pokemon-btn-primary"
                      )}
                    >
                      YES PLEASE
                    </button>
                  </div>
                  {needsOvernight && (
                    <div className="bg-[#a78bfa]/20 p-2 rounded text-[9px]">
                      We'll make sure there's space for you!
                    </div>
                  )}
                </div>

                <div className="pokemon-dialog p-3 space-y-2">
                  <p className="text-[10px]">Anything else I should know?</p>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Or just leave a note!"
                    className="pokemon-input w-full h-20 resize-none text-[10px]"
                  />
                </div>

                <button
                  onClick={nextStage}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  CONTINUE
                </button>
              </div>
            )}
          </>
        )}

        {stage === "ready" && (
          <>
            <TypewriterText
              text="Alright! Time to make your decision..."
              speed={35}
              onComplete={advanceText}
            />
            {textIndex >= 1 && (
              <div className="mt-4">
                <TypewriterText
                  text="Will you accept this invitation and tumble into WONDERLAND?"
                  speed={35}
                  onComplete={advanceText}
                />
              </div>
            )}
            {textIndex >= 2 && (
              <div className="mt-4">
                <button
                  onClick={handleContinue}
                  className="pokemon-btn pokemon-btn-primary w-full"
                >
                  TO THE RSVP!
                </button>
              </div>
            )}
          </>
        )}
      </DialogBox>
    </div>
  );
}
