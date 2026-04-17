"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DialogBoxProps {
  children: ReactNode;
  className?: string;
  showContinue?: boolean;
  onContinue?: () => void;
}

export default function DialogBox({
  children,
  className = "",
  showContinue = false,
  onContinue,
}: DialogBoxProps) {
  return (
    <div
      className={cn(
        "pokemon-dialog p-4 sm:p-6 text-[10px] sm:text-xs leading-relaxed",
        className
      )}
      onClick={onContinue}
    >
      {children}
      {showContinue && (
        <div className="flex justify-end mt-4">
          <span className="text-[8px] sm:text-[10px] animate-bounce">
            [TAP TO CONTINUE]
          </span>
        </div>
      )}
    </div>
  );
}
