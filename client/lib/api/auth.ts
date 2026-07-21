import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/types/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from "@/types/auth";

export function register(payload: RegisterPayload) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiFetch<AuthResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resendVerification(email: string) {
  return apiFetch<{ message: string }>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiFetch<{ message: string }>("/auth/logout");
}

export async function getMe(): Promise<User | null> {
  try {
    const data = await apiFetch<{ message: string; user: User }>("/auth/get-me");
    return data.user;
  } catch (error) {
    // Only clear the cookie on a definitive rejection (bad/blacklisted token,
    // or the user record is gone) — proxy.ts only checks cookie *presence*,
    // so an uncleared cookie here would bounce the browser between /login and
    // /dashboard forever. A network hiccup or 5xx is NOT proof the session is
    // invalid, so don't nuke a perfectly good cookie over a transient error.
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
      try {
        await logout();
      } catch {
        // ignore — token may already be invalid/expired server-side too
      }
    }
    return null;
  }
}

export function updateUsername(username: string) {
  return apiFetch<AuthResponse>("/auth/update-username", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });
}

export function deleteAccount() {
  return apiFetch<{ message: string }>("/auth/delete-account", {
    method: "DELETE",
  });
}

export function forgotPassword(email: string) {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
