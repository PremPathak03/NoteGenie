import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border-4 border-max-cyan bg-max-surface/60 px-6 py-4 text-base font-medium text-white backdrop-blur-sm placeholder:text-white/40 transition-all duration-300 focus-visible:outline-none focus-visible:border-max-yellow focus-visible:bg-max-surface focus-visible:ring-4 focus-visible:ring-max-magenta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_24px_color-mix(in_oklab,var(--max-yellow)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
