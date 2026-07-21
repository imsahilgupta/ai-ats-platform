export type Plan = "FREE" | "PRO" | "ENTERPRISE";

export interface Subscription {
  _id: string;
  user: string;
  plan: Plan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  mockInterviewUsageCount: number;
  mockInterviewUsageResetAt: string;
}

export interface UpgradeSubscriptionPayload {
  plan: Plan;
}
