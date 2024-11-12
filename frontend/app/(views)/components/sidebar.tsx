'use client';

import { cn } from '@/app/controladores/lib/utils';
import { buttonVariants } from '@/app/(views)/components/ui/button';
import { SidebarNavItem } from '@/app/models';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icons } from './icons';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarNavItem[];
}

export default function Sidebar({ className, items }: SidebarProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn('pb-12 hidden md:block', className)}>
      <div className='px-2 space-y-2'>
        {items.map((item, index) => {
          const Icon = Icons[(item.icon as keyof typeof Icons) || 'ban'];
          return (
            item.title && (
              <Link
                key={index}
                className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start group')}
                href={item.disabled ? '/' : item.href}
              >
                <span
                  className={cn(
                    'group flex items-center rounded-md py-2 text-base',
                    path === item.href
                      ? 'text-terciary font-medium'
                      : 'text-muted-foreground font-normal',
                    item.disabled && 'cursor-not-allowed opacity-80',
                    'group-hover:text-terciary'
                  )}
                >
                  <Icon
                    className='mr-2'
                    size={20}
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />

                  <span>{item.title}</span>
                </span>
              </Link>
            )
          );
        })}
      </div>
    </nav>
  );
}
