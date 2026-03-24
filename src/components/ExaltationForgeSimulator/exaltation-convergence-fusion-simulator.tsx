// ConvergenceFusionCalculator.tsx
// Convergence Fusion: Class 4 only, guaranteed, 130 Dust per step,
// two items of same body slot (can be different items), no tier loss, no bonus effects

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateConvergenceFusion,
  formatGp,
  formatMxn,
  formatTc,
  parseGpInput,
  type ConvergenceFusionResult,
} from "@/helpers/exaltationForge";
import { cn } from "@/lib/utils";

export function ConvergenceFusionCalculator() {
  const [targetTier, setTargetTier] = useState("1");
  const [item1Value, setItem1Value] = useState("0");
  const [item2Value, setItem2Value] = useState("0");
  const [tcGp, setTcGp] = useState("25000");
  const [mxn250, setMxn250] = useState("210");
  const [result, setResult] = useState<ConvergenceFusionResult | null>(null);

  const handleCalculate = () => {
    const res = calculateConvergenceFusion({
      targetTier: Math.min(Math.max(parseInt(targetTier, 10) || 1, 1), 10),
      item1ValueGp: parseGpInput(item1Value),
      item2ValueGp: parseGpInput(item2Value),
      tcGp: parseGpInput(tcGp),
      mxnPer250Tc: parseFloat(mxn250.replace(",", ".")) || 0,
    });
    setResult(res);
  };

  return (
    <div className="max-w-2xl space-y-5 font-sans text-sm text-slate-900 dark:text-slate-100">
      <div className="rounded-md border-2 border-blue-800 bg-sky-100 p-4 dark:border-sky-600 dark:bg-sky-950/40">
        <h2 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
          &gt;&gt; How Convergence Fusion works
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-blue-950 dark:text-sky-100">
          <li>Available for <strong>Classification 4 items only</strong>.</li>
          <li>
            Fuse two different items of the same <strong>body slot</strong> (e.g. two different
            class-4 armors), provided they are the same tier.
          </li>
          <li>
            <strong>Guaranteed success</strong> — no RNG, no bonus effects, no tier loss.
          </li>
          <li>Costs <strong>130 Dust</strong> per step (vs 100 for regular fusion).</li>
          <li>
            The second item is <strong>always consumed</strong>. You need fresh pairs at each
            tier step.
          </li>
        </ul>
      </div>

      <div className="grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3">
        <Label htmlFor="cf-tier" className="justify-self-end text-right">
          Desired target tier
        </Label>
        <Input
          id="cf-tier"
          type="number"
          min={1}
          max={10}
          className="max-w-[120px] justify-self-start"
          value={targetTier}
          onChange={(e) => setTargetTier(e.target.value)}
        />

        <Label htmlFor="cf-item1" className="justify-self-end text-right">
          Item 1 value (gp)
        </Label>
        <Input
          id="cf-item1"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={item1Value}
          onChange={(e) => setItem1Value(e.target.value)}
        />

        <Label htmlFor="cf-item2" className="justify-self-end text-right">
          Item 2 value (gp) <span className="text-muted-foreground">(consumed)</span>
        </Label>
        <Input
          id="cf-item2"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={item2Value}
          onChange={(e) => setItem2Value(e.target.value)}
        />

        <Label htmlFor="cf-tc" className="justify-self-end text-right">
          Tibia Coin value (gp)
        </Label>
        <Input
          id="cf-tc"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor="cf-mxn" className="justify-self-end text-right">
          Price of 250 TC (MXN)
        </Label>
        <Input
          id="cf-mxn"
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
            Convergence Fusion Result
          </div>

          {!result.isValid ? (
            <p className="p-3 text-sm text-red-600 dark:text-red-400">
              {result.errorMessage}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center text-xs md:text-sm">
                  <thead>
                    <tr className="bg-blue-900 text-white dark:bg-blue-950">
                      <th className="border border-blue-800 px-2 py-1.5 font-semibold">Tier step</th>
                      <th className="border border-blue-800 px-2 py-1.5 font-semibold">Gold fee</th>
                      <th className="border border-blue-800 px-2 py-1.5 font-semibold">Item costs</th>
                      <th className="border border-blue-800 px-2 py-1.5 font-semibold">Step total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((step, i) => (
                      <tr
                        key={step.tierLabel}
                        className={cn(
                          i % 2 === 0
                            ? "bg-sky-100/80 dark:bg-sky-950/30"
                            : "bg-white dark:bg-slate-900/40"
                        )}
                      >
                        <td className="border border-blue-200 px-2 py-1 font-medium dark:border-slate-700">
                          {step.tierLabel}
                        </td>
                        <td className="border border-blue-200 px-2 py-1 tabular-nums dark:border-slate-700">
                          {formatGp(step.goldFee)} gp
                        </td>
                        <td className="border border-blue-200 px-2 py-1 tabular-nums dark:border-slate-700">
                          {formatGp(step.item1Cost + step.item2Cost)} gp
                        </td>
                        <td className="border border-blue-200 px-2 py-1 tabular-nums font-semibold dark:border-slate-700">
                          {formatGp(step.stepTotal)} gp
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-900 font-bold text-white dark:bg-blue-950">
                      <td className="border border-blue-800 px-2 py-1.5">Total</td>
                      <td className="border border-blue-800 px-2 py-1.5 tabular-nums">
                        {formatGp(result.totalGoldFees)} gp
                      </td>
                      <td className="border border-blue-800 px-2 py-1.5 tabular-nums">
                        {formatGp(result.totalItemCosts)} gp
                      </td>
                      <td className="border border-blue-800 px-2 py-1.5 tabular-nums">
                        {formatGp(result.totalGp)} gp
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="space-y-0.5 border-t border-blue-200 dark:border-slate-700">
                <div className="flex justify-between gap-4 px-3 py-1.5 text-sm odd:bg-sky-50/80 dark:bg-slate-900/30">
                  <span>Dust required</span>
                  <span className="tabular-nums">{result.steps.length * 130} Dust</span>
                </div>
                <div className="flex justify-between gap-4 bg-blue-900 px-3 py-1.5 text-sm font-bold text-white">
                  <span>Total (gp)</span>
                  <span className="tabular-nums">{formatGp(result.totalGp)} gp</span>
                </div>
                <div className="flex justify-between gap-4 px-3 py-1.5 text-sm odd:bg-sky-50/80 dark:bg-slate-900/30">
                  <span>≈ Tibia Coins</span>
                  <span className="tabular-nums">{formatTc(result.tibiaCoins)} TC</span>
                </div>
                <div className="flex justify-between gap-4 px-3 py-1.5 text-sm even:bg-white dark:even:bg-slate-900/30">
                  <span>≈ MXN</span>
                  <span className="tabular-nums">MX$ {formatMxn(result.mxn)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}