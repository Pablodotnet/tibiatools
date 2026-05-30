// ExaltationPage.tsx  — updated to include all 4 upgrade type calculators
import { ExaltationForgeSimulator } from "@/components/ExaltationForgeSimulator";
import { TransferCalculator } from "@/components/ExaltationForgeSimulator/exaltation-transfer-simulator";
import { ConvergenceFusionCalculator } from "@/components/ExaltationForgeSimulator/exaltation-convergence-fusion-simulator";
import { ConvergenceTransferCalculator } from "@/components/ExaltationForgeSimulator/exaltation-convergence-transfer-simulator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

// ─── Tab metadata ─────────────────────────────────────────────
const TABS = [
  {
    value: "fusion",
    labelKey: "exaltationForge.tabs.fusion.label",
    badgeKey: "exaltationForge.tabs.fusion.badge",
    badgeClass: "bg-orange-500",
    descKey: "exaltationForge.tabs.fusion.description",
  },
  {
    value: "convergence-fusion",
    labelKey: "exaltationForge.tabs.convergenceFusion.label",
    badgeKey: "exaltationForge.tabs.convergenceFusion.badge",
    badgeClass: "bg-emerald-600",
    descKey: "exaltationForge.tabs.convergenceFusion.description",
  },
  {
    value: "transfer",
    labelKey: "exaltationForge.tabs.transfer.label",
    badgeKey: "exaltationForge.tabs.transfer.badge",
    badgeClass: "bg-emerald-600",
    descKey: "exaltationForge.tabs.transfer.description",
  },
  {
    value: "convergence-transfer",
    labelKey: "exaltationForge.tabs.convergenceTransfer.label",
    badgeKey: "exaltationForge.tabs.convergenceTransfer.badge",
    badgeClass: "bg-emerald-600",
    descKey: "exaltationForge.tabs.convergenceTransfer.description",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────
const ExaltationPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`exaltationForge.${entry}`);

  return (
    <Card className="my-12 w-full max-w-5xl bg-white dark:bg-card">
      <CardHeader>
        <CardTitle>{translate("title")}</CardTitle>
        <CardDescription>{translate("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="fusion" className="w-full">
          {/* ── Tab bar ──────────────────────────────────────── */}
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-sky-100/60 p-1 dark:bg-sky-950/30">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-blue-900 data-[state=active]:text-white md:text-sm"
              >
                {t(tab.labelKey)}
                <span
                  className={`rounded px-1 py-0.5 text-[10px] font-bold text-white ${tab.badgeClass}`}
                >
                  {t(tab.badgeKey)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Tab descriptions ─────────────────────────────── */}
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t(tab.descKey)}
              </p>

              {tab.value === "fusion" && <ExaltationForgeSimulator />}
              {tab.value === "convergence-fusion" && <ConvergenceFusionCalculator />}
              {tab.value === "transfer" && <TransferCalculator />}
              {tab.value === "convergence-transfer" && <ConvergenceTransferCalculator />}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExaltationPage;