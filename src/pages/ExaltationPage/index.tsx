import { ExaltationForgeSimulator } from "@/components/ExaltationForgeSimulator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ExaltationPage = () => {
  return (
    <Card className="max-w-4xl w-full bg-white dark:bg-card">
      <CardHeader>
        <CardTitle>Exaltation Forge simulator</CardTitle>
        <CardDescription>
          Estimate fusion gold, Exalted Core usage, and item cost up to a target
          tier. Forge gold per classification matches Tibia Wiki (regular
          fusion).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExaltationForgeSimulator />
      </CardContent>
    </Card>
  );
};

export default ExaltationPage;
