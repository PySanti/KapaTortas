import Image from "next/image";

export default function Migaja({ path = "", alt = "", className }: {path: string, alt: string, className?: string}) {
    return (
        <div className={`${className} w-[10vw]`}>
            <Image
                src={path}
                alt={ alt }
                width={200}
                height={200}
            />   
        </div>
         
    )
}