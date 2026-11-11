type ProfilePhotoProps = {
  photo?: { src: string; alt: string };
  children?: React.ReactNode;
};

/** Headshot area. Falls back to a moody gradient placeholder when no photo is given. Children are overlaid. */
export function ProfilePhoto({ photo, children }: ProfilePhotoProps) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-olive">
      {photo ? (
        <img src={photo.src} alt={photo.alt} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div
          data-testid="profile-photo-placeholder"
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,#6b7a62_0%,#45533f_45%,#2a3327_100%)]"
        />
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      {children}
    </div>
  );
}
