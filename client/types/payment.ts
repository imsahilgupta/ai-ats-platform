import type { Plan } from "@/types/subscription";

export interface EsewaInitiatePayload {
  plan: Plan;
}

export interface EsewaInitiateResponse {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  esewa_url: string;
}

export interface EsewaVerifyPayload {
  data: string;
}

export interface PaymentVerifyResponse {
  message: string;
  subscription: import("@/types/subscription").Subscription;
}
