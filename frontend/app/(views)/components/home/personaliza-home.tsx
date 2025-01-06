"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function PersonalizaHome() {
  const router = useRouter();

  return (
    <section className="bg-secondary shadow-lg py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-primary text-3xl font-semibold lg:text-4xl">
            Personalizar Torta
          </h1>
          <p className="text-[#8B4513] text-medium mb-4">
            ¡¡Personaliza tu torta!!, puedes elegir todas las capas que tu
            quieras con una gran variedad de sabores
          </p>
          <Button
            asChild
            className="text-lg hover:bg-[#A34D16] hover:cursor-pointer text-white rounded-full py-2"
            onClick={() => router.push("/products/personalizar")}
          >
            <p>Ver Especialidades</p>
          </Button>
        </div>
      </div>
    </section>
  );
}
