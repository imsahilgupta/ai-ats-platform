export type NotificationType = "reminder" | "system" | "interview";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  emailSent: boolean;
  scheduledFor: string;
  read: boolean;
}
