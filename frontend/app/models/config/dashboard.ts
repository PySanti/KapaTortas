import { DashboardConfig } from '@/app/models';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Overview',
      href: '/dashboard',
    },
  ],
  sidebarNav: [
    {
      title: 'Pedidos',
      href: '/dashboard/pedidos',
      icon: 'paquete',
    },
    {
      title: 'Pagos',
      href: '/dashboard/pagos',
      icon: 'tarjeta',
    },
    {
      title: 'Direcciones',
      href: '/dashboard/direcciones',
      icon: 'direccion',
    },
    {
      title: 'Ajustes',
      href: '/dashboard/settings',
      icon: 'ajustes',
    },
  ],
};
