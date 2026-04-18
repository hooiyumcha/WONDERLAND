"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CaptchaPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/details");
  }, [router]);
  return null;
}
