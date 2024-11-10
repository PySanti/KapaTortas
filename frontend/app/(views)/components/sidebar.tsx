'use client';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
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
      <div className='px-2 space-y-1'>
        {items.map((item, index) => {
          const Icon = Icons[(item.icon as keyof typeof Icons) || 'ban'];
          return (
            item.title && (
              <Link
                key={index}
                className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start')}
                href={item.disabled ? '/' : item.href}
              >
                <span
                  className={cn(
                    'group flex items-center rounded-md py-2 text-sm hover:text-accent-foreground',
                    path === item.href
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground font-normal',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  <Icon className='mr-2 h-4 w-4' />

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
