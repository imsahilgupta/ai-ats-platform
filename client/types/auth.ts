export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}
