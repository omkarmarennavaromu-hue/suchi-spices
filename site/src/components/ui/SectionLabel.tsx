interface SectionLabelProps {
  index: string;
  title: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/** The recurring editorial rail: 03 — SIGNATURE COLLECTION ————————————— */
export function SectionLabel({ index, title, tone = 'light', className = '' }: SectionLabelProps) {
  const dot = tone === 'light' ? 'text-saffron' : 'text-vermilion';
  const line = tone === 'light' ? 'bg-ivory/25' : 'bg-ink/20';
  const text = tone === 'light' ? 'text-ivory/60' : 'text-ink/55';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`label-sm ${dot}`}>{index}</span>
      <span className={`h-px w-8 ${line}`} />
      <span className={`label-sm ${text}`}>{title}</span>
    </div>
  );
}
