'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { registroSchema, registroType } from '@/lib/validations/auth';
import Link from 'next/link';
import { Icons } from './icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import FormErrorMessage from './form-error-msg';
import FormSuccessMessage from './form-success-msg';
import { Eye, EyeOff } from 'lucide-react';

export default function RegistroClienteForm() {
  const router = useRouter();

  const [showForm, setShowForm] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const form = useForm<registroType>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'cliente',
    },
  });

  const {
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: registroType) => {
    const res = await fetch('http://localhost:8000/api/perfiles/crear/', {
      method: 'POST',
      body: JSON.stringify({
        nombre_completo: data.nombre,
        email: data.email,
        password: data.password,
        rol: 'cliente',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      setErrorMsg('Something went wrong');
    } else {
      setSuccessMsg(resData.success); // Mensaje con success en su respuesta de api/register
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }

    if (resData.errors) {
      const errors = resData.errors;

      if (errors.email) {
        setError('email', {
          type: 'server',
          message: errors.email,
        });
      } else if (errors.nombre) {
        setError('nombre', {
          type: 'server',
          message: errors.nombre,
        });
      } else if (errors.password) {
        setError('password', {
          type: 'server',
          message: errors.password,
        });
      } else if (errors.confirmPassword) {
        setError('confirmPassword', {
          type: 'server',
          message: errors.confirmPassword,
        });
      } else if (errors.limit) {
        setErrorMsg(errors.limit);
      } else {
        console.error('Error en el registro');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const formVariants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
      },
      y: 0,
      x: 0,
    },
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  return (
    <Card className='w-[24rem] text-terciary'>
      <CardHeader>
        <CardTitle className='text-lg'>Registro</CardTitle>
        <CardDescription className='text-terciary-muted'>
          Ya tienes una cuenta?{' '}
          <Link href={'/login'} className='text-primary font-medium'>
            Login
          </Link>
          {showForm && (
            <p
              onClick={() => {
                setShowForm(!showForm);
              }}
              className='inline-block text-primary text-sm font-medium hover:cursor-pointer'
            >
              {' '}
              Registrarse con Google?
            </p>
          )}
        </CardDescription>
      </CardHeader>
      {/* Renders  */}
      {!showForm ? (
        <CardContent>
          {!showForm && (
            <motion.div className='flex flex-col gap-6' key='buttons'>
              <Button
                type='button'
                className='w-full rounded-full'
                onClick={() => {
                  setShowForm(true);
                }}
              >
                Regístrate con tu email
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
                className='gap-2 rounded-full'
                onClick={() => {
                  setIsGoogleLoading(true);
                  signIn('google', { callbackUrl: '/dashboard' });
                }}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className='animate-spin h-5 w-5' />
                ) : (
                  <div className='h-5 w-5'>
                    <Icons.google />
                  </div>
                )}
                {''}
                Google
              </Button>
            </motion.div>
          )}
        </CardContent>
      ) : (
        <AnimatePresence>
          <CardContent>
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
                key='form'
                initial='hidden'
                animate='visible'
                exit='hidden'
                variants={formVariants}
              >
                <FormField
                  control={form.control}
                  name='nombre'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder='Leo Messi' {...field} />
                      </FormControl>
                      <FormMessage className='text-[0.8rem]' /> {/* Form error */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='lmessi@gmail.com' {...field} />
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword2 ? 'text' : 'password'}
                            placeholder='********'
                            className='pr-10'
                            {...field}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={togglePasswordVisibility2}
                            aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                          >
                            {showPassword2 ? (
                              <EyeOff className='h-4 w-4 text-gray-500' />
                            ) : (
                              <Eye className='h-4 w-4 text-gray-500' />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormErrorMessage message={errorMsg} />
                <FormSuccessMessage message={successMsg} />
                <Button
                  className='bg-primary text-white rounded-full'
                  disabled={isSubmitting}
                  type='submit'
                >
                  Enviar
                </Button>
              </motion.form>
            </Form>
          </CardContent>
        </AnimatePresence>
      )}
    </Card>
  );
}
/* <FormField
control={form.control}
name='password'
render={({ field }) => (
  <FormItem>
    <FormLabel>Password</FormLabel>
    <FormControl>
      <Input type='password' placeholder='********' {...field} />
    </FormControl>
    <FormMessage className='text-[0.8rem]' />
  </FormItem>
)}*/
