import Image from "next/image";

export default function Torta({
  path = "",
  alt = "",
  className,
}: {
  path: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} -ml-20 w-[60vw] xs:w-[50vw] xs:-ml-24 sm:w-[40vw] md:-ml-24 md:w-[40vw] lg:-ml-24 xl:ml-0  lg:w-[30vw]`}
    >
      <Image src={path} alt={alt} width={550} height={550} />
    </div>
  );
}
