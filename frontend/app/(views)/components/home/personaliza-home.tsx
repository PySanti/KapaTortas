"use client";
import { cn } from "@/app/controladores/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function PersonalizaHome() {
  return (
    <section className="bg-secondary shadow-lg py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-primary text-3xl font-semibold lg:text-4xl">Personalizar Torta</h1>
          <p className="text-[#8B4513] text-medium mb-4">
            ¡¡Personaliza tu torta!!, puedes elegir todas las capas que tu quieras con una gran
            variedad de sabores
          </p>
          <Link
            href="/products/personalizar"
            className={cn(
              buttonVariants({ variant: "default" }),
              "text-sm sm:text-lg hover:bg-primary-light p-5  md:p-6 text-white rounded-full py-2"
            )}
          >
            Ver Especialidades
          </Link>
        </div>
      </div>
    </section>
  );
}
