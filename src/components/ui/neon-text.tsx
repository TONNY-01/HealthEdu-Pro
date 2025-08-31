import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const neonTextVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        primary: "text-neon",
        secondary: "text-neon-secondary", 
        accent: "text-neon-accent",
        glow: "text-neon animate-glow",
        pulse: "text-neon animate-pulse-neon"
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface NeonTextProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neonTextVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const NeonText = ({ className, variant, size, as: Component = "div", children, ...props }: NeonTextProps) => {
  const Comp = Component as any;
  return (
    <Comp
      className={cn(neonTextVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
};

NeonText.displayName = "NeonText";

export { NeonText, neonTextVariants };