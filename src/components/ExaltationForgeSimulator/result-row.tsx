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
          : "odd:bg-muted/50 even:bg-background"
      } text-foreground`}
    >
      <span className="text-left">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
