import { useState, useEffect, useRef } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  FUSION_GOLD_GP,
  TIER_LABELS,
  calculateForgeTotals,
  formatGp,
  formatTc,
  formatMxn,
  parseGpInput,
  type MonteCarloForgeResult,
  type ScenarioSnapshot,
} from "@/helpers/exaltationForge";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  startFetchUserProjects,
  startAddEntry,
} from "@/store/tierProjects";
import type { TierProject } from "@/types/tierProject";
import { useTranslation } from "react-i18next";

function ScenarioBlock({
  label,
  scenario,
  coresDecimals,
  visibleTierRows,
  t,
}: {
  label: string;
  scenario: ScenarioSnapshot;
  coresDecimals: number;
  visibleTierRows: number;
  t: (key: string) => string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col border border-blue-300/80 dark:border-border">
      <div className="bg-blue-700 px-2 py-2 text-center text-xs font-bold text-white md:text-sm dark:bg-blue-800">
        {label}
      </div>
      <div className="space-y-2 bg-muted/30 px-2 py-3 text-center text-xs tabular-nums text-foreground md:text-sm">
        <div className="font-semibold">{formatGp(scenario.totalGp)} gp</div>
        <div>{formatTc(scenario.tibiaCoins)} TC</div>
        <div>
          MX$ {formatMxn(scenario.mxn)}
        </div>
        <div className="text-muted-foreground text-[11px]">
          {t("exaltationForge.cores")}:{" "}
          {scenario.exaltedCoresUsed.toLocaleString("de-DE", {
            minimumFractionDigits: coresDecimals,
            maximumFractionDigits: coresDecimals,
          })}
        </div>
      </div>
      <div className="overflow-x-auto border-t border-blue-300/80 dark:border-border">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr className="bg-blue-900 text-white dark:bg-blue-950">
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                {t("exaltationForge.tier")}
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                {t("exaltationForge.successes")}
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                {t("exaltationForge.failures")}
              </th>
              <th className="border border-blue-800 px-0.5 py-1 font-semibold">
                {t("exaltationForge.saved")}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleTierRows === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-blue-200/80 py-2 text-muted-foreground dark:border-border"
                >
                  {t("exaltationForge.noFusionSteps")}
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
                        ? "bg-muted/50"
                        : "bg-card",
                    )}
                  >
                    <td className="border border-blue-200/80 px-0.5 py-0.5 font-medium dark:border-border">
                      {label}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-border">
                      {row.successes}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-border">
                      {row.failures}
                    </td>
                    <td className="border border-blue-200/80 px-0.5 py-0.5 tabular-nums dark:border-border">
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
  t,
}: {
  snapshot: MonteCarloForgeResult;
  visibleTierRows: number;
  t: (key: string) => string;
}) {
  const n = snapshot.runCount.toLocaleString("de-DE");
  const rows = Math.min(Math.max(visibleTierRows, 0), 10);
  return (
    <div className="overflow-x-auto rounded-md border border-blue-900/40">
      <div className="bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white md:text-base dark:bg-blue-950">
        {t("exaltationForge.resultOfSimulations").replace("{{count}}", n)}
      </div>
      <div className="flex flex-col gap-0 md:flex-row md:items-stretch">
        <ScenarioBlock
          label={t("exaltationForge.bestCase")}
          scenario={snapshot.best}
          coresDecimals={0}
          visibleTierRows={rows}
          t={t}
        />
        <ScenarioBlock
          label={t("exaltationForge.averageCase")}
          scenario={snapshot.average}
          coresDecimals={1}
          visibleTierRows={rows}
          t={t}
        />
        <ScenarioBlock
          label={t("exaltationForge.worstCase")}
          scenario={snapshot.worst}
          coresDecimals={0}
          visibleTierRows={rows}
          t={t}
        />
      </div>
      <p className="border-t border-blue-200 bg-sky-50/80 px-3 py-2 text-[11px] text-slate-600 dark:border-border bg-muted/30 text-muted-foreground">
        {t("exaltationForge.simulationNote")}
      </p>
    </div>
  );
}

