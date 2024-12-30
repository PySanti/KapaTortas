"use client";

import { Fragment } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import Stars from "../stars";
import classNames from "@/app/controladores/utilities/classNames";
import { Producto } from "@/app/models/Producto";
import { User } from "lucide-react";

export default function ReviewProduct({ product }: { product: Producto }) {
  return (
    <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
      <TabGroup as="div">
        <div className="border-b border-secondary-light">
          <TabList className="-mb-px flex space-x-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? " border-primary-light text-primary-light"
                    : "border-transparent text-terciary hover:border-primary-light hover:text-terciary",
                  "whitespace-nowrap border-b-2 py-6 text-sm font-medium",
                )
              }
            >
              Reviews
            </Tab>
          </TabList>
        </div>

        {/* Reviews completas */}
        <TabPanels as={Fragment}>
          <TabPanel className="-mb-10">
            <h3 className="sr-only">Reviews</h3>
            {product.reviews?.map((item, index) => (
              <div
                key={index}
                className="flex space-x-4 text-base text-terciary"
              >
                {/* Icon */}
                <div className="flex-none py-10">
                  <User className="text-terciary text-lg" />
                </div>

                <div
                  className={classNames(
                    index === 0 ? "" : "border-t border-primary-light",
                    "py-10",
                  )}
                >
                  <h3 className="font-medium text-terciary">
                    {item.autor_review}
                  </h3>
                  <Stars rating={item.calificacion} label="Puntuación" />

                  <div
                    className="prose prose-sm mt-4 max-w-none text-gray-500"
                    dangerouslySetInnerHTML={{ __html: item.descripcion }}
                  />
                </div>
              </div>
            ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
