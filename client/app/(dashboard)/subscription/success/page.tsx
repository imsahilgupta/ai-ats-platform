"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { verifyEsewaPayment } from "@/lib/api/payment";
import { addNotification } from "@/lib/api/notifications";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";

function VerifyPayment() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const data = searchParams.get("data");

  const mutation = useMutation({
    mutationFn: async () => {
      if (data) {
        return verifyEsewaPayment({ data });
      }
      throw new Error("Missing payment verification details.");
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: qk.subscription() });
      addNotification({
        type: "system",
        message: `You've been upgraded to the ${result.subscription.plan} plan. Enjoy your new benefits!`,
      }).then(() => queryClient.invalidateQueries({ queryKey: qk.notifications() }));
      toast.success(`Upgraded to ${result.subscription.plan}!`);
      setStatus("success");
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.body.message : "We couldn't verify your payment.");
      setStatus("error");
    },
  });

  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="size-6" />
        </span>
        <h1 className="text-xl font-semibold text-foreground">Payment verification failed</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
        <Button render={<Link href="/subscription" />}>Back to subscription</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="size-6" />
      </span>
      <h1 className="text-xl font-semibold text-foreground">Payment successful</h1>
      <p className="max-w-sm text-sm text-muted-foreground">Your plan has been upgraded. Enjoy unlimited practice!</p>
      <Button render={<Link href="/dashboard" />}>Go to dashboard</Button>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <VerifyPayment />
    </Suspense>
  );
}
