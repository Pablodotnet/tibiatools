import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FUSION_GOLD_GP,
  TIER_LABELS,
  calculateForgeTotals,
  runMonteCarloForge,
  type MonteCarloForgeResult,
  type ScenarioSnapshot,
} from "@/helpers/exaltationForge";
import { cn } from "@/lib/utils";

function formatGp(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("de-DE");
}

function parseGpInput(raw: string): number {
  const cleaned = raw.replace(/\./g, "").replace(/\s/g, "").replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatTc(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatMxn(n: number): string {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function ScenarioBlock({
  label,
  scenario,
  coresDecimals,
  visibleTierRows,
}: {
  label: string;
  scenario: ScenarioSnapshot;
  coresDecimals: number;
  visibleTierRows: number;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col border border-blue-300/80 dark:border-slate-600">
      <div className="bg-blue-700 px-2 py-2 text-center text-xs font-bold text-white md:text-sm dark:bg-blue-800">
        {label}
      </div>
      <div className="space-y-2 bg-sky-50/90 px-2 py-3 text-center text-xs tabular-nums text-slate-900 md:text-sm dark:bg-slate-900/50 dark:text-slate-100">
        <div className="font-semibold">{formatGp(scenario.totalGp)} gp</div>
        <div>{formatTc(scenario.tibiaCoins)} TC</div>
        <div>
          MX$ {formatMxn(scenario.mxn)}
        </div>
        <div className="text-muted-foreground text-[11px]">
          Cores:{" "}
          {scenario.exaltedCoresUsed.toLocaleString("de-DE", {
            minimumFractionDigits: coresDecimals,
            maximumFractionDigits: coresDecimals,
          })}
        </div>
      </div>
      <div className="overflow-x-auto border-t border-blue-300/80 dark:border-slate-600">
        <table className="w-full border-collapse text-center text-[10px] md:text-xs">
          <thead>
            <tr className="bg-blue-900 text-white dark:bg-blue-950">
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                Tier
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                Successes
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                Failures
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                Saved
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTierRows === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-blue-200/80 py-2 text-muted-foreground dark:border-slate-700"
                >
                  No fusion steps for target tier 0.
                </td>
              </tr>
            ) : (
              TIER_LABELS.slice(0, visibleTierRows).map((label, i) => {
                const row = scenario.tierStats[i];
                const alt = i % 2 === 0;
                return (
                  <tr
                    key={label}
                    className={cn(
                      alt
                        ? "bg-sky-100/90 dark:bg-slate-800/50"
                        : "bg-white dark:bg-slate-900/30",
                    )}
                  >
                    <td className="border border-blue-200/80 px-0.5 py-0.5 font-medium dark:border-slate-700">
                      {label}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-slate-700">
                      {row.successes}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-slate-700">
                      {row.failures}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-slate-700">
                      {row.saved}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SimulationResultsDashboard({
  snapshot,
  visibleTierRows,
}: {
  snapshot: MonteCarloForgeResult;
  visibleTierRows: number;
}) {
  const n = snapshot.runCount.toLocaleString("de-DE");
  const rows = Math.min(Math.max(visibleTierRows, 0), 10);
  return (
    <div className="overflow-x-auto rounded-md border border-blue-900/40">
      <div className="bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white md:text-base dark:bg-blue-950">
        Result of {n} simulations
      </div>
      <div className="flex flex-col gap-0 md:flex-row md:items-stretch">
        <ScenarioBlock
          label="Best case scenario"
          scenario={snapshot.best}
          coresDecimals={0}
          visibleTierRows={rows}
        />
        <ScenarioBlock
          label="Average"
          scenario={snapshot.average}
          coresDecimals={1}
          visibleTierRows={rows}
        />
        <ScenarioBlock
          label="Worst case scenario"
          scenario={snapshot.worst}
          coresDecimals={0}
          visibleTierRows={rows}
        />
      </div>
      <p className="border-t border-blue-200 bg-sky-50/80 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
        Each run simulates fusions until one item reaches your desired tier.
        Success chance is 50% (65% with &quot;Use Exalted Core 1&quot;). On
        failure, one item may lose a tier unless &quot;Use Exalted Core 2&quot;
        avoids it (50% chance). Extra items are bought at your item price when
        needed.
      </p>
    </div>
  );
}

export function ExaltationForgeSimulator() {
  const [desiredTier, setDesiredTier] = useState("1");
  const [classification, setClassification] = useState<"1" | "2" | "3" | "4">(
    "4",
  );
  const [itemValue, setItemValue] = useState("1");
  const [exaltedCoreValue, setExaltedCoreValue] = useState("1");
  const [tcGp, setTcGp] = useState("25000");
  const [mxn250, setMxn250] = useState("210");

  const [class4GoldStr, setClass4GoldStr] = useState<string[]>(() =>
    FUSION_GOLD_GP[4].map((n) => formatGp(n ?? 0)),
  );

  const [useCore1, setUseCore1] = useState<boolean[]>(() =>
    Array(10).fill(true),
  );
  const [useCore2, setUseCore2] = useState<boolean[]>(() =>
    Array(10).fill(true),
  );

  const [result, setResult] = useState<ReturnType<
    typeof calculateForgeTotals
  > | null>(null);
  const [simulation, setSimulation] = useState<MonteCarloForgeResult | null>(
    null,
  );
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const classNum = Number(classification) as 1 | 2 | 3 | 4;

  const handleCalculate = () => {
    const dt = Math.min(Math.max(parseInt(desiredTier, 10) || 0, 0), 10);
    const class4GoldByRow = class4GoldStr.map((s) => parseGpInput(s));
    const itemValueGp = parseGpInput(itemValue);
    const exaltedCoreValueGp = parseGpInput(exaltedCoreValue);
    const tcGpNum = parseGpInput(tcGp);
    const mxnPer250Tc = parseFloat(mxn250.replace(",", ".")) || 0;

    const res = calculateForgeTotals({
      desiredTier: dt,
      classification: classNum,
      class4GoldByRow,
      itemValueGp,
      exaltedCoreValueGp,
      tcGp: tcGpNum,
      mxnPer250Tc,
      useExaltedCore1: useCore1,
      useExaltedCore2: useCore2,
    });
    setResult(res);
    setSimulationError(null);

    const mc = runMonteCarloForge({
      desiredTier: dt,
      classification: classNum,
      class4GoldByRow,
      itemValueGp,
      exaltedCoreValueGp,
      tcGp: tcGpNum,
      mxnPer250Tc,
      useExaltedCore1: useCore1,
      useExaltedCore2: useCore2,
      runCount: 10_000,
    });

    if (mc === null) {
      setSimulation(null);
      setSimulationError(
        "Simulation could not run: missing forge gold for this classification at one or more tier steps.",
      );
      return;
    }
    setSimulation(mc);
  };

  const updateClass4Row = (index: number, raw: string) => {
    setClass4GoldStr((prev) => {
      const next = [...prev];
      next[index] = raw;
      return next;
    });
  };

  return (
    <div className="max-w-4xl space-y-6 font-sans text-sm text-slate-900 dark:text-slate-100">
      <div className="rounded-md border-2 border-blue-800 bg-sky-100 p-4 dark:border-sky-600 dark:bg-sky-950/40">
        <h2 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
          &gt;&gt; How to use this tool?
        </h2>
        <p className="mb-3 text-blue-950 dark:text-sky-100">
          Use this tool to estimate the cost of forging an item up to a certain
          tier (regular fusion gold from the wiki, plus item and Exalted Core
          prices you provide).
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-blue-950 dark:text-sky-100">
          <li>
            <span className="font-medium">Fill in the information:</span>
            <ul className="mt-1 list-disc pl-5">
              <li>Desired tier</li>
              <li>Item classification (1–4)</li>
              <li>Value (price) of the item used in the forge (gp)</li>
              <li>Value of the Exalted Core (gp)</li>
              <li>Value of one Tibia Coin (gp)</li>
              <li>Price of 250 Tibia Coins (MXN)</li>
            </ul>
          </li>
          <li>
            In the tier table, choose in which fusions you plan to use
            Exalted Cores (e.g. success rate / tier-loss mitigation).
          </li>
          <li>
            Click <strong>Calculate</strong> to run 10,000 random simulations and
            see best, average, and worst total cost (plus per-tier successes,
            failures, and saves).
          </li>
        </ol>
      </div>

      <div className="grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3">
        <Label htmlFor="desired-tier" className="justify-self-end text-right">
          Desired tier
        </Label>
        <Input
          id="desired-tier"
          type="number"
          min={0}
          max={10}
          className="max-w-[120px] justify-self-start"
          value={desiredTier}
          onChange={(e) => setDesiredTier(e.target.value)}
        />

        <Label className="justify-self-end text-right">Item classification</Label>
        <Select
          value={classification}
          onValueChange={(v) => setClassification(v as "1" | "2" | "3" | "4")}
        >
          <SelectTrigger className="max-w-[120px] justify-self-start w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="item-val" className="justify-self-end text-right">
          Item value (gp)
        </Label>
        <Input
          id="item-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
        />

        <Label htmlFor="core-val" className="justify-self-end text-right">
          Exalted Core value (gp)
        </Label>
        <Input
          id="core-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={exaltedCoreValue}
          onChange={(e) => setExaltedCoreValue(e.target.value)}
        />

        <Label htmlFor="tc-gp" className="justify-self-end text-right">
          Tibia Coin value (gp)
        </Label>
        <Input
          id="tc-gp"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor="mxn-250" className="justify-self-end text-right">
          Price of 250 Tibia Coins (MXN)
        </Label>
        <Input
          id="mxn-250"
          inputMode="decimal"
          className="max-w-[180px] justify-self-start"
          value={mxn250}
          onChange={(e) => setMxn250(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-blue-900/30">
        <table className="w-full min-w-[720px] border-collapse text-center text-xs md:text-sm">
          <thead>
            <tr className="bg-blue-900 text-white dark:bg-blue-950">
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Tier
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Use Exalted Core 1
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Use Exalted Core 2
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Forge gold (Class 1)
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Forge gold (Class 2)
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Forge gold (Class 3)
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                Forge gold (Class 4)
              </th>
            </tr>
          </thead>
          <tbody>
            {TIER_LABELS.map((label, rowIndex) => {
              const c1 = FUSION_GOLD_GP[1][rowIndex];
              const c2 = FUSION_GOLD_GP[2][rowIndex];
              const c3 = FUSION_GOLD_GP[3][rowIndex];
              const alt = rowIndex % 2 === 0;
              return (
                <tr
                  key={label}
                  className={cn(
                    alt
                      ? "bg-sky-100/80 dark:bg-sky-950/30"
                      : "bg-white dark:bg-slate-900/40",
                  )}
                >
                  <td className="border border-blue-200 px-1 py-1.5 font-medium dark:border-slate-700">
                    {label}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 dark:border-slate-700">
                    <input
                      type="checkbox"
                      className="size-4 accent-blue-900"
                      checked={useCore1[rowIndex]}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setUseCore1((prev) => {
                          const n = [...prev];
                          n[rowIndex] = v;
                          return n;
                        });
                      }}
                    />
                  </td>
                  <td className="border border-blue-200 px-1 py-1 dark:border-slate-700">
                    <input
                      type="checkbox"
                      className="size-4 accent-blue-900"
                      checked={useCore2[rowIndex]}
                      onChange={(e) => {
                        const v = e.target.checked;
                        setUseCore2((prev) => {
                          const n = [...prev];
                          n[rowIndex] = v;
                          return n;
                        });
                      }}
                    />
                  </td>
                  <td className="border border-blue-200 px-1 py-1 text-slate-800 tabular-nums dark:border-slate-700 dark:text-slate-200">
                    {c1 === null ? "—" : formatGp(c1)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 text-slate-800 tabular-nums dark:border-slate-700 dark:text-slate-200">
                    {c2 === null ? "—" : formatGp(c2)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 text-slate-800 tabular-nums dark:border-slate-700 dark:text-slate-200">
                    {c3 === null ? "—" : formatGp(c3)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 dark:border-slate-700">
                    <Input
                      className="h-8 min-w-[100px] text-center text-xs tabular-nums md:text-sm"
                      inputMode="numeric"
                      value={class4GoldStr[rowIndex]}
                      onChange={(e) =>
                        updateClass4Row(rowIndex, e.target.value)
                      }
                      aria-label={`Class 4 forge gold for ${label}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground text-xs">
        Forge gold values follow Tibia Wiki (
        <span className="whitespace-nowrap">Equipment Upgrade → Fusion</span>
        ). Class 4 amounts are editable if you want to model other costs.
        Totals use the column that matches your classification.
      </p>

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
        <div className="space-y-4">
          {result.invalidRowIndices.length > 0 && (
            <p className="text-destructive text-sm">
              Classification {classification} has no listed fusion gold for tier
              step(s):{" "}
              {result.invalidRowIndices
                .map((i) => TIER_LABELS[i])
                .join(", ")}
              . Deterministic totals skip those steps.
            </p>
          )}

          {simulationError && (
            <p className="text-destructive text-sm">{simulationError}</p>
          )}

          {simulation && (
            <SimulationResultsDashboard
              snapshot={simulation}
              visibleTierRows={Math.min(
                Math.max(parseInt(desiredTier, 10) || 0, 0),
                10,
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
