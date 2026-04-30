"use client";

import DialogBox from "@/components/DialogBox";
import StarField from "@/components/StarField";
import TypewriterText from "@/components/TypewriterText";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface Signup {
  id: string;
  name: string;
  item: string;
}

export default function AlcoholPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [item, setItem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const fetchSignups = async () => {
    try {
      const res = await fetch("/api/alcohol");
      const data = await res.json();
      if (data.success) {
        setSignups(data.signups);
      }
    } catch (error) {
      console.error("Failed to fetch signups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "BYOB Signup | MotoGParty";
    fetchSignups();

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = client
      .channel("alcohol_signups")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alcohol_signups" },
        () => fetchSignups()
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !item.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/alcohol/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, item }),
        });
        const data = await res.json();
        if (data.success) {
          setSignups((prev) =>
            prev.map((s) => (s.id === editingId ? data.signup : s))
          );
        }
      } else {
        const res = await fetch("/api/alcohol", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, item }),
        });
        const data = await res.json();
        if (data.success) {
          setSignups((prev) => [...prev, data.signup]);
        }
      }
      resetForm();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (signup: Signup) => {
    setEditingId(signup.id);
    setName(signup.name);
    setItem(signup.item);
    setShowForm(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/alcohol/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSignups((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setItem("");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundImage: "url('/images/moto.gif')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="fixed inset-0 bg-black/60 z-0" />
      <StarField />
      <div className="w-full max-w-md space-y-6 relative z-20">
        <h1 className="text-center text-2xl font-bold text-white tracking-wider">
          BRING A BOTTLE
        </h1>

        <DialogBox>
          <TypewriterText
            text="Showing up with the same bottle as someone else..."
            speed={30}
            onComplete={() => setTimeout(() => setTextIndex(1), 600)}
          />
          {textIndex >= 1 && (
            <div className="mt-2">
              <TypewriterText
                text="Is just as bad as showing up on the same bike."
                speed={30}
                onComplete={() => setTimeout(() => setTextIndex(2), 400)}
              />
            </div>
          )}
          {textIndex >= 2 && (
            <div className="mt-2">
              <TypewriterText
                text="Sign up so we don't end up with 5 bottles of Titos!"
                speed={30}
                onComplete={() => setTimeout(() => setTextIndex(3), 400)}
              />
            </div>
          )}

          {textIndex < 3 ? null : loading ? (
            <p className="text-center text-sm mt-4">Loading...</p>
          ) : (
            <div className="mt-4">
              {signups.length === 0 ? (
                <p className="text-center text-sm text-[#9ca3af] mb-4">
                  No signups yet. Be the first!
                </p>
              ) : (
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {signups.map((signup) => (
                    <div
                      key={signup.id}
                      className="flex items-center justify-between bg-[#1e1e1e] border-2 border-[#f97316] rounded px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-white">{signup.name}</span>
                        <span className="mx-2 text-[#9ca3af]">-</span>
                        <span className="text-[#9ca3af]">{signup.item}</span>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {deletingId === signup.id ? (
                          <>
                            <button
                              onClick={() => handleDeleteConfirm(signup.id)}
                              className="text-xs px-2 py-1 bg-[#ef4444] text-white rounded hover:bg-[#dc2626]"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs px-2 py-1 bg-[#4b5563] text-white rounded hover:bg-[#374151]"
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(signup)}
                              className="text-xs px-2 py-1 bg-[#f97316] text-black rounded hover:bg-[#ea580c]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingId(signup.id)}
                              className="text-xs px-2 py-1 bg-[#ef4444] text-white rounded hover:bg-[#dc2626]"
                            >
                              X
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showForm ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pokemon-input w-full"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="What you're bringing"
                    className="pokemon-input w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={!name.trim() || !item.trim() || submitting}
                      className="pokemon-btn pokemon-btn-primary flex-1"
                    >
                      {submitting ? "..." : editingId ? "UPDATE" : "ADD"}
                    </button>
                    <button onClick={resetForm} className="pokemon-btn flex-1">
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="pokemon-btn pokemon-btn-primary w-full flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span> ADD ITEM
                </button>
              )}
            </div>
          )}
        </DialogBox>
      </div>
    </main>
  );
}
