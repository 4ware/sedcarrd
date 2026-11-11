/** Limits and formats for person images (shared by the upload route, the API and the UI). */
export const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
} as const;

export const IMAGE_TYPES = Object.keys(IMAGE_EXTENSIONS) as (keyof typeof IMAGE_EXTENSIONS)[];

/** Per file. */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
/** Per upload (one drop / selection). */
export const MAX_IMAGES_PER_UPLOAD = 10;
/** In total per person. */
export const MAX_IMAGES_PER_PERSON = 24;

/** An image as the API returns it: `url` is a short-lived signed GET URL. */
export type PersonImageView = { id: string; name: string; url: string };
