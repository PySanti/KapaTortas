import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import DisplayOnHover from "./display-on-hover";
import { Pedido } from "@/app/models/Pedido";
import Image from "next/image";
import Link from "next/link";
import { transformMetodoPago } from "@/app/controladores/utilities/transform-metodo-pago";
import DownloadFacturaButton from "./button-download-factura";

interface PedidoHistorialProps extends React.HTMLAttributes<HTMLDivElement> {
  pedidos: Pedido[];
  nombreUsuario: string;
}

export default function PedidoHistorial({ pedidos, nombreUsuario }: PedidoHistorialProps) {
  return (
    <div className="">
      <div className="mt-16">
        <h2 className="sr-only">Pedidos recientes</h2>

        <div className="space-y-8 sm:px-4 lg:max-w-5xl lg:px-0">
          {pedidos &&
            pedidos.length > 0 &&
            pedidos.map((pedido) => (
              <div
                key={pedido.numero_de_orden}
                className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
              >
                <h3 className="sr-only">
                  Orden realizada el{" "}
                  <time dateTime={pedido.fecha_pedido}>
                    {new Date(pedido.fecha_pedido).toLocaleDateString()}
                  </time>
                </h3>

                <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-5 sm:gap-x-6 sm:p-6">
                  <dl className="grid flex-1 gap-x-4 text-sm grid-cols-4 lg:col-span-4">
                    <div className="sm:block col-span-1">
                      <dt className="font-medium text-terciary">Orden realizada</dt>
                      <dd className="mt-1 text-terciary-muted">
                        <time dateTime={pedido.fecha_pedido}>
                          {new Date(pedido.fecha_pedido).toLocaleDateString()}
                        </time>
                      </dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="font-medium text-terciary">Total</dt>
                      <dd className="mt-1 text-terciary-muted">${pedido.monto_total}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-terciary">Enviar a</dt>
                      <DisplayOnHover
                        className="mt-1"
                        mainInfo={nombreUsuario || "Nombre no disponible"}
                        extraInfo={[
                          pedido.direccion_entrega.direccion,
                          pedido.direccion_entrega.referencia,
                          pedido.direccion_entrega.ciudad,
                        ]}
                      />
                    </div>
                    <div>
                      <dt className="font-medium text-terciary">Método de pago</dt>
                      <dd className="mt-1 text-terciary-muted">
                        {transformMetodoPago(pedido.metodo_pago)}
                      </dd>
                    </div>
                  </dl>

                  <Menu as="div" className="relative flex justify-end lg:hidden">
                    <div className="flex items-center">
                      <MenuButton className="-m-2 flex items-center p-2 text-gray-400 hover:text-terciary-muted">
                        <span className="sr-only">Opciones de orden {pedido.numero_de_orden}</span>
                        <EllipsisVertical aria-hidden="true" className="h-6 w-6" />
                      </MenuButton>
                    </div>

                    {/* <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <Link
                            href={`/factura/${pedido.numero_de_orden}`}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-terciary"
                          >
                            Ver Factura
                          </Link>
                        </MenuItem>
                      </div>
                    </MenuItems> */}
                  </Menu>

                  <div className="hidden lg:flex lg:flex-col lg:items-end lg:space-y-4">
                    <div className="text-sm font-medium text-terciary">
                      Número de orden: {pedido.numero_de_orden}
                    </div>
                    <div className="flex space-x-4">
                      <DownloadFacturaButton pedido={pedido} isMobile={true} />
                    </div>
                  </div>
                </div>

                {/* Products */}
                <h4 className="sr-only">Productos</h4>
                <ul role="list" className="divide-y divide-gray-200">
                  {pedido.descripciones.map((producto, i) => (
                    <li key={i} className="p-4 sm:p-6">
                      <div className="flex items-center sm:items-start">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-32 sm:w-32">
                          <Image
                            alt={producto.titulo}
                            src={producto.imagenes_producto[0]}
                            className="h-full w-full object-cover object-center"
                            width={488}
                            height={488}
                          />
                        </div>
                        <div className="ml-6 flex-1 text-base">
                          <div className="font-medium text-terciary sm:flex sm:justify-between">
                            <h5>{producto.titulo}</h5>
                            <p className="mt-2 sm:mt-0">${producto.precio_presentacion}</p>
                          </div>
                          <p className="text-sm text-terciary-muted sm:mt-2 sm:block">
                            {producto.categoria === "especial" ? (
                              <>Sabores: {producto.sabor}</>
                            ) : (
                              <>Tamaño: {producto.presentacion}</>
                            )}
                          </p>
                          <p className="text-sm text-terciary-muted sm:mt-2 sm:block">
                            Cantidad: {producto.cantidad}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 sm:flex sm:justify-between">
                        {/* TODO: Implementar estado de entrega */}
                        {/* <div className='flex items-center'>
                          <CircleCheck aria-hidden='true' className='h-5 w-5 text-green-500' />
                          <p className='ml-2 text-sm font-medium text-terciary-muted'>
                            Entregada el{' '}
                            <time dateTime={pedido.fecha_entrega}>
                              {new Date(pedido.fecha_entrega).toLocaleDateString()}
                            </time>
                          </p>
                        </div> */}

                        <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                          <div className="flex flex-1 justify-center">
                            <Link
                              href={`/products/${producto.id_producto_asociado}`}
                              className="whitespace-nowrap text-primary"
                            >
                              Ver producto
                            </Link>
                          </div>
                          <div className="flex flex-1 justify-center pl-4">
                            <a href="#" className="whitespace-nowrap text-primary">
                              Comprar de nuevo
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
