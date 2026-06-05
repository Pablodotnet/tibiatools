// ExaltationPage.tsx  — updated to include all 4 upgrade type calculators
import { lazy, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

const ExaltationForgeSimulator = lazy(() =>
  import("@/components/ExaltationForgeSimulator").then((m) => ({ default: m.ExaltationForgeSimulator })),
);
const TransferCalculator = lazy(() =>
  import("@/components/ExaltationForgeSimulator/exaltation-transfer-simulator").then((m) => ({ default: m.TransferCalculator })),
);
const ConvergenceFusionCalculator = lazy(() =>
  import("@/components/ExaltationForgeSimulator/exaltation-convergence-fusion-simulator").then((m) => ({ default: m.ConvergenceFusionCalculator })),
);
const ConvergenceTransferCalculator = lazy(() =>
  import("@/components/ExaltationForgeSimulator/exaltation-convergence-transfer-simulator").then((m) => ({ default: m.ConvergenceTransferCalculator })),
);

// ─── Tab metadata ─────────────────────────────────────────────
const TABS = [
  {
    value: "fusion",
    labelKey: "exaltationForge.tabs.fusion.label",
    badgeKey: "exaltationForge.tabs.fusion.badge",
    badgeClass: "bg-warning",
    descKey: "exaltationForge.tabs.fusion.description",
  },
  {
    value: "convergence-fusion",
    labelKey: "exaltationForge.tabs.convergenceFusion.label",
    badgeKey: "exaltationForge.tabs.convergenceFusion.badge",
    badgeClass: "bg-success",
    descKey: "exaltationForge.tabs.convergenceFusion.description",
  },
  {
    value: "transfer",
    labelKey: "exaltationForge.tabs.transfer.label",
    badgeKey: "exaltationForge.tabs.transfer.badge",
    badgeClass: "bg-success",
    descKey: "exaltationForge.tabs.transfer.description",
  },
  {
    value: "convergence-transfer",
    labelKey: "exaltationForge.tabs.convergenceTransfer.label",
    badgeKey: "exaltationForge.tabs.convergenceTransfer.badge",
    badgeClass: "bg-success",
    descKey: "exaltationForge.tabs.convergenceTransfer.description",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────
const ExaltationPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`exaltationForge.${entry}`);

  return (
    <Card className="my-12 w-full max-w-5xl bg-card">
      <CardHeader>
        <CardTitle asChild><h1>{translate("title")}</h1></CardTitle>
        <CardDescription>{translate("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="fusion" className="w-full">
          {/* ── Tab bar ──────────────────────────────────────── */}
          <TabsList className="mb-6 flex h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-sm"
              >
                {t(tab.labelKey)}
                <Badge
                  className={`rounded px-1 py-0.5 text-[10px] font-bold text-primary-foreground ${tab.badgeClass}`}
                >
                  {t(tab.badgeKey)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Tab descriptions ─────────────────────────────── */}
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="flex flex-col gap-5">
              <p className="text-sm text-muted-foreground">
                {t(tab.descKey)}
              </p>
              <Suspense fallback={null}>
                {tab.value === "fusion" && <ExaltationForgeSimulator />}
                {tab.value === "convergence-fusion" && <ConvergenceFusionCalculator />}
                {tab.value === "transfer" && <TransferCalculator />}
                {tab.value === "convergence-transfer" && <ConvergenceTransferCalculator />}
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExaltationPage;