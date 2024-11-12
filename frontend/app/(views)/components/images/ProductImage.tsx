import { Producto } from "@/app/models/Producto";
import Image from "next/image";


export default function ProductImage({ path = "", alt, className = "" }: { path?: string, alt: string, className?: string }) {
    return (
        <Image src={ path } alt={ alt } width={500} height={500} className={`"h-full w-auto object-cover object-center" ${className}`} />
    )
}