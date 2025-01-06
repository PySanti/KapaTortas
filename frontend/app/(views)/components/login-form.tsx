'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, buttonVariants } from '@/app/(views)/components/ui/button';
import { Input } from '@/app/(views)/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(views)/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/(views)/components/ui/form';
import { useForm } from 'react-hook-form';
import { loginSchema, loginType } from '@/app/controladores/lib/validations/auth';
import Link from 'next/link';
import { Icons } from '@/app/(views)/components/icons';
import { signIn } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { login } from '@/app/controladores/actions/login';
import FormSuccessMessage from './form-success-msg';
import { cn } from '@/app/controladores/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const form = useForm<loginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const [errorMsg, setErrorMsg] = useState<string | undefined>('');
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: loginType) => {
    setErrorMsg('');
    setSuccessMsg('');

    // console.log('Form Data:', data);

    startTransition(() => {
      login(data).then((data) => {
        setErrorMsg(data?.error);
        setSuccessMsg(data?.success);
      });
    });
  };

  return (
    <Card className='w-[24rem]'>
      <CardHeader>
        <CardTitle>Bienvenido de vuelta</CardTitle>
        <CardDescription>
          No tienes una cuenta?{' '}
          <Link href={'/register'} className='text-primary font-medium'>
            Regístrate
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id='email-input'
                      type='email'
                      placeholder='lmessi@gmail.com'
                      disabled={isPending}
                      {...field}
                    />
                    </FormControl>
                  <FormMessage className='text-[0.8rem]' /> {/* Form error */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        id='password-input'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='********'
                        className='pr-10'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                          <Eye className='h-4 w-4 text-gray-500' />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {/* <Link
                    className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'px-0 font-sm')}
                    href='/reset-password'
                  >
                    Olvidaste tu contraseña?
                  </Link> */}
                </FormItem>
              )}
            />

            {errorMsg && <p className='text-destructive text-xs mt-0'>{errorMsg}</p>}
            <FormSuccessMessage message={successMsg} />
            <div className='flex flex-col gap-6'>
                <Button id='login-button' disabled={isPending} type='submit' className='w-full'>
                Inicia sesión
                </Button>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-background px-2 text-muted-foreground'>O continúa con</span>
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                disabled={isGoogleLoading}
                className='gap-2'
                onClick={() => {
                  setIsGoogleLoading(true);
                  signIn('google', { redirectTo: '/dashboard' });
                }}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className='animate-spin h-5 w-5' />
                ) : (
                  <Icons.google className='h-5 w-5' />
                )}
                {''}
                Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
