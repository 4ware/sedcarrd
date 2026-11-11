import { GlobalRegistrator } from "@happy-dom/global-registrator";

// happy-dom replaces the fetch API with browser-like versions that, among other things, strip
// Set-Cookie from responses. Server/API tests share this process, so keep Bun's native ones.
// (FormData stays happy-dom's: it must read happy-dom <form> elements.)
const native = {
  fetch: globalThis.fetch,
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
  AbortController: globalThis.AbortController,
  AbortSignal: globalThis.AbortSignal,
  URL: globalThis.URL,
  URLSearchParams: globalThis.URLSearchParams,
  Blob: globalThis.Blob,
  File: globalThis.File,
  ReadableStream: globalThis.ReadableStream,
};

GlobalRegistrator.register();

Object.assign(globalThis, native);
