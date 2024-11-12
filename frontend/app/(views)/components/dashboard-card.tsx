import { Card, CardContent, CardFooter, CardHeader } from '@/app/(views)/components/ui/card';
import { Separator } from '@/app/(views)/components/ui/separator';
import { Button } from '@/app/(views)/components/ui/button';
import { Trash } from 'lucide-react';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string; // Optional titulo para el header del card
  highlight?: string; // Optional highlight titulo (e.g., "Dirección preferido")
  children: React.ReactNode; // Contenido del card
  editable?: boolean; //  Optional Activa el botón de editar
  deletable?: boolean; // Optional Activa el botón de eliminar
}

export default function DashboardCard({
  title,
  highlight,
  editable,
  deletable,
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <Card className={`max-w-xl ${className}`} {...props}>
      <CardHeader>
        {highlight && (
          <>
            <div className='max-w-fit p-1 bg-gray-200 rounded-md'>
              <p className='text-sm text-terciary'>{highlight}</p>
            </div>
            <Separator />
          </>
        )}
        {title && (
          <>
            <h3 className='text-lg text-terciary font-medium'>{title}</h3>
            <Separator />
          </>
        )}
      </CardHeader>
      <CardContent className='space-y-2 text-terciary text-s'>{children}</CardContent>
      <CardFooter className='flex items-center gap-x-2'>
        {editable && (
          <Button className='bg-white text-terciary hover:bg-gray-50 border-2'>Editar</Button>
        )}
        {deletable && (
          <Button className='bg-white text-terciary hover:bg-gray-50 border-2'>
            <Trash />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
