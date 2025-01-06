import { MarketingConfig } from "..";

export const marketingConfig: MarketingConfig = {
  mainNav: [
    { title: "Crear Torta", href: "/products/personalizar" },
    { title: "Nosotros", href: "/nosotros" },
  ],
};

type imageType = {
  image: string;
  alt: string;
};

export type cakeType = {
  name: string;
  description: string;
  image_torta: imageType;
  image_migaja: imageType;
};

export const cakes: cakeType[] = [
  {
    name: "Chocolate Cake",
    description:
      "Deliciosa torta de chocolate con 4 capas esponjosas y relleno cremoso, ¡Perfecta para los amantes del chocolate",
    image_torta: {
      image: "/images/Torta-Chocolate.png",
      alt: "Torta de Chocolate",
    },
    image_migaja: {
      image: "/images/miga-Chocolate.png",
      alt: "Migaja Chocolate",
    },
  },
  {
    name: "Festival",
    description:
      "Colorida y deliciosa torta de 4 capas, decorada con chispitas de colores y relleno cremoso. ¡Pura diversión en cada bocado!",
    image_torta: {
      image: "/images/Torta-Festival.png",
      alt: "Torta Festival",
    },
    image_migaja: {
      image: "/images/miga-festival.png",
      alt: "Migaja festival",
    },
  },
];
