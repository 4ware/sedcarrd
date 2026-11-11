/** Error thrown for non-2xx API responses so TanStack Query puts the query/mutation into its error state. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly value: unknown,
  ) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
  }
}

type EdenResult = { data: unknown; error: { status: unknown; value: unknown } | null };

/** Turns Eden's `{ data, error }` result into "return data or throw", which is what TanStack Query expects. */
export async function unwrap<R extends EdenResult>(request: Promise<R>): Promise<Exclude<R["data"], null>> {
  const { data, error } = await request;
  if (error) throw new ApiError(typeof error.status === "number" ? error.status : 500, error.value);
  return data as Exclude<R["data"], null>;
}
