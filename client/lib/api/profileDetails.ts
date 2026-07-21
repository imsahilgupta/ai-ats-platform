import type { ProfileDetails } from "@/types/profile";

// No backend fields exist for these beyond username/email/isAdmin
// (Backend/src/models/user.model.js) — persisted client-side only, keyed per
// browser (not per account) since there's no server storage. Structured so a
// real profile-details endpoint is a drop-in swap for these functions later.
const STORAGE_KEY = "mockmate.profileDetails.v1";

function defaults(): ProfileDetails {
  return {
    photoDataUrl: null,
    skills: [],
    education: [],
    experience: [],
    resumeFileName: null,
    social: { github: "", linkedin: "", portfolio: "" },
  };
}

function readStore(): ProfileDetails {
  if (typeof window === "undefined") return defaults();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaults();
  try {
    return { ...defaults(), ...JSON.parse(raw) } as ProfileDetails;
  } catch {
    return defaults();
  }
}

function writeStore(details: ProfileDetails) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
}

export async function getProfileDetails(): Promise<ProfileDetails> {
  return readStore();
}

export async function updateProfileDetails(patch: Partial<ProfileDetails>): Promise<ProfileDetails> {
  const next = { ...readStore(), ...patch };
  writeStore(next);
  return next;
}
