import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown } from 'lucide-react';

interface DisplayOnHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  mainInfo: string;
  extraInfo: string[];
}

export default function DisplayOnHover({ mainInfo, extraInfo }: DisplayOnHoverProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip delayDuration={300}>
        <div className='relative flex flex-row items-center space-x-1 cursor-pointer text-terciary-muted'>
          <TooltipTrigger className='flex hover:text-terciary transition-colors'>
            {mainInfo}
            <ChevronDown className='h-4 w-4' />
          </TooltipTrigger>
        </div>
        <TooltipContent className='max-w-48' side='bottom'>
          <p className='text-sm font-bold text-terciary'>{mainInfo}</p>
          {extraInfo.map((info, index) => (
            <p key={index} className='text-sm text-terciary'>
              {info}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
