import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/(views)/components/ui/tooltip";
import { cn } from "@/app/controladores/lib/utils";
import { ChevronDown } from "lucide-react";

interface DisplayOnHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  mainInfo: string;
  extraInfo: string[];
  className?: string;
  displayMainInfo?: boolean;
}

export default function DisplayOnHover({
  mainInfo,
  extraInfo,
  className,
  displayMainInfo = true, // Muestra el titulo (mainInfo) en el tooltip
}: DisplayOnHoverProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip delayDuration={300}>
        <div
          className={cn(
            "relative flex flex-row items-center space-x-1 cursor-pointer text-terciary-muted",
            className
          )}
        >
          <TooltipTrigger className="flex hover:text-terciary transition-colors">
            {mainInfo}
            <ChevronDown className="h-4 w-4" />
          </TooltipTrigger>
        </div>
        <TooltipContent className="max-w-56" side="bottom">
          {displayMainInfo && <p className="text-sm font-bold text-terciary">{mainInfo}</p>}
          {extraInfo.map((info, index) => (
            <p key={index} className="text-sm text-terciary">
              {info}
            </p>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
