"use client";
import { cn } from "@/app/controladores/lib/utils";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainNavItem } from "@/app/models";
import { User } from "next-auth";
import { MainButton } from "./MainButton";
import Logo from "@/app/(views)/components/images/Logo";
import UserDropdown from "./user-dropdown";

import { CartIcon } from "./cart-icon";
import { Rol } from "@/app/models/RolEnum";
import getCurrentUser from "@/app/controladores/utilities/get-current-user";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: MainNavItem[];
  children?: React.ReactNode;
  user?: Pick<User, "name" | "image" | "email" | "rol">;
}

export default function Navbar({ className, items, user }: NavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;
  const rolUser = getCurrentUser()?.rol;

  return (
    <>
      <Disclosure as="nav">
        {({ open, close }) => (
          <>
            <div
              className={cn(
                "mx-auto bg-secondary max-w-full px-6 md:px-8 lg:px-8",
                className,
              )}
            >
              <div className="flex h-16 justify-between items-center mx-0 sm:mx-4">
                {/* Left Section - Menu Icon */}
                <div className="flex items-center">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-brown-600 hover:bg-brown-100 hover:text-brown-700">
                    <span className="sr-only">Abrir menú principal</span>
                    {open ? (
                      <X className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Menu
                        className="block h-8 w-8 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </DisclosureButton>
                  <span className="ml-2 text-brown-600 font-semibold text-primary">
                    Menú
                  </span>
                </div>

                {/* Center Section - Logo */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Link href="/">
                    <Logo />
                  </Link>
                </div>

                {/* Right Section - Buttons */}
                <div className="flex items-center justify-end space-x-4">
                  {user ? (
                    <UserDropdown user={user} />
                  ) : (
                    <MainButton
                      className="hidden sm:inline-flex px-10 py-5 items-center justify-center text-center"
                      asChild
                    >
                      <Link href="/login">Inicia sesión</Link>
                    </MainButton>
                  )}

                  {!(user?.rol === Rol.EMPLEADO || user?.rol === Rol.ADMIN) && (
                    <CartIcon />
                  )}
                </div>
              </div>
            </div>

            {/* Full-Screen Slide-in Menu for All Screen Sizes */}
            <AnimatePresence>
              {open && (
                <>
                  {/* Overlay background */}
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => close()} // Click on overlay to close menu
                  />

                  {/* Slide-in Menu Panel */}
                  <DisclosurePanel
                    as={motion.div}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition
                    className="fixed top-0 left-0 h-full w-3/4 bg-white max-w-xs shadow-lg z-50 origin-top transition duration-200 ease-out"
                  >
                    {/* Close Button Inside the Slide-in Menu */}
                    <div className="flex justify-end p-4">
                      <button
                        onClick={() => close()}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close menu"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-1 py-4">
                      <ul>
                        {items?.length &&
                          items.map((item, index) => (
                            <DisclosureButton
                              as={Link}
                              key={index}
                              href={item.href}
                              className={`block border-l-4 ${
                                isActive(item.href)
                                  ? "border-brown-500 bg-brown-50 py-2 pl-3 pr-4 text-sm font-medium text-brown-700"
                                  : "border-transparent py-2 pl-3 pr-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                            >
                              {item.title}
                            </DisclosureButton>
                          ))}
                        {!user && (
                          <div className="mt-2">
                            <Link
                              href="/login"
                              className={cn(
                                "ml-4 rounded-full bg-primary text-white px-4 py-2",
                              )}
                            >
                              Iniciar sesión
                            </Link>
                          </div>
                        )}
                      </ul>
                    </div>
                  </DisclosurePanel>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </Disclosure>
    </>
  );
}
