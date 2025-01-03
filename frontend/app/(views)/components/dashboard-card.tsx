import { Card, CardContent, CardFooter, CardHeader } from '@/app/(views)/components/ui/card';
import { Separator } from '@/app/(views)/components/ui/separator';
import { CardClientActions } from './dashboard-card-actions';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  badge?: string;
  children: React.ReactNode;
  actions?: {
    edit?: {
      label: string;
      action?: (id: number) => Promise<any>;
    };
    delete?: {
      action?: (id: number) => Promise<any>;
    };
  };
  handleClick?: () => void;
  useEditDialog?: boolean;
  idElement?: number;
}

export default function DashboardCard({
  title,
  badge,
  actions,
  handleClick,
  children,
  className,
  useEditDialog,
  idElement,
  ...props
}: DashboardCardProps) {

  return (
    <Card className={`max-w-xl ${className}`} {...props}>
      <CardHeader className="space-y-4">
        {badge && (
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
            {badge}
          </span>
        )}
        {title && (
          <>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <Separator />
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
      {(actions || useEditDialog) && (
        <CardFooter className="flex items-center gap-x-2">
          <CardClientActions idElement={idElement!} actions={actions!} handleClick={handleClick} useEditDialog={useEditDialog} />
        </CardFooter>
      )}
    </Card>
  );
}
