'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { MainButton } from './main-button';

import Logo from '@/components/images/Logo';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-secondary'>
      <div className='grid grid-cols-3 h-25 items-center px-6 sm:px-8 md:px-12 lg:px-16'>
        <div className='flex items-center space-x-2'>
          <Menu className='h-6 w-6 lg:h-8 lg:w-8 text-primary' />
          <h3 className='text-lg lg:text-2xl text-primary'>Menú</h3>
        </div>

        <div className='flex justify-center'>
          <Link href='/'>
            <Logo />
          </Link>
        </div>

        <div className='hidden lg:flex justify-end items-center space-x-4'>
          <Link href='/catalogo' passHref>
            <MainButton variant='secondary'>Realiza tu Pedido</MainButton>
          </Link>
          <Link href='/auth/registro'>
            <MainButton>Registrarse</MainButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
