import { CheckCircle2 } from 'lucide-react';

interface FormSuccessMessageProps {
  message?: string;
}

export default function FormSuccessMessage({ message }: FormSuccessMessageProps) {
  if (!message) return null;

  return (
    <div className='flex p-2 items-center gap-2 bg-emerald-500/10 roundend-md text-sm text-emerald-500'>
      <CheckCircle2 className='h-5 w-5' />
      <span className='text-sm'>{message}</span>
    </div>
  );
}
