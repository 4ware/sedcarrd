"use client";

import { useUploadFiles } from "@better-upload/client";
import { CircleAlertIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGES_PER_PERSON,
  MAX_IMAGES_PER_UPLOAD,
  type PersonImageView,
  useDeletePersonImage,
  useRegisterPersonImages,
} from "@/features/people";

type EditorPhotosProps = { personId: string; images: PersonImageView[] };

/**
 * Upload (better-upload: the browser sends the files straight to S3 with pre-signed URLs, then they
 * are registered with the person) and delete photos. Changes are saved immediately.
 */
export function EditorPhotos({ personId, images }: EditorPhotosProps) {
  const t = useTranslations("Editor.photos");
  const register = useRegisterPersonImages(personId);
  const remove = useDeletePersonImage(personId);
  const { control } = useUploadFiles({
    route: "personImages",
    onUploadComplete: ({ files }) =>
      register.mutate(files.map((file) => ({ key: file.objectInfo.key, name: file.name }))),
  });

  const full = images.length >= MAX_IMAGES_PER_PERSON;
  const failed = control.error ?? register.error ?? remove.error;

  return (
    <div className="flex flex-col gap-5">
      {failed ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertDescription>{t("error")}</AlertDescription>
        </Alert>
      ) : null}

      {full ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          {t("full", { max: MAX_IMAGES_PER_PERSON })}
        </p>
      ) : (
        <UploadDropzone
          control={control}
          accept={IMAGE_TYPES.join(",")}
          metadata={{ personId }}
          title={t("dropzone")}
          dropTitle={t("drop")}
          description={t("limits", {
            perUpload: MAX_IMAGES_PER_UPLOAD,
            size: Math.round(MAX_IMAGE_SIZE / 1024 / 1024),
          })}
        />
      )}

      {images.length > 0 ? (
        <ul aria-label={t("listLabel")} className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <li key={image.id} className="group relative">
              <img
                src={image.url}
                alt={t("thumbnailAlt", { index: index + 1 })}
                className="aspect-square w-full rounded-md object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(image.id)}
                aria-label={t("delete", { index: index + 1 })}
                className="absolute top-1 right-1 opacity-90 shadow-sm"
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="text-xs text-muted-foreground">{t("count", { count: images.length, max: MAX_IMAGES_PER_PERSON })}</p>
    </div>
  );
}
