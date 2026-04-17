"use client";

interface ProfessorSpriteProps {
  className?: string;
  bounce?: boolean;
}

export default function ProfessorSprite({
  className = "",
  bounce = true,
}: ProfessorSpriteProps) {
  return (
    <div className={`${bounce ? "sprite-bounce" : ""} ${className}`}>
      {/* Simple pixel-art style professor using CSS/emoji */}
      <div className="relative w-24 h-32 mx-auto">
        {/* Lab coat body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-16 bg-white rounded-t-lg border-4 border-[#1a1c2c]" />

        {/* Head */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#f5d6ba] rounded-full border-4 border-[#1a1c2c]">
          {/* Hair */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-8 bg-[#8b7355] rounded-t-full border-t-4 border-x-4 border-[#1a1c2c]" />

          {/* Eyes */}
          <div className="absolute top-6 left-3 w-2 h-2 bg-[#1a1c2c] rounded-full" />
          <div className="absolute top-6 right-3 w-2 h-2 bg-[#1a1c2c] rounded-full" />

          {/* Smile */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-[#1a1c2c] rounded-b-full" />
        </div>

        {/* Glasses */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-5 h-4 border-2 border-[#1a1c2c] rounded bg-[#a8d8ff]/30" />
          <div className="w-5 h-4 border-2 border-[#1a1c2c] rounded bg-[#a8d8ff]/30" />
        </div>
      </div>
    </div>
  );
}
