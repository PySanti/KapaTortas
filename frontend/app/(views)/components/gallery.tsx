"use client";

import { Producto } from "@/app/models/Producto";
import GalleryImage from "./images/GalleryImage";
import ProductImage from "./images/ProductImage";
import { TabGroup, TabList, TabPanels, TabPanel, Tab } from "@headlessui/react";
import classNames from "@/app/controladores/utilities/classNames";

export default function Gallery({ product }: { product: Producto }) {
  const newProduct = product?.imagenes.filter((_, index) => index !== 1);

  return (
    <TabGroup
      as="div"
      className="flex flex-col-reverse lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2"
    >
      <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none text-center justify-self-center">
        <TabList className={` grid grid-cols-3 gap-6 lg:grid-cols-4 `}>
          {newProduct &&
            newProduct.length > 0 &&
            newProduct.map((image, index) => (
              <Tab
                key={index}
                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-secondary-light text-sm font-medium uppercase text-terciary hover:bg-opacity-80 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
              >
                {({ selected }) => (
                  <>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <GalleryImage
                        path={image}
                        alt={product?.titulo}
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
                    <span
                      className={classNames(
                        selected ? "ring-primary" : "ring-transparent",
                        "pointer-events-none aboluste inset-0 rounded-md ring-2 ring-offset-2",
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </Tab>
            ))}
        </TabList>
      </div>

      <TabPanels className="aspect-h-1 aspect-w-1 w-full">
        {newProduct &&
          newProduct.map((image, index) => (
            <TabPanel key={index}>
              <ProductImage
                path={image}
                alt={product?.titulo}
                className="h-full w-full sm:rounded-lg"
              />
            </TabPanel>
          ))}
      </TabPanels>
    </TabGroup>
  );
}