export function ExaltationForgeSimulator() {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((s) => s.tierProjects);
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
  const [calculating, setCalculating] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importProjectId, setImportProjectId] = useState("");
  const { t } = useTranslation();

  const classNum = Number(classification) as 1 | 2 | 3 | 4;

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (showImportDialog) {
      dispatch(startFetchUserProjects());
    }
  }, [showImportDialog, dispatch]);

  const handleImportToProject = async () => {
    if (!importProjectId || !result) return;
    const dt = Math.min(Math.max(parseInt(desiredTier, 10) || 0, 0), 10);
    const items = [
      { name: `Forge gold (tier 0→${dt})`, costGp: result.forgeGoldGp },
      { name: `Items purchased`, costGp: result.itemCostGp },
    ];
    const entryData = {
      fromTier: 0,
      toTier: dt,
      items,
      notes: `Imported from Forge Simulator. Classification: ${classification}, core value: ${exaltedCoreValue} gp`,
      method: 'fusion',
      classification: classNum,
      exaltedCores: result.exaltedCoresUsed,
    };
    const res = await dispatch(startAddEntry(importProjectId, entryData));
    if (res.ok) {
      toast.success(t("exaltationForge.importSuccess"));
      setShowImportDialog(false);
      setImportProjectId("");
    } else {
      toast.error(res.error);
    }
  };

  const handleCalculate = () => {
    const dt = Math.min(Math.max(parseInt(desiredTier, 10) || 0, 0), 10);
    const class4GoldByRow = class4GoldStr.map((s) => parseGpInput(s));
    const itemValueGp = parseGpInput(itemValue);
    const exaltedCoreValueGp = parseGpInput(exaltedCoreValue);
    const tcGpNum = parseGpInput(tcGp);
    const mxnPer250Tc = parseFloat(mxn250.replace(",", ".")) || 0;

    setCalculating(true);
    setSimulationError(null);

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

    workerRef.current?.terminate();
    const worker = new Worker(
      new URL('@/workers/forge-worker.ts', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.postMessage({
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

    worker.onmessage = (e: MessageEvent) => {
      const mc = e.data;
      if (mc === null) {
        setSimulation(null);
        setSimulationError(t("exaltationForge.simErrorMissingGold"));
      } else {
        setSimulation(mc);
      }
      setCalculating(false);
      worker.terminate();
      workerRef.current = null;
    };
  };

  const updateClass4Row = (index: number, raw: string) => {
    setClass4GoldStr((prev) => {
      const next = [...prev];
      next[index] = raw;
      return next;
    });
  };

  return (
    <div className="max-w-4xl space-y-6 font-sans text-sm text-foreground">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <AlertTitle className="font-semibold text-orange-600 dark:text-orange-400">
          &gt;&gt; {t("exaltationForge.howToUse")}
        </AlertTitle>
        <AlertDescription className="text-blue-950 dark:text-sky-100">
          <p className="mb-3">{t("exaltationForge.howToUseDesc")}</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <span className="font-medium">{t("exaltationForge.fusionHelp1")}</span>
              <ul className="mt-1 list-disc pl-5">
                <li>{t("exaltationForge.fusionHelp1a")}</li>
                <li>{t("exaltationForge.fusionHelp1b")}</li>
                <li>{t("exaltationForge.fusionHelp1c")}</li>
                <li>{t("exaltationForge.fusionHelp1d")}</li>
                <li>{t("exaltationForge.fusionHelp1e")}</li>
                <li>{t("exaltationForge.fusionHelp1f")}</li>
              </ul>
            </li>
            <li>{t("exaltationForge.fusionHelp2")}</li>
            <li>{t("exaltationForge.fusionHelp3")}</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3">
        <Label htmlFor="desired-tier" className="justify-self-end text-right">
          {t("exaltationForge.desiredTier")}
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

        <Label className="justify-self-end text-right">{t("exaltationForge.itemClassification")}</Label>
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
          {t("exaltationForge.itemValue")}
        </Label>
        <Input
          id="item-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
        />

        <Label htmlFor="core-val" className="justify-self-end text-right">
          {t("exaltationForge.exaltedCoreValue")}
        </Label>
        <Input
          id="core-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={exaltedCoreValue}
          onChange={(e) => setExaltedCoreValue(e.target.value)}
        />

        <Label htmlFor="tc-gp" className="justify-self-end text-right">
          {t("exaltationForge.tibiaCoinValue")}
        </Label>
        <Input
          id="tc-gp"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor="mxn-250" className="justify-self-end text-right">
          {t("exaltationForge.priceOf250Tc")}
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
                {t("exaltationForge.tier")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.useCore1")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.useCore2")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.forgeGoldClass1")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.forgeGoldClass2")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.forgeGoldClass3")}
              </th>
              <th className="border border-blue-800 px-1 py-2 font-semibold">
                {t("exaltationForge.forgeGoldClass4")}
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
                        ? "bg-muted/50"
                        : "bg-card",
                  )}
                >
                  <td className="border border-blue-200 px-1 py-1.5 font-medium dark:border-border">
                    {label}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 dark:border-border">
                    <input
                      type="checkbox"
                      aria-label={t('exaltationForge.useCore1')}
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
                  <td className="border border-blue-200 px-1 py-1 dark:border-border">
                    <input
                      type="checkbox"
                      aria-label={t('exaltationForge.useCore2')}
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
                  <td className="border border-blue-200 px-1 py-1 tabular-nums text-foreground dark:border-border">
                    {c1 === null ? "—" : formatGp(c1)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 tabular-nums text-foreground dark:border-border">
                    {c2 === null ? "—" : formatGp(c2)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 tabular-nums text-foreground dark:border-border">
                    {c3 === null ? "—" : formatGp(c3)}
                  </td>
                  <td className="border border-blue-200 px-1 py-1 dark:border-border">
                    <Input
                      className="h-8 min-w-[100px] text-center text-xs tabular-nums md:text-sm"
                      inputMode="numeric"
                      value={class4GoldStr[rowIndex]}
                      onChange={(e) =>
                        updateClass4Row(rowIndex, e.target.value)
                      }
                      aria-label={t('exaltationForge.class4ForgeGoldLabel').replace('{{label}}', label)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground text-xs">
        {t("exaltationForge.forgeGoldNote")}
      </p>

      <div className="flex justify-end">
        <Button
          type="button"
          className="rounded-md bg-blue-900 px-8 font-bold text-white hover:bg-blue-950 dark:bg-blue-800 dark:hover:bg-blue-900"
          onClick={handleCalculate}
          disabled={calculating}
        >
          {calculating ? (
            <span className="flex items-center gap-2">
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("exaltationForge.calculating")}
            </span>
          ) : (
            t("exaltationForge.calculate")
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          {result.invalidRowIndices.length > 0 && (
            <p className="text-destructive text-sm">
              {t("exaltationForge.noFusionGold")
                .replace("{{classification}}", classification)
                .replace("{{steps}}", result.invalidRowIndices.map((i) => TIER_LABELS[i]).join(", "))}
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
              t={t}
            />
          )}

          {result && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImportDialog(true)}
                className="gap-2"
              >
                {t("exaltationForge.importToProject")}
              </Button>
            </div>
          )}

          <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("exaltationForge.importDialogTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("exaltationForge.importDialogDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Select value={importProjectId} onValueChange={setImportProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("exaltationForge.importDialogSelect")} />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.length === 0 && (
                      <SelectItem value="" disabled>{t("exaltationForge.importDialogNoProjects")}</SelectItem>
                    )}
                    {projects.map((p: TierProject) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setImportProjectId("")}>
                  {t("exaltationForge.importDialogCancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleImportToProject} disabled={!importProjectId}>
                  {t("exaltationForge.importDialogImport")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
