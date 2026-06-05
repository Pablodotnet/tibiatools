// TransferCalculator.tsx
// Regular Transfer: guaranteed, source item destroyed, receiver gets tier-1
// Requires 100 Dust + Exalted Cores + Gold

import { useState } from "react";
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
  calculateTransfer,
  formatGp,
  formatMxn,
  formatTc,
  parseGpInput,
  type TransferResult,
} from "@/helpers/exaltationForge";
import { ResultRow } from "./result-row";
import { useTranslation } from "react-i18next";

export function TransferCalculator() {
  const { t } = useTranslation();
  const [sourceTier, setSourceTier] = useState("2");
  const [classification, setClassification] = useState<"1" | "2" | "3" | "4">("4");
  const [sourceItemValue, setSourceItemValue] = useState("0");
  const [targetItemValue, setTargetItemValue] = useState("0");
  const [exaltedCoreValue, setExaltedCoreValue] = useState("1");
  const [tcGp, setTcGp] = useState("25000");
  const [mxn250, setMxn250] = useState("210");
  const [result, setResult] = useState<TransferResult | null>(null);

  const handleCalculate = () => {
    const res = calculateTransfer({
      sourceTier: parseInt(sourceTier, 10) || 2,
      classification: Number(classification) as 1 | 2 | 3 | 4,
      sourceItemValueGp: parseGpInput(sourceItemValue),
      targetItemValueGp: parseGpInput(targetItemValue),
      exaltedCoreValueGp: parseGpInput(exaltedCoreValue),
      tcGp: parseGpInput(tcGp),
      mxnPer250Tc: parseFloat(mxn250.replace(",", ".")) || 0,
    });
    setResult(res);
  };

  return (
    <div className="max-w-lg space-y-5 font-sans text-sm text-foreground">
      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <AlertTitle className="font-semibold text-orange-600 dark:text-orange-400">
          &gt;&gt; {t("exaltationForge.transferHelp")}
        </AlertTitle>
        <AlertDescription className="text-blue-950 dark:text-sky-100">
          <ul className="list-disc space-y-1 pl-5">
            <li>{t("exaltationForge.transferHelp1")}</li>
            <li>{t("exaltationForge.transferHelp2")}</li>
            <li>{t("exaltationForge.transferHelp3")}</li>
            <li>{t("exaltationForge.transferHelp4")}</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid max-w-md grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3">
        <Label htmlFor="tr-src-tier" className="justify-self-end text-right">
          {t("exaltationForge.sourceItemTier")}
        </Label>
        <Input
          id="tr-src-tier"
          type="number"
          min={2}
          max={10}
          className="max-w-[120px] justify-self-start"
          value={sourceTier}
          onChange={(e) => setSourceTier(e.target.value)}
        />

        <Label className="justify-self-end text-right">{t("exaltationForge.itemClassification")}</Label>
        <Select
          value={classification}
          onValueChange={(v) => setClassification(v as "1" | "2" | "3" | "4")}
        >
          <SelectTrigger className="max-w-[120px] w-full justify-self-start">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>

        <Label htmlFor="tr-src-val" className="justify-self-end text-right">
          {t("exaltationForge.sourceItemValue")}
        </Label>
        <Input
          id="tr-src-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={sourceItemValue}
          onChange={(e) => setSourceItemValue(e.target.value)}
        />

        <Label htmlFor="tr-tgt-val" className="justify-self-end text-right">
          {t("exaltationForge.targetItemValue")}
        </Label>
        <Input
          id="tr-tgt-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={targetItemValue}
          onChange={(e) => setTargetItemValue(e.target.value)}
        />

        <Label htmlFor="tr-core-val" className="justify-self-end text-right">
          {t("exaltationForge.exaltedCoreValue")}
        </Label>
        <Input
          id="tr-core-val"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={exaltedCoreValue}
          onChange={(e) => setExaltedCoreValue(e.target.value)}
        />

        <Label htmlFor="tr-tc-gp" className="justify-self-end text-right">
          {t("exaltationForge.tibiaCoinValue")}
        </Label>
        <Input
          id="tr-tc-gp"
          inputMode="numeric"
          className="max-w-[180px] justify-self-start"
          value={tcGp}
          onChange={(e) => setTcGp(e.target.value)}
        />

        <Label htmlFor="tr-mxn" className="justify-self-end text-right">
          {t("exaltationForge.priceOf250Tc")}
        </Label>
        <Input
          id="tr-mxn"
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
          {t("exaltationForge.calculate")}
        </Button>
      </div>

      {result && (
        <div className="overflow-hidden rounded-md border border-blue-900/40">
          <div className="bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-blue-950">
            {t("exaltationForge.transferResult")}
          </div>
          {!result.isValid ? (
            <p className="p-3 text-sm text-destructive">
              {result.errorMessage}
            </p>
          ) : (
            <>
              <ResultRow
                label={t("exaltationForge.resultingTier")}
                value={`Tier ${result.resultingTier}`}
              />
              <ResultRow
                label={t("exaltationForge.forgeGoldFee")}
                value={`${formatGp(result.goldFee!)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.exaltedCoresRequired")}
                value={`${result.coresRequired} cores (${formatGp(result.coreCostGp)} gp)`}
              />
              <ResultRow
                label={t("exaltationForge.sourceItemCost")}
                value={`${formatGp(result.sourceItemCostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.targetItemCost")}
                value={`${formatGp(result.targetItemCostGp)} gp`}
              />
              <ResultRow
                label={t("exaltationForge.dustRequired")}
                value="100 Dust"
              />
              <ResultRow
                label={t("exaltationForge.totalCost")}
                value={`${formatGp(result.totalGp!)} gp`}
                highlight
              />
              <ResultRow
                label={`≈ ${t("exaltationForge.tibiaCoins")}`}
                value={`${formatTc(result.tibiaCoins)} TC`}
              />
              <ResultRow
                label={`≈ ${t("exaltationForge.realMoney")}`}
                value={`MX$ ${formatMxn(result.mxn)}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}