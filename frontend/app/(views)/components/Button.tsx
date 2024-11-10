import { Button } from "@/components/ui/button";

type ButtonVariant = "primary" | "secondary" | "tertiary";

const baseStyles =
  "px-8 py-7 rounded-full text-xl font-bold transition-colors duration-200";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-light",
  secondary: "bg-secondary text-white",
  tertiary: "bg-transparent text-primary hover:bg-primary-light",
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
