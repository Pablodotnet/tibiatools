export function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 px-3 py-1.5 text-sm ${
        highlight
          ? "bg-blue-900 font-bold text-white"
          : "odd:bg-sky-50/80 even:bg-white dark:odd:bg-sky-950/20 dark:even:bg-slate-900/30"
      } dark:text-slate-100`}
    >
      <span className="text-left">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
