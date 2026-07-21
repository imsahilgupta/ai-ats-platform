"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { ADMIN_NAV } from "@/lib/constants";

function pageTitle(pathname: string) {
  const match = ADMIN_NAV.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.title ?? "Admin";
}

export function AdminTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="flex-1 truncate text-sm font-medium text-foreground">{pageTitle(pathname)}</h1>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <UserMenu />
      </div>
    </header>
  );
}
