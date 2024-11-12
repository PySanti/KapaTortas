import { DireccionEnvio } from '@/app/models/Cliente';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface DireccionEnvioCardProps extends React.HTMLAttributes<HTMLDivElement> {
  nombreCompleto: string;
  direccion: DireccionEnvio;
}

export default function DireccionEnvioCard({ nombreCompleto, direccion }: DireccionEnvioCardProps) {
  return (
    <Card className='max-w-xl'>
      <CardHeader>
        {direccion.esPreferida && (
          <>
            <div className='max-w-fit p-1 bg-gray-200 rounded-md'>
              <p className='text-terciary text-sm'>Dirección de envío preferida</p>
            </div>
            <Separator />
          </>
        )}
      </CardHeader>
      <CardContent className='space-y-2'>
        <p className='text-terciary text-sm'>{nombreCompleto}</p>
        <p className='text-terciary text-sm'>{`${direccion.direccion_1} ${direccion.direccion_2}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.codigo_postal}`}</p>
        <p className='text-terciary text-sm'>{direccion.numero_telefono}</p>
      </CardContent>
      <CardFooter className='flex items-center gap-x-2'>
        <Button className='bg-white text-terciary hover:bg-gray-50 border-2'>Editar</Button>
        <Button className='bg-white text-terciary hover:bg-gray-50 border-2'>
          <Trash />
        </Button>
      </CardFooter>
    </Card>
  );
}
