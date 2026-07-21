import type { AppNotification } from "@/types/notification";

// No backend routes exist for notifications yet (the `Notification` Mongoose
// model exists server-side but is never wired to an endpoint). This mock store
// mirrors the real model shape so swapping in real routes later only requires
// replacing the bodies of these functions, not their signatures or callers.
const STORAGE_KEY = "mockmate.notifications.v1";

function seedNotifications(): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      type: "interview",
      message: "Your mock interview report is ready to review.",
      emailSent: false,
      scheduledFor: new Date(now - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: "seed-2",
      type: "system",
      message: "Welcome to MockMate.AI! Complete your profile to get personalized tips.",
      emailSent: true,
      scheduledFor: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
      read: false,
    },
    {
      id: "seed-3",
      type: "reminder",
      message: "You have 2 mock interviews left this month on the FREE plan.",
      emailSent: false,
      scheduledFor: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      read: true,
    },
  ];
}

function readStore(): AppNotification[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedNotifications();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

function writeStore(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export async function getNotifications(): Promise<AppNotification[]> {
  return readStore().sort(
    (a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime(),
  );
}

export async function addNotification(
  input: Pick<AppNotification, "type" | "message">,
): Promise<AppNotification[]> {
  const notification: AppNotification = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    emailSent: false,
    scheduledFor: new Date().toISOString(),
    read: false,
    ...input,
  };
  const notifications = [notification, ...readStore()];
  writeStore(notifications);
  return notifications;
}

export async function markNotificationRead(id: string): Promise<AppNotification[]> {
  const notifications = readStore().map((n) => (n.id === id ? { ...n, read: true } : n));
  writeStore(notifications);
  return notifications;
}

export async function markAllNotificationsRead(): Promise<AppNotification[]> {
  const notifications = readStore().map((n) => ({ ...n, read: true }));
  writeStore(notifications);
  return notifications;
}
