import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-heading font-black uppercase tracking-widest cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-max-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-max-magenta disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-full text-white border-4 border-max-yellow bg-[linear-gradient(90deg,var(--max-magenta),var(--max-purple),var(--max-cyan))] bg-[length:200%_100%] hover:bg-[position:100%_50%] hover:scale-110 glow-magenta hover:animate-pulse-glow",
        destructive:
          "rounded-full text-white border-4 border-max-yellow bg-destructive hover:scale-110 glow-magenta",
        outline:
          "rounded-full border-4 border-max-cyan bg-max-surface/60 text-white backdrop-blur-sm shadow-hard-2 hover:-translate-x-1 hover:-translate-y-1 hover:border-max-yellow active:translate-x-0 active:translate-y-0 active:shadow-none",
        secondary:
          "rounded-full border-4 border-max-magenta bg-max-cyan text-background hover:scale-110 glow-cyan",
        ghost:
          "rounded-full border-4 border-dashed border-max-yellow text-white hover:bg-max-yellow hover:text-background hover:border-solid hover:scale-105",
        link: "text-max-cyan underline-offset-4 hover:underline hover:text-max-magenta",
      },
      size: {
        default: "h-14 px-10 text-sm",
        sm: "h-10 px-5 text-xs",
        lg: "h-16 px-12 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
