import { apiFetch } from "@/lib/api/client";
import type {
  EsewaInitiatePayload,
  EsewaInitiateResponse,
  EsewaVerifyPayload,
  PaymentVerifyResponse,
} from "@/types/payment";

export function initiateEsewaPayment(payload: EsewaInitiatePayload) {
  return apiFetch<EsewaInitiateResponse>("/payment/esewa/initiate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyEsewaPayment(payload: EsewaVerifyPayload) {
  return apiFetch<PaymentVerifyResponse>("/payment/esewa/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
