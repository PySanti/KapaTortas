import { Producto } from "@/app/models/Producto";
import Image from "next/image";


export default function ProductImage({ path = "", alt, className = "" }: { path?: string, alt: string, className?: string }) {
    return (
        <Image src={ path } alt={ alt } width={500} height={500} className={`w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] object-cover object-center rounded-md ${className }`} />
    )
}