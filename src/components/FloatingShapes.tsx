import { Sparkles, Star, Zap, Circle, Triangle, Heart } from "lucide-react";

type Shape = {
  Icon: typeof Sparkles;
  className: string;
  color: string;
  size: number;
  animation: string;
};

const SHAPES: Shape[] = [
  {
    Icon: Sparkles,
    className: "top-[8%] left-[6%]",
    color: "text-max-magenta",
    size: 48,
    animation: "animate-float",
  },
  {
    Icon: Star,
    className: "top-[14%] right-[8%]",
    color: "text-max-yellow",
    size: 64,
    animation: "animate-float-reverse",
  },
  {
    Icon: Zap,
    className: "top-[42%] left-[3%]",
    color: "text-max-cyan",
    size: 40,
    animation: "animate-wiggle",
  },
  {
    Icon: Circle,
    className: "top-[60%] right-[5%]",
    color: "text-max-orange",
    size: 56,
    animation: "animate-float",
  },
  {
    Icon: Triangle,
    className: "bottom-[18%] left-[10%]",
    color: "text-max-purple",
    size: 44,
    animation: "animate-bounce-subtle",
  },
  {
    Icon: Heart,
    className: "bottom-[8%] right-[12%]",
    color: "text-max-magenta",
    size: 52,
    animation: "animate-float-reverse",
  },
  {
    Icon: Sparkles,
    className: "top-[30%] right-[22%]",
    color: "text-max-cyan",
    size: 28,
    animation: "animate-wiggle",
  },
  {
    Icon: Star,
    className: "bottom-[40%] left-[18%]",
    color: "text-max-yellow",
    size: 32,
    animation: "animate-float",
  },
];

export function FloatingShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SHAPES.map(({ Icon, className, color, size, animation }, i) => (
        <Icon
          key={i}
          size={size}
          strokeWidth={2.5}
          className={`absolute opacity-70 ${color} ${className} ${animation}`}
          fill="currentColor"
        />
      ))}
    </div>
  );
}

export function BackgroundWord({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-heading text-[16rem] font-black uppercase leading-none tracking-tighter text-max-purple/15 sm:text-[22rem]"
    >
      {children}
    </div>
  );
}
