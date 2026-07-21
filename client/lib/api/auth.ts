import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/types/api";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

export function register(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
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

// No backend route exists for these yet — kept as signature-compatible stubs
// (see plan: forgot/reset password are UI previews, not persisted server-side).
export function requestPasswordReset(_email: string) {
  return new Promise<{ message: string }>((resolve) => {
    setTimeout(() => resolve({ message: "If an account exists, a reset link was sent." }), 900);
  });
}

export function resetPassword(_token: string, _password: string) {
  return new Promise<{ message: string }>((resolve) => {
    setTimeout(() => resolve({ message: "Password reset successfully." }), 900);
  });
}
