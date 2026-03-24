// ConvergenceTransferCalculator.tsx
// Convergence Transfer: Class 4 only, no tier loss, 160 Dust,
// source item destroyed, receiver gets SAME tier as source (no -1)

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateConvergenceTransfer,
  formatGp,
  formatMxn,
  formatTc,
  parseGpInput,
  type ConvergenceTransferResult,
} from "@/helpers/exaltationForge";

function ResultRow({
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

export function ConvergenceTransferCalculator() {
  const [sourceTier, setSourceTier] = useState("1");
  const [sourceItemValue, setSourceItemValue] = useState("0");
  const [targetItemValue, setTargetItemValue] = useState("0");
  const [exaltedCoreValue, setExaltedCoreValue] = useState("1");
  const [tcGp, setTcGp] = useState("25000");
  const [mxn250, setMxn250] = useState("210");
  const [result, setResult] = useState<ConvergenceTransferResult | null>(null);

  const handleCalculate = () => {
    const res = calculateConvergenceTransfer({
      sourceTier: parseInt(sourceTier, 10) || 1,
      sourceItemValueGp: parseGpInput(sourceItemValue),
      targetItemValueGp: parseGpInput(targetItemValue),
      exaltedCoreValueGp: parseGpInput(exaltedCoreValue),
      tcGp: parseGpInput(tcGp),
      mxnPer250Tc: parseFloat(mxn250.replace(",", ".")) || 0,
    });
    setResult(res);
  };

  return (
    <div className="max-w-lg space-y-5 font-sans text-sm text-slate-900 dark:text-slate-100">
      <div className="rounded-md border-2 border-blue-800 bg-sky-100 p-4 dark:border-sky-600 dark:bg-sky-950/40">
        <h2 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
          &gt;&gt; How Convergence Transfer works
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-blue-950 dark:text-sky-100">
          <li>Available for <strong>Classification 4 items only</strong>.</li>
          <li>
            Transfers a tier with <strong>no tier loss</strong> — target receives the{" "}
            <strong>same</strong> tier as the source (unlike regular transfer which gives tier-1).
          </li>
          <li>
            Allows transferring between <strong>different body slots</strong> (e.g. Falcon Wand →
            Sanguine Legs).
          </li>
          <li>
            Source item is <strong>destroyed</strong>. Target must be at tier 0.
          </li>
          <li>Costs <strong>160 Dust</strong> + Exalted Cores + Gold.</li>
        </ul>
      </div>

      <div className="grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3">
        <Label htmlFor="ct-tier" className="justify-self-end text-right">
          Source item tier
        </Label>
        <Input
          id="ct-tier"
          type="number"
          min={1}
          max={7}
          className="max-w-[120px] justify-self-start"
          value={sourceTier}
          onChange={(e) => setSourceTier(e.target.value)}
        />

        <Label htmlFor="ct-src-val" className="justify-self-end text-right">
          Source item value (gp)
        </Label>
        <Input
          id="ct-src-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={sourceItemValue}
          onChange={(e) => setSourceItemValue(e.target.value)}
        />

        <Label htmlFor="ct-tgt-val" className="justify-self-end text-right">
          Target item value (gp)
        </Label>
        <Input
          id="ct-tgt-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={targetItemValue}
          onChange={(e) => setTargetItemValue(e.target.value)}
        />

        <Label htmlFor="ct-core-val" className="justify-self-end text-right">
          Exalted Core value (gp)
        </Label>
        <Input
          id="ct-core-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={exaltedCoreValue}
          onChange={(e) => setExaltedCoreValue(e.target.value)}
        />

        <Label htmlFor="ct-tc" className="justify-self-end text-right">
          Tibia Coin value (gp)
        </Label>
        <Input
          id="ct-tc"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor="ct-mxn" className="justify-self-end text-right">
          Price of 250 TC (MXN)
        </Label>
        <Input
          id="ct-mxn"
          inputMode="decimal"
          className="max-w-[180px] justify-self-start"
          value={mxn250}
          onChange={(e) => setMxn250(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="rounded-md bg-blue-900 px-8 font-bold text-white hover:bg-blue-950 dark:bg-blue-800 dark:hover:bg-blue-900"
          onClick={handleCalculate}
        >
          Calculate
        </Button>
      </div>

      {result && (
        <div className="overflow-hidden rounded-md border border-blue-900/40">
          <div className="bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-blue-950">
            Convergence Transfer Result
          </div>
          {!result.isValid ? (
            <p className="p-3 text-sm text-red-600 dark:text-red-400">
              {result.errorMessage}
            </p>
          ) : (
            <>
              <ResultRow
                label="Resulting tier on target"
                value={`Tier ${result.resultingTier} (no tier loss!)`}
              />
              <ResultRow
                label="Forge gold fee"
                value={`${formatGp(result.goldFee!)} gp`}
              />
              <ResultRow
                label="Exalted Cores required"
                value={`${result.coresRequired} cores (${formatGp(result.coreCostGp)} gp)`}
              />
              <ResultRow
                label="Source item cost"
                value={`${formatGp(result.sourceItemCostGp)} gp`}
              />
              <ResultRow
                label="Target item cost"
                value={`${formatGp(result.targetItemCostGp)} gp`}
              />
              <ResultRow label="Dust required" value="160 Dust" />
              <ResultRow
                label="Total cost (gp)"
                value={`${formatGp(result.totalGp!)} gp`}
                highlight
              />
              <ResultRow
                label="≈ Tibia Coins"
                value={`${formatTc(result.tibiaCoins)} TC`}
              />
              <ResultRow
                label="≈ MXN"
                value={`MX$ ${formatMxn(result.mxn)}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}