import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVertical, CircleCheck } from 'lucide-react';

const orders = [
  {
    number: 'WU88191111',
    href: '#',
    invoiceHref: '#',
    createdDate: 'Nov 11, 2024',
    createdDatetime: '2024-11-11',
    deliveredDate: 'Nov 12, 2024',
    deliveredDatetime: '2024-12-11',
    total: '$160.00',
    shipTo: 'Samuel Palacios, Rue de Mentana, Montreal, Canada',
    products: [
      {
        id: 1,
        name: 'Micro Backpack',
        description:
          'Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items. Wear it like a backpack or carry it like a satchel for all-day use.',
        href: '#',
        price: '$70.00',
        imageSrc:
          'https://tailwindui.com/img/ecommerce-images/order-history-page-03-product-01.jpg',
        imageAlt:
          'Moss green canvas compact backpack with double top zipper, zipper front pouch, and matching carry handle and backpack straps.',
      },
      // More products...
    ],
  },
  // More orders...
];

export default function PedidoHistorial() {
  return (
    <div className=''>
      <div className='mt-16'>
        <h2 className='sr-only'>Pedidos recientes</h2>
        <div className='mx-auto max-w-7xl sm:px-2 lg:px-8'>
          <div className='mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0'>
            {orders.map((order) => (
              <div
                key={order.number}
                className='border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border'
              >
                <h3 className='sr-only'>
                  Order placed on <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                </h3>

                <div className='flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6'>
                  <dl className='grid flex-1 gap-x-6 text-sm col-span-3 grid-cols-3 lg:col-span-2'>
                    <div className='sm:block'>
                      <dt className='font-medium text-gray-900'>Order placed</dt>
                      <dd className='mt-1 text-gray-500'>
                        <time dateTime={order.createdDatetime}>{order.createdDate}</time>
                      </dd>
                    </div>
                    <div>
                      <dt className='font-medium text-gray-900'>Total</dt>
                      <dd className='mt-1 font-medium text-gray-500'>{order.total}</dd>
                    </div>

                    <div>
                      <dt className='font-medium text-gray-900'>Ship to</dt>
                      <dd className='mt-1 text-gray-500'>{order.shipTo}</dd>
                    </div>
                  </dl>

                  <Menu as='div' className='relative flex justify-end lg:hidden'>
                    <div className='flex items-center'>
                      <MenuButton className='-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500'>
                        <span className='sr-only'>Options for order {order.number}</span>
                        <EllipsisVertical aria-hidden='true' className='h-6 w-6' />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className='absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                    >
                      <div className='py-1'>
                        <MenuItem>
                          <a
                            href={order.href}
                            className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                          >
                            View
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href={order.invoiceHref}
                            className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                          >
                            Invoice
                          </a>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>

                  <div className='hidden lg:col-span-2 lg:flex lg:flex-col lg:items-end lg:space-y-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      Order number: {order.number}
                    </div>
                    <div className='flex space-x-4'>
                      <a
                        href={order.href}
                        className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      >
                        <span>View Order</span>
                        <span className='sr-only'>{order.number}</span>
                      </a>
                      <a
                        href={order.invoiceHref}
                        className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                      >
                        <span>View Invoice</span>
                        <span className='sr-only'>for order {order.number}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <h4 className='sr-only'>Items</h4>
                <ul role='list' className='divide-y divide-gray-200'>
                  {order.products.map((product) => (
                    <li key={product.id} className='p-4 sm:p-6'>
                      <div className='flex items-center sm:items-start'>
                        <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40'>
                          <img
                            alt={product.imageAlt}
                            src={product.imageSrc}
                            className='h-full w-full object-cover object-center'
                          />
                        </div>
                        <div className='ml-6 flex-1 text-sm'>
                          <div className='font-medium text-gray-900 sm:flex sm:justify-between'>
                            <h5>{product.name}</h5>
                            <p className='mt-2 sm:mt-0'>{product.price}</p>
                          </div>
                          <p className='hidden text-gray-500 sm:mt-2 sm:block'>
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className='mt-6 sm:flex sm:justify-between'>
                        <div className='flex items-center'>
                          <CircleCheck aria-hidden='true' className='h-5 w-5 text-green-500' />
                          <p className='ml-2 text-sm font-medium text-gray-500'>
                            Delivered on{' '}
                            <time dateTime={order.deliveredDatetime}>{order.deliveredDate}</time>
                          </p>
                        </div>

                        <div className='mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0'>
                          <div className='flex flex-1 justify-center'>
                            <a
                              href={product.href}
                              className='whitespace-nowrap text-indigo-600 hover:text-indigo-500'
                            >
                              View product
                            </a>
                          </div>
                          <div className='flex flex-1 justify-center pl-4'>
                            <a
                              href='#'
                              className='whitespace-nowrap text-indigo-600 hover:text-indigo-500'
                            >
                              Buy again
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
    </div>
  );
}
