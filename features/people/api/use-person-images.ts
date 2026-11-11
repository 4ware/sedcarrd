"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import type { PersonImageView } from "../lib/images";
import { peopleKeys } from "./queries";

/**
 * Puts a fresh image list into the cached person (the editor reads images from there) and refreshes
 * the people list (its thumbnail is the first photo).
 */
function useSetImages(personId: string) {
  const queryClient = useQueryClient();
  return (images: PersonImageView[]) => {
    queryClient.setQueryData(peopleKeys.detail(personId), (person: { images: PersonImageView[] } | undefined) =>
      person ? { ...person, images } : person,
    );
    return queryClient.invalidateQueries({ queryKey: peopleKeys.list() });
  };
}

/**
 * Registers files that were just uploaded to S3 via useUploadFiles (route "personImages").
 * The server checks that each object exists under the person's prefix before saving it.
 */
export function useRegisterPersonImages(personId: string) {
  const setImages = useSetImages(personId);
  return useMutation({
    mutationFn: (images: { key: string; name: string }[]) => unwrap(api.people({ id: personId }).images.post({ images })),
    onSuccess: setImages,
  });
}

/** Deletes an image (database row and S3 object). */
export function useDeletePersonImage(personId: string) {
  const setImages = useSetImages(personId);
  return useMutation({
    mutationFn: (imageId: string) => unwrap(api.people({ id: personId }).images({ imageId }).delete()),
    onSuccess: setImages,
  });
}
