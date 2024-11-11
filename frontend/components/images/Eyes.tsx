import Image from "next/image";

import eyes from "@/public/images/eyes-1.png";

export default function Eyes() {
  return (
    <div className="w-[20vw] md:w-[15vw] lg:w-[10vw] xl:w-[7vw] transform -rotate-12">
      <Image
        src={eyes}
        alt="Logo"
        width={100}
        height={100}
        style={{ width: "100%", height: "auto" }}
        priority
      />
    </div>
  );
}
