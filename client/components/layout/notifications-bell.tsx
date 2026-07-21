"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getNotifications } from "@/lib/api/notifications";
import { qk } from "@/lib/query/keys";

export function NotificationsBell() {
  const { data } = useQuery({
    queryKey: qk.notifications(),
    queryFn: getNotifications,
    staleTime: 15_000,
  });

  const unreadCount = data?.filter((n) => !n.read).length ?? 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      render={<Link href="/notifications" aria-label="Notifications" />}
    >
      <Bell />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
}
