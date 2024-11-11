interface DashboardHeaderProps {
  heading: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ heading, description, children }: DashboardHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='grid gap-1'>
        <h1 className='font-bold text-3xl md:text-4xl text-terciary'>{heading}</h1>
        {description && <p className='text-lg text-muted-foreground'>{description}</p>}
      </div>
      {children}
    </div>
  );
}
