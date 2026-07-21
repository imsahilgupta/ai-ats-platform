"use client";

import { useEffect, useRef } from "react";
import type { EsewaInitiateResponse } from "@/types/payment";

// eSewa's gateway requires a classic multipart form POST — it rejects
// fetch/XHR — so this renders a real hidden <form> and auto-submits it once
// on mount to perform an actual browser navigation to the eSewa-hosted page.
export function EsewaAutoSubmitForm({ payment }: { payment: EsewaInitiateResponse }) {
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    formRef.current?.submit();
  }, []);

  const fields: Record<string, string | number> = {
    amount: payment.amount,
    tax_amount: payment.tax_amount,
    total_amount: payment.total_amount,
    transaction_uuid: payment.transaction_uuid,
    product_code: payment.product_code,
    product_service_charge: payment.product_service_charge,
    product_delivery_charge: payment.product_delivery_charge,
    success_url: payment.success_url,
    failure_url: payment.failure_url,
    signed_field_names: payment.signed_field_names,
    signature: payment.signature,
  };

  return (
    <form id="esewa-auto-submit-form" method="POST" action={payment.esewa_url} ref={formRef}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </form>
  );
}
