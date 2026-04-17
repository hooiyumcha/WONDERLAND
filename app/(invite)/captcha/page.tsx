"use client";

import DialogBox from "@/components/DialogBox";
import TypewriterText from "@/components/TypewriterText";
import { cn } from "@/lib/utils";
import { useInviteStore } from "@/stores/invite-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Image sets
const BICYCLE_IMAGES = [
  "/captcha/bicycle1.jpg",
  "/captcha/bicycle2.avif",
  "/captcha/bicycle3.jpeg",
];

const RANDOM_IMAGES = [
  "/captcha/random1.jpeg",
  "/captcha/random2.jpeg",
  "/captcha/random3.jpeg",
  "/captcha/random4.jpeg",
  "/captcha/random5.jpeg",
  "/captcha/random6.jpeg",
];

const ELI_IMAGE = "/captcha/eli.jpeg";
const ELI_FROG_IMAGE = "/captcha/eli frog.png";

const PUMPKIN_IMAGES = [
  "/captcha/pumpkin1.png",
  "/captcha/pumpkin2.png",
  "/captcha/pumpkin3.png",
  "/captcha/pumpkin4.png",
  "/captcha/pumpkin5.png",
  "/captcha/pumpkin6.png",
  "/captcha/Pumpkin7.png",
  "/captcha/pumpkin8.png",
];

const PUMPKIN9_IMAGE = "/captcha/Pumpkin9.jpeg";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const CAPTCHA_PROMPTS = {
  1: "Select all squares with BICYCLES!",
  2: "Which one is DIFFERENT from the others?",
  3: "Which one is ELI'S BABY PHOTO?",
};

export default function CaptchaPage() {
  const router = useRouter();
  const { captchaStage, advanceCaptcha, captchaComplete, isVerified } =
    useInviteStore();
  const [showIntro, setShowIntro] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!isVerified) {
      router.replace("/verify");
    }
  }, [isVerified, router]);

  useEffect(() => {
    if (captchaComplete) {
      router.push("/details");
    }
  }, [captchaComplete, router]);

  // Generate randomized image grids for each stage
  const stage1Images = useMemo(() => {
    const images = [
      ...BICYCLE_IMAGES.map((src) => ({ src, isTarget: true })),
      ...RANDOM_IMAGES.map((src) => ({ src, isTarget: false })),
    ];
    return shuffleArray(images).map((img, id) => ({ ...img, id }));
  }, []);

  const stage2Images = useMemo(() => {
    const images = [
      ...Array(8)
        .fill(null)
        .map(() => ({ src: ELI_IMAGE, isTarget: false })),
      { src: ELI_FROG_IMAGE, isTarget: true },
    ];
    return shuffleArray(images).map((img, id) => ({ ...img, id }));
  }, []);

  const stage3Images = useMemo(() => {
    const images = [
      ...PUMPKIN_IMAGES.map((src) => ({ src, isTarget: false })),
      { src: PUMPKIN9_IMAGE, isTarget: true },
    ];
    return shuffleArray(images).map((img, id) => ({ ...img, id }));
  }, []);

  const getCurrentImages = () => {
    switch (captchaStage) {
      case 1:
        return stage1Images;
      case 2:
        return stage2Images;
      case 3:
        return stage3Images;
      default:
        return stage1Images;
    }
  };

  const advanceText = useCallback(() => {
    setTextIndex((prev) => prev + 1);
  }, []);

  const resetText = useCallback(() => {
    setTextIndex(0);
  }, []);

  const handleStartCaptcha = () => {
    setShowIntro(false);
    resetText();
  };

  const currentImages = getCurrentImages();

  const toggleSelect = (id: number) => {
    if (showSuccess) return;

    // Stage 2 and 3 are single-select
    if (captchaStage === 2 || captchaStage === 3) {
      setSelected([id]);
    } else {
      // Stage 1 is multi-select (bicycles)
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
  };

  const handleVerify = () => {
    const targets = currentImages
      .filter((img) => img.isTarget)
      .map((img) => img.id);

    const isCorrect =
      targets.length === selected.length &&
      targets.every((t) => selected.includes(t));

    if (isCorrect) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelected([]);
        resetText();
        advanceCaptcha();

        if (captchaStage === 3) {
          router.push("/details");
        }
      }, 800);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!isVerified) return null;

  // Show intro screen first
  if (showIntro) {
    return (
      <div className="space-y-6">
        <DialogBox>
          <TypewriterText
            text="Before we continue, please verify that you are human."
            speed={35}
            onComplete={advanceText}
          />
          {textIndex >= 1 && (
            <div className="mt-4 space-y-4">
              <button
                onClick={handleStartCaptcha}
                className="pokemon-btn pokemon-btn-primary w-full"
              >
                CONTINUE
              </button>
            </div>
          )}
        </DialogBox>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stage indicator */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "w-8 h-8 rounded border-2 border-[#1a1c2c] flex items-center justify-center text-[10px] font-bold",
              s < captchaStage && "bg-[#38b764] text-white",
              s === captchaStage && "bg-[#ffcd75] text-[#1a1c2c]",
              s > captchaStage && "bg-[#333c57] text-[#94a3b8]"
            )}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Dialog */}
      <DialogBox>
        <TypewriterText
          text={CAPTCHA_PROMPTS[captchaStage]}
          speed={30}
          onComplete={advanceText}
          showCursor={false}
        />

        {captchaStage === 3 && textIndex >= 1 && (
          <div className="mt-2">
            <TypewriterText
              text="(This is very important...)"
              speed={30}
              onComplete={advanceText}
            />
          </div>
        )}
      </DialogBox>

      {/* Captcha Grid */}
      {((captchaStage === 3 && textIndex >= 2) ||
        (captchaStage !== 3 && textIndex >= 1)) && (
        <div
          className={cn(
            "pokemon-dialog p-2 transition-transform relative",
            shake && "animate-[shake_0.5s_ease-in-out]"
          )}
          style={{
            animation: shake ? "shake 0.5s ease-in-out" : undefined,
          }}
        >
          <style jsx>{`
            @keyframes shake {
              0%,
              100% {
                transform: translateX(0);
              }
              25% {
                transform: translateX(-8px);
              }
              75% {
                transform: translateX(8px);
              }
            }
          `}</style>

          <div className="grid grid-cols-3 gap-1">
            {currentImages.map((image) => (
              <button
                key={image.id}
                onClick={() => toggleSelect(image.id)}
                disabled={showSuccess}
                className={cn(
                  "aspect-square relative overflow-hidden transition-all border-2",
                  selected.includes(image.id)
                    ? "border-[#5fcde4] border-4"
                    : "border-[#1a1c2c] hover:border-[#ffcd75]"
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 100px"
                />

                {selected.includes(image.id) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[#38b764] rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {showSuccess && (
            <div className="absolute inset-0 bg-[#38b764]/80 flex items-center justify-center rounded z-20">
              <span className="text-white text-lg font-bold">CORRECT!</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {((captchaStage === 3 && textIndex >= 2) ||
        (captchaStage !== 3 && textIndex >= 1)) && (
        <div className="flex gap-2">
          <button
            onClick={() => setSelected([])}
            className="pokemon-btn flex-1"
          >
            CLEAR
          </button>
          <button
            onClick={handleVerify}
            disabled={selected.length === 0 || showSuccess}
            className="pokemon-btn pokemon-btn-primary flex-[2]"
          >
            VERIFY
          </button>
        </div>
      )}
    </div>
  );
}
