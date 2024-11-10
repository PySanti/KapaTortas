import Image from "next/image";

import homePhoto from "@/public/images/eyes-1.png"

export default function Eyes() {
    return (
        <div className="w-[20vw] md:w-[15vw] lg:w-[10vw] xl:w-[7vw] transform -rotate-12">
            <Image
                src={homePhoto}
                alt="Logo"
                layout="responsive"
                width={100}
                height={100}
                priority
            />   
        </div>
         
    )
}