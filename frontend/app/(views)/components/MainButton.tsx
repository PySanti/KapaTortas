import { Button } from "@/components/ui/button";

type ButtonVariant = "primary" | "secondary" | "tertiary";

const baseStyles =
  "px-7 py-7 lg:px-6 lg:py-6 rounded-full text-xl lg:text-lg font-semibold transition-colors duration-200";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-light",
  secondary: "bg-secondary-light text-primary hover:bg-secondary",
  tertiary: "bg-transparent border-2 border-terciary text-primary text-terciary hover:bg-secondary",
};

export const MainButton = ({
  variant = "primary",
  className,
  children,
  ...props
}: {
  variant?: ButtonVariant;
  className?: string;
  children: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button
      {...props}
      className={` ${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Button>
  );
};

// const primaryButton = {};
