import Image from "next/image";

import homePhoto from "@/public/images/Home-Photo.png"

export default function HomePhoto() {
    return (
        <Image
            src={homePhoto}
            alt="Logo"
            layout="fill"
            objectFit="cover"
            priority
        />    
    )
}