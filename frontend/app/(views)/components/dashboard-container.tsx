interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function DashboardContainer({
  children,
  title,
  className,
}: DashboardContainerProps) {
  return <div className='py-6 md:py-10 space-y-4'>{children}</div>;
}
