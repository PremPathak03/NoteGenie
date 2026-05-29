import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-full border-4 border-max-magenta bg-max-surface/60 px-6 py-2 text-base font-bold text-white shadow-none backdrop-blur-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:border-max-cyan focus-visible:bg-max-surface focus-visible:ring-4 focus-visible:ring-max-yellow/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_24px_color-mix(in_oklab,var(--max-cyan)_55%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
