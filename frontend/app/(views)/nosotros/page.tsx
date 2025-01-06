import { Button } from "../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import redirectToWhatsapp from "@/app/controladores/utilities/redirect-to-whatsapp";

export default async function SobreNosotros() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Nuestra Historia
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto text-white">
            Donde cada capa cuenta una historia de sabor y creatividad
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#C25E1D]">
              De Venezuela para tu Mesa
            </h2>
            <div className="space-y-4 text-[#8B4513]">
              <p>
                Nacimos de la pasión por la repostería y el deseo de traer algo
                único a tu mesa. En KAPA, creemos que cada torta debe ser tan
                única como la persona que la disfruta.
              </p>
              <p>
                Nuestra propuesta es simple pero revolucionaria: tú diseñas,
                nosotros creamos. Cada capa de nuestras tortas puede ser
                personalizada, permitiéndote crear combinaciones únicas que
                reflejen tu gusto personal.
              </p>
              <p>
                Traemos con nosotros el calor y la creatividad de Venezuela,
                fusionando sabores tradicionales con innovación y permitiendo
                que cada cliente sea parte del proceso creativo.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                className="bg-[#C25E1D] hover:bg-[#A34D16] text-white rounded-full"
              >
                <Link href="/">Ver Catálogo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#C25E1D] text-[#C25E1D] hover:bg-[#C25E1D] hover:text-white"
                onClick={() =>
                  redirectToWhatsapp({
                    name: user?.name || "",
                  })
                }
              >
                Contáctanos
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dhxc2ozvw/image/upload/v1736133235/kapatortas/vxhfockguninyw3gwmfm.jpg"
              alt="Proceso de creación de tortas"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-6">
            Lo Que Nos Hace Diferentes
          </h2>
          <div className="grid md:grid-cols-3 gap-2 lg:gap-8">
            {[
              {
                title: "Personalización Total",
                description:
                  "Cada capa puede ser personalizada según tus gustos y preferencias.",
              },
              {
                title: "Sabor Casero",
                description:
                  "Elaboración cuidadosa con ingredientes seleccionados de alta calidad.",
              },
              {
                title: "Creatividad Sin Límites",
                description:
                  "Tu imaginación es el límite para crear la torta de tus sueños.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-balance">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
