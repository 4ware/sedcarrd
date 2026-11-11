/** Turns Set-Cookie response headers into a Cookie request header. */
export function sessionCookie(response: Response) {
  // happy-dom (preloaded for component tests) swaps in its own Headers without reliable
  // getSetCookie(), so fall back to the combined header.
  const setCookies =
    typeof response.headers.getSetCookie === "function" && response.headers.getSetCookie().length > 0
      ? response.headers.getSetCookie()
      : (response.headers.get("set-cookie") ?? "").split(/,(?=\s*[\w.-]+=)/);
  return setCookies
    .map((c) => c.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}
