import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileView } from "../lib/types";

type PhotoGalleryProps = {
  images: ProfileView["images"];
  placeholder: string;
  /** Corner style etc. of each photo. */
  imageClassName?: string;
  /** Classes of the empty state (border/text colour fitting the theme). */
  emptyClassName?: string;
  /** Columns from `sm` up when there are several photos. */
  columns?: 2 | 3 | 4;
  className?: string;
};

const COLUMNS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" } as const;

/**
 * The person's photos for any theme: one photo large, several in a grid of portrait tiles.
 * Without photos it shows a placeholder (only visible in the editor's live page today).
 */
export function PhotoGallery({
  images,
  placeholder,
  imageClassName = "rounded-lg",
  emptyClassName = "border-current/20 text-current/50",
  columns = 3,
  className,
}: PhotoGalleryProps) {
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm",
          emptyClassName,
          className,
        )}
      >
        <ImageIcon className="size-6" aria-hidden="true" />
        <p>{placeholder}</p>
      </div>
    );
  }

  if (images.length === 1) {
    const [image] = images;
    return (
      <div className={className}>
        <img src={image?.url} alt={image?.alt} className={cn("max-h-[34rem] w-full object-cover", imageClassName)} />
      </div>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-3", COLUMNS[columns], className)}>
      {images.map((image) => (
        <li key={image.id}>
          <img src={image.url} alt={image.alt} loading="lazy" className={cn("aspect-[4/5] w-full object-cover", imageClassName)} />
        </li>
      ))}
    </ul>
  );
}
