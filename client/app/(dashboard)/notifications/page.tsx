"use client";

import { Bell, CheckCheck, Info, Mic, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/hooks/use-notifications";
import type { NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, typeof Info> = {
  reminder: Bell,
  system: Info,
  interview: Mic,
};

export default function NotificationsPage() {
  const { data, isLoading } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = data ?? [];
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Notifications"
        description="Reminders, tips, and updates about your account."
        action={
          hasUnread ? (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Sparkles} title="You're all caught up" description="No notifications right now." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = TYPE_ICON[notification.type];
            return (
              <button
                key={notification.id}
                onClick={() => !notification.read && markRead.mutate(notification.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  notification.read ? "border-border bg-card" : "border-primary/30 bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(notification.scheduledFor).toLocaleString()}
                  </p>
                </div>
                {!notification.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
