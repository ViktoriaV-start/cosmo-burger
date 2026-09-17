export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export class NetworkError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

const MESSAGE_KEYS = ['reason', 'message', 'error', 'detail'] as const;

export const getHttpErrorMessage = (error: unknown): string | undefined => {
  if (!(error instanceof HttpError)) {
    return undefined;
  }

  const body = error.body;

  if (!body || typeof body !== 'object') {
    return undefined;
  }

  const record = body as Record<string, unknown>;

  for (const key of MESSAGE_KEYS) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
};
