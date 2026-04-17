"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/verify");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-2xl">Loading...</div>
    </main>
  );
}
