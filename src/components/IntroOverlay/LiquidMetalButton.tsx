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
      className={`group relative inline-flex items-center justify-center rounded-full text-xs font-semibold tracking-wider uppercase text-emerald-100 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${className}`}
      aria-label={label}
    >
      {/* Outer Glow / Border */}
      <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-emerald-500/40 via-emerald-300/60 to-emerald-600/40 group-hover:from-emerald-400 group-hover:to-emerald-300 transition-all duration-500">
        <span className="absolute inset-0 rounded-full bg-[#0d1c10]/90 backdrop-blur-md" />
      </span>

      {/* Shimmer / Liquid highlight */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-emerald-400/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute -inset-full rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

      {/* Button Text */}
      <span className="relative z-10 font-mono tracking-widest text-[0.72rem] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
};
