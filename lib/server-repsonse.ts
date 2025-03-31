export type ServerSuccess<T> = {
  readonly success: true;
  readonly data: T;
}

export type ServerFailure = {
  readonly success: false;
  readonly error: string;
}

export type ServerResponseType<T> = ServerSuccess<T> | ServerFailure;

export class ServerResponse {
  static success<T>(data: T): ServerSuccess<T> {
    return { success: true, data } as const;
  }

  static fail(error: string): ServerFailure {
    return { success: false, error } as const;
  }
}
