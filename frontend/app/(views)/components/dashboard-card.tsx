import { Card, CardContent, CardFooter, CardHeader } from "@/app/(views)/components/ui/card";
import { Separator } from "@/app/(views)/components/ui/separator";
import { CardClientActions } from "./dashboard-card-actions";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  badge?: string;
  children: React.ReactNode;
  actions?: {
    edit?: {
      label: string;
      action?: (id: number) => Promise<any>;
      form?: React.ReactNode;
    };
    delete?: {
      action?: (id: number) => Promise<any>;
      form?: React.ReactNode;
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
          <>
            <div className="max-w-fit p-1 bg-gray-200 rounded-md">
              <p className="text-sm text-terciary">{badge}</p>
            </div>
            <Separator />
          </>
        )}
        {title && (
          <>
            <h3 className="text-lg text-terciary font-medium">{title}</h3>
            <Separator />
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
      {(actions || useEditDialog) && (
        <CardFooter className="flex items-center gap-x-2">
          <CardClientActions
            idElement={idElement!}
            actions={actions!}
            handleClick={handleClick}
            useEditDialog={useEditDialog}
          />
        </CardFooter>
      )}
    </Card>
  );
}
