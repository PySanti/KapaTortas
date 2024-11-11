import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: inputVariant; // Define any variants you want
}

type inputVariant = "footer" | "registro";

const commonStyles = "flex h-9 w-full bg-transparent border-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none disabled:cursor-not-allowed";

const variantStyles: Record<inputVariant, string> = {
  registro: "border placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring md:text-sm",
  footer: "border-b-2 outline-none disabled:opacity-70",
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "registro", className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          commonStyles,
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
