import { Button } from "@/components/ui/button";

type ButtonVariant = "primary" | "secondary" | "tertiary";

const baseStyles =
  "px-6 py-6 rounded-full text-lg font-semibold transition-colors duration-200";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-light",
  secondary: "bg-secondary-light text-primary hover:bg-secondary",
  tertiary:
    "bg-transparent border-2 border-terciary text-primary text-terciary hover:bg-secondary",
};

export const MainButton = ({
  variant = "primary",
  className,
  children,
  asChild = false,
  ...props
}: {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      {...props}
      asChild={asChild}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Button>
  );
};
