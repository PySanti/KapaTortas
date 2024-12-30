import Image from "next/image";

import miga from "../../../../public/images/miga-festival.png";

export default function GalleryImage({
  path = "",
  alt,
  className = "",
}: {
  path?: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={miga || path}
      alt={alt}
      width={150}
      height={150}
      className={` ${className} `}
      priority
    />
  );
}
