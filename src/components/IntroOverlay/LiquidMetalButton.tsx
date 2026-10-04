import React from "react";

interface LiquidMetalButtonProps {
  label: string;
  onClick: () => void;
  width?: number;
  height?: number;
  className?: string;
}

export const LiquidMetalButton: React.FC<LiquidMetalButtonProps> = ({
  label,
  onClick,
  width = 128,
  height = 40,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`group relative inline-flex items-center justify-center rounded-full text-xs font-semibold tracking-wider uppercase text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30 opacity-60 hover:opacity-100 ${className}`}
      aria-label={label}
    >
      {/* Outer Metallic Rim / Border */}
      <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-white/15 via-white/25 to-white/10 group-hover:from-white/50 group-hover:via-white/70 group-hover:to-white/40 transition-all duration-500">
        <span className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-md" />
      </span>

      {/* Shimmer / Liquid metal highlight */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300" />
      <span className="absolute -inset-full rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/15 via-transparent to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

      {/* Button Text */}
      <span className="relative z-10 font-mono tracking-widest text-[0.72rem] text-white/80 group-hover:text-white transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
        {label}
      </span>
    </button>
  );
};
