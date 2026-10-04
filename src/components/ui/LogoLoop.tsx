import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface LogoItem {
  id: string;
  name: string;
  category?: string;
  iconSrc: string;
  url?: string;
}

export interface LogoLoopProps {
  items: LogoItem[];
  direction?: "left" | "right";
  speed?: number; // duration in seconds
  pauseOnHover?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const LogoLoop: React.FC<LogoLoopProps> = ({
  items,
  direction = "left",
  speed = 35,
  pauseOnHover = true,
  className,
  ariaLabel = "Tool and Model Logos",
}) => {
  const animId = useId().replace(/:/g, "_");
  const animationName = `logo-loop-${direction}-${animId}`;

  return (
    <div
      className={cn("group relative w-full overflow-hidden select-none py-1.5", className)}
      aria-label={ariaLabel}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ${animationName} {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes ${animationName}-reverse {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>

      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-3 sm:gap-4 will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          width: "max-content",
          animation: `${
            direction === "right" ? `${animationName}-reverse` : animationName
          } ${speed}s linear infinite`,
        }}
      >
        {/* Render 2 sets of items for seamless infinite marquee loop */}
        {[...items, ...items].map((item, index) => {
          const Content = (
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-xl",
                "bg-transparent hover:bg-white/[0.05] border border-transparent hover:border-white/10",
                "transition-all duration-200",
                "cursor-pointer group/item hover:-translate-y-0.5"
              )}
            >
              {/* Real Official White Icon - Unboxed, NO background box */}
              <img
                src={item.iconSrc}
                alt={`${item.name} logo`}
                loading="lazy"
                draggable={false}
                className="w-6 h-6 sm:w-6.5 sm:h-6.5 object-contain brightness-0 invert shrink-0 opacity-90 group-hover/item:opacity-100 transition-opacity"
              />

              {/* Text Info */}
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-sm font-bold text-white tracking-tight truncate font-jakarta">
                  {item.name}
                </span>
                {item.category && (
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold font-geist_mono">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          );

          return item.url ? (
            <a
              key={`${item.id}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl no-underline text-inherit"
              title={`Visit ${item.name} (${item.url})`}
            >
              {Content}
            </a>
          ) : (
            <div key={`${item.id}-${index}`}>{Content}</div>
          );
        })}
      </div>
    </div>
  );
};
