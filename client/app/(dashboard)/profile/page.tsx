"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeToConfirmDialog } from "@/components/shared/confirm-dialog";
import { PhotoUpload } from "@/components/dashboard/profile/photo-upload";
import { SkillsEditor } from "@/components/dashboard/profile/skills-editor";
import { EducationList } from "@/components/dashboard/profile/education-list";
import { ExperienceList } from "@/components/dashboard/profile/experience-list";
import { SocialAccountsForm } from "@/components/dashboard/profile/social-accounts-form";
import { ResumeFileCard } from "@/components/dashboard/profile/resume-file-card";
import { useCurrentUser } from "@/providers/auth-provider";
import { useProfileDetailsQuery } from "@/hooks/use-profile-details";
import { deleteAccount, updateUsername } from "@/lib/api/auth";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const { data: details, isLoading: detailsLoading } = useProfileDetailsQuery();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: (data) => {
      queryClient.setQueryData(qk.me(), data.user);
      toast.success("Username updated");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to update username.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted");
      router.push("/login");
    },
    onError: () => toast.error("Failed to delete account."),
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Profile" description="Manage your personal information and account." />

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
        <PhotoUpload photoDataUrl={details?.photoDataUrl ?? null} username={user.username} />
        <div>
          <p className="text-lg font-semibold text-foreground">{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="background">Skills &amp; Background</TabsTrigger>
          <TabsTrigger value="resume">Resume &amp; Social</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="rounded-xl border border-border bg-card p-6">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (username.trim() && username !== user.username) {
                  updateMutation.mutate(username.trim());
                }
              }}
            >
              <div>
                <Label htmlFor="username" className="mb-2">
                  Username
                </Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input value={user.email} disabled />
              </div>
              <Button type="submit" disabled={updateMutation.isPending || username === user.username}>
                {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save changes
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="background">
          {detailsLoading || !details ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Skills</h3>
                <SkillsEditor skills={details.skills} />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Education</h3>
                <EducationList education={details.education} />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Experience</h3>
                <ExperienceList experience={details.experience} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resume">
          {detailsLoading || !details ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Resume</h3>
                <ResumeFileCard resumeFileName={details.resumeFileName} />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Social accounts</h3>
                <SocialAccountsForm social={details.social} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Password &amp; security</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your password from Settings.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" render={<Link href="/settings" />}>
                    Go to Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
              <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all associated career reports. This cannot be undone.
              </p>
              <Button variant="destructive" className="mt-4" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <TypeToConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account"
        description="This will permanently delete your account and all career reports. This action cannot be undone."
        confirmationWord={user.username}
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
