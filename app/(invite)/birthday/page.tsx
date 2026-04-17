"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BirthdayPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/thanks");
  }, [router]);
  return null;
}
