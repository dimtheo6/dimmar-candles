import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  align?: "center" | "left";
  /** Tailwind height class or arbitrary value, e.g. "h-[3px]" */
  lineThickness?: string;
}

export function SectionHeading({
  children,
  className = "",
  compact = false,
  align = "center",
  lineThickness = "h-[1.6px]", // change default thickness here
}: SectionHeadingProps) {
  const base = "w-full flex items-center gap-4 max-w-7xl mx-auto px-4";
  const spacing = compact ? "my-4" : "mt-12 mb-4";
  const alignCls = align === "left" ? "justify-start" : "";
  const merged = [base, spacing, alignCls, className].filter(Boolean).join(" ");
  const lineCls = `${lineThickness} bg-gradient-to-r from-transparent via-neutral-300 to-neutral-400`;
  const lineClsReverse = `${lineThickness} bg-gradient-to-l from-transparent via-neutral-300 to-neutral-400`;
  return (
    <div className={merged}>
      <div className={`flex-1 ${lineCls}`} />
      <h2 className="text-xs md:text-sm tracking-[0.5em] uppercase text-neutral-600 whitespace-nowrap">
        {children}
      </h2>
      <div className={`flex-1 ${lineClsReverse}`} />
    </div>
  );
}

export default SectionHeading;