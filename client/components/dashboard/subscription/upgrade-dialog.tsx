"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { initiateEsewaPayment } from "@/lib/api/payment";
import { ApiError } from "@/types/api";
import type { EsewaInitiateResponse } from "@/types/payment";
import type { Plan } from "@/types/subscription";
import { EsewaAutoSubmitForm } from "@/components/dashboard/subscription/esewa-auto-submit-form";

export function UpgradeDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const esewaMutation = useMutation({
    mutationFn: initiateEsewaPayment,
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to start eSewa payment.");
    },
  });

  if (esewaMutation.data) {
    return <EsewaAutoSubmitForm payment={esewaMutation.data as EsewaInitiateResponse} />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to {plan}</DialogTitle>
          <DialogDescription>Continue to payment to activate your plan.</DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 py-4"
          disabled={!plan || esewaMutation.isPending}
          onClick={() => plan && esewaMutation.mutate({ plan })}
        >
          {esewaMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : <Wallet className="size-5" />}
          Pay with eSewa
        </Button>
      </DialogContent>
    </Dialog>
  );
}
