import Image from "next/image";

import logo from "@/public/images/Orange.png"

export default function GalleryImage({ path = "", alt, className = "" }: { path?: string, alt: string, className?: string }) {
    return (
        <Image
            src={path}
            alt={ alt }
            width={150}
            height={150}
            className={` ${className} `}
            priority
        />    
    )
}