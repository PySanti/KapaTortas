import Image from "next/image";

import homePhoto from "@/public/images/Home-Photo.png";

export default function HomePhoto() {
  return (
    <Image
      src={homePhoto}
      alt="Logo"
      style={{ objectFit: "cover" }}
      fill
      priority
    />
  );
}
