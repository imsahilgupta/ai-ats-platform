export interface ApiErrorBody {
  message: string;
  limit?: number;
  resetAt?: string;
  errors?: string[];
  requiresVerification?: boolean;
  email?: string;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body?.message || "Something went wrong");
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
