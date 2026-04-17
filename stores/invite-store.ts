import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RsvpStatus = "yes" | "no" | "maybe";

export interface Invitee {
  actual_name: string;
  phone: string;
  greeting_nickname: string | null;
}

interface InviteState {
  // User data
  phone: string | null;
  isVerified: boolean;
  invitee: Invitee | null;
  guestName: string | null;

  // Party details
  hasViewedDetails: boolean;
  plusOne: boolean;
  plusOneName: string | null;
  needsOvernight: boolean;
  additionalNotes: string | null;

  // RSVP
  rsvpStatus: RsvpStatus | null;
  userBirthday: string | null;
  birthdayPrompted: boolean;

  // Timestamps
  submittedAt: string | null;
  lastModified: string | null;

  // Actions
  setPhone: (phone: string) => void;
  setVerified: (verified: boolean) => void;
  setInvitee: (invitee: Invitee | null) => void;
  setGuestName: (name: string) => void;
  setPartyDetails: (details: {
    plusOne: boolean;
    plusOneName?: string;
    needsOvernight: boolean;
    additionalNotes?: string;
  }) => void;
  setRsvpStatus: (status: RsvpStatus) => void;
  setUserBirthday: (birthday: string) => void;
  setBirthdayPrompted: (prompted: boolean) => void;
  restoreFromDb: (data: {
    rsvpStatus?: RsvpStatus | null;
    plusOne?: boolean;
    plusOneName?: string | null;
    needsOvernight?: boolean;
    additionalNotes?: string | null;
    birthdayPrompted?: boolean;
  }) => void;
  submitRsvp: () => void;
  reset: () => void;

  // Computed
  getDisplayName: () => string;
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set, get) => ({
      // Initial state
      phone: null,
      isVerified: false,
      invitee: null,
      guestName: null,
      hasViewedDetails: false,
      plusOne: false,
      plusOneName: null,
      needsOvernight: false,
      additionalNotes: null,
      rsvpStatus: null,
      userBirthday: null,
      birthdayPrompted: false,
      submittedAt: null,
      lastModified: null,

      // Actions
      setPhone: (phone) => set({ phone }),

      setVerified: (verified) => set({ isVerified: verified }),

      setInvitee: (invitee) => set({ invitee }),

      setGuestName: (name) => set({ guestName: name }),

      setPartyDetails: (details) =>
        set({
          plusOne: details.plusOne,
          plusOneName: details.plusOneName || null,
          needsOvernight: details.needsOvernight,
          additionalNotes: details.additionalNotes || null,
          hasViewedDetails: true,
        }),

      setRsvpStatus: (status) => set({ rsvpStatus: status }),

      setUserBirthday: (birthday) => set({ userBirthday: birthday }),

      setBirthdayPrompted: (prompted) => set({ birthdayPrompted: prompted }),

      restoreFromDb: (data) =>
        set({
          rsvpStatus: data.rsvpStatus ?? null,
          plusOne: data.plusOne ?? false,
          plusOneName: data.plusOneName ?? null,
          needsOvernight: data.needsOvernight ?? false,
          additionalNotes: data.additionalNotes ?? null,
          birthdayPrompted: data.birthdayPrompted ?? false,
          submittedAt: data.rsvpStatus ? new Date().toISOString() : null,
          hasViewedDetails: true,
        }),

      submitRsvp: () => {
        const now = new Date().toISOString();
        set((state) => ({
          submittedAt: state.submittedAt || now,
          lastModified: now,
        }));
      },

      reset: () =>
        set({
          phone: null,
          isVerified: false,
          invitee: null,
          guestName: null,
          hasViewedDetails: false,
          plusOne: false,
          plusOneName: null,
          needsOvernight: false,
          additionalNotes: null,
          rsvpStatus: null,
          userBirthday: null,
          birthdayPrompted: false,
          submittedAt: null,
          lastModified: null,
        }),

      getDisplayName: () => {
        const { invitee, guestName } = get();
        if (invitee) {
          return invitee.greeting_nickname || invitee.actual_name;
        }
        return guestName || "Friend";
      },
    }),
    {
      name: "wonderland-invite-storage",
      partialize: (state) => ({
        phone: state.phone,
        isVerified: state.isVerified,
        invitee: state.invitee,
        guestName: state.guestName,
        hasViewedDetails: state.hasViewedDetails,
        plusOne: state.plusOne,
        plusOneName: state.plusOneName,
        needsOvernight: state.needsOvernight,
        additionalNotes: state.additionalNotes,
        rsvpStatus: state.rsvpStatus,
        userBirthday: state.userBirthday,
        birthdayPrompted: state.birthdayPrompted,
        submittedAt: state.submittedAt,
        lastModified: state.lastModified,
      }),
    }
  )
);
