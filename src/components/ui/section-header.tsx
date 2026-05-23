type SectionHeaderProps = {
  title: string;
  /** Optional subtitle rendered below the ornamental divider */
  subtitle?: string;
  /** Light variant - for dark background sections */
  light?: boolean;
  className?: string;
};

/** Reusable  -----  * Title *  -----  divider used across all home sections */
export function SectionHeader({
  title,
  subtitle,
  light = false,
  className = "",
}: SectionHeaderProps) {
  const gold = "var(--gold)";
  const textCol = light ? "var(--cream)" : "var(--bg-dark)";
  const dimCol = light ? "rgba(201,169,110,0.5)" : "rgba(138,106,58,0.45)";

  return (
    <div className={`text-center ${className}`}>
      {/* Ornamental divider row */}
      <div className="flex items-center justify-center gap-3 mb-1">
        <span
          className="flex-1 h-px max-w-[140px]"
          style={{
            background: `linear-gradient(to right, transparent, ${dimCol})`,
          }}
        />
        <span
          className="display-font text-base font-medium tracking-[0.14em]"
          style={{ color: gold }}
        >
          * {title} *
        </span>
        <span
          className="flex-1 h-px max-w-[140px]"
          style={{
            background: `linear-gradient(to left, transparent, ${dimCol})`,
          }}
        />
      </div>
      {subtitle && (
        <p
          className="mt-2 text-sm tracking-[0.12em] uppercase"
          style={{ color: textCol, opacity: 0.55 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
