"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV, type DashboardNavItem } from "@/lib/constants";
import { UsageMeter } from "@/components/shared/usage-meter";

function NavGroup({ label, items, pathname }: { label: string; items: DashboardNavItem[]; pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton isActive={isActive} tooltip={item.title} render={<Link href={item.href} />}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" />
          </span>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            MockMate<span className="text-primary">.AI</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Practice" items={DASHBOARD_NAV.practice} pathname={pathname} />
        <NavGroup label="Insights" items={DASHBOARD_NAV.insights} pathname={pathname} />
        <NavGroup label="Account" items={DASHBOARD_NAV.account} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <UsageMeter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
