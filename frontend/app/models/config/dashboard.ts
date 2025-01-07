import { DashboardConfig } from "@/app/models";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Overview",
      href: "/dashboard",
    },
  ],
  sidebarNav: [
    {
      title: "Pedidos",
      href: "/dashboard/pedidos",
      icon: "paquete",
    },
    {
      title: "Direcciones",
      href: "/dashboard/direcciones",
      icon: "direccion",
    },
    // {
    //   title: 'Pagos',
    //   href: '/dashboard/pagos',
    //   icon: 'tarjeta',
    // },
    {
      title: "Perfil",
      href: "/dashboard/ajustes",
      icon: "usuario",
    },
  ],
};

export const dashboardConfigEmpleado: DashboardConfig = {
  mainNav: [
    {
      title: "Overview",
      href: "/dashboard",
    },
  ],
  sidebarNav: [
    {
      title: "Pedidos",
      href: "/dashboard/ordenes",
      icon: "paquete",
    },
    {
      title: "Productos",
      href: "/dashboard/items",
      icon: "shoppingCart",
    },
  ],
};

export const dashboardConfigAdmin: DashboardConfig = {
  mainNav: [
    {
      title: "Overview",
      href: "/dashboard",
    },
  ],
  sidebarNav: [
    {
      title: "Ventas",
      href: "/dashboard/ventas",
      icon: "wallet",
    },
    {
      title: "Pedidos",
      href: "/dashboard/ordenes",
      icon: "paquete",
    },
    {
      title: "Productos",
      href: "/dashboard/items",
      icon: "shoppingCart",
    },
  ],
};
