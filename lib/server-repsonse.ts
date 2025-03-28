export class ServerResponse {
  static success<T>(data: T) {
    return { success: true, data } as const;
  }

  static fail(error: string) {
    return { success: false, error } as const;
  }
}
