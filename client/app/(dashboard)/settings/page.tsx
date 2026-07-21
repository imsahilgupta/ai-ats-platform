"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InvoicesList } from "@/components/dashboard/subscription/invoices-list";
import { AppearanceSettings } from "@/components/dashboard/settings/appearance-settings";
import { SecuritySettings } from "@/components/dashboard/settings/security-settings";
import { NotificationPreferences } from "@/components/dashboard/settings/notification-preferences";
import { ApiKeysSettings } from "@/components/dashboard/settings/api-keys-settings";
import { useCurrentUser } from "@/providers/auth-provider";
import { useSubscriptionQuery } from "@/hooks/use-subscription";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useSubscriptionQuery();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="Configure your account, security, and preferences." />

      <Tabs defaultValue="account">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="space-y-4">
            <div>
              <Label className="mb-2">Username</Label>
              <Input value={user?.username ?? ""} disabled />
            </div>
            <div>
              <Label className="mb-2">Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <Button variant="outline" render={<Link href="/profile" />}>
              Edit in Profile
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="billing">
          {isLoading || !data ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 text-sm">
                <p className="text-muted-foreground">
                  Current plan: <span className="font-medium text-foreground">{data.subscription.plan}</span>
                </p>
              </div>
              <InvoicesList subscription={data.subscription} />
              <Button variant="outline" render={<Link href="/subscription" />}>
                Manage subscription
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
