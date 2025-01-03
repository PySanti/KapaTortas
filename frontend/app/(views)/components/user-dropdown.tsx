'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/(views)/components/ui/dropdown-menu';
import { User } from 'next-auth';
import UserAvatar from './user-avatar';
import Link from 'next/link';
import { Icons } from './icons';
import { signOut } from 'next-auth/react';
import { dashboardConfig, dashboardConfigEmpleado } from '@/app/models/config/dashboard';
import { Rol } from '@/app/models/RolEnum';

interface UserDropdownProps {
  children?: React.ReactNode;
  user: Pick<User, 'name' | 'image' | 'email' | 'rol'>;
}

function getItemsByRol(rol: Rol) {
  if (rol === Rol.EMPLEADO) {
    return dashboardConfigEmpleado.sidebarNav;
  }

  // else if (rol === Rol.ADMIN) {
  //   return dashboardConfigEmpleado.sidebarNav;
  // }
  return dashboardConfig.sidebarNav;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const items = getItemsByRol(user.rol);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:outline-0'>
        {/* User image */}
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white dark:bg-gray-950' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && (
              <p className='w-[200px] truncate text-sm text-zinc-700 dark:text-white'>
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {items?.length &&
          items.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link href={item.href} className='cursor-pointer'>
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            });
          }}
          className='cursor-pointer'
        >
          Cerrar sesión
          <Icons.logout className='w-4 h-4 ml-2' />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
