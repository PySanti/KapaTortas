'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { newVerification } from '@/app/controladores/actions/new-verification';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/app/(views)/components/ui/button';
import Link from 'next/link';
import { Icons } from './icons';

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');

  const onSubmit = useCallback(() => {
    if (successMsg || errorMsg) return;

    if (!token) {
      setErrorMsg('Missing token!');
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccessMsg(data.success);
        setErrorMsg(data.error);
      })
      .catch(() => {
        setErrorMsg('Something went wrong');
      });
  }, [token, successMsg, errorMsg]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className='flex flex-col items-center justify-center px-4 py-36 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center space-y-4'>
        {!successMsg && !errorMsg && (
          <>
            <LoaderPinwheelIcon className='mx-auto h-12 w-12 animate-spin text-primary' />
            <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
              Verifying Email...
            </h1>
          </>
        )}
        <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
          {!successMsg ? errorMsg : successMsg}
        </h1>
        <p className='text-muted-foreground'>
          {errorMsg && 'Please try again later or contact support if the issue persists.'}
        </p>
        <Link href='/login' className={cn(buttonVariants({ variant: 'default' }))}>
          <Icons.chevronLeft className='mr-2 h-4 w-4' />
          Back to login
        </Link>
      </div>
    </div>
  );
}

interface LoaderPinwheelIconProps {
  className?: string;
}

function LoaderPinwheelIcon({ className }: LoaderPinwheelIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <path d='M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5 2.2 5 5 5 5-2.2 5-5' />
      <path d='M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6' />
      <path d='M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6' />
      <circle cx='12' cy='12' r='10' />
    </svg>
  );
}
