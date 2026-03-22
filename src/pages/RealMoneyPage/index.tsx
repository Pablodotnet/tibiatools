import { RealMoneyCalculator } from "@/components/RealMoneyCalculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RealMoneyPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Real Money Spend Calculator</CardTitle>
        <CardDescription>
          Here you can calculate how much real money and Tibia Coins you would
          spend to get certain quantity of Tibia Gold
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RealMoneyCalculator />
      </CardContent>
    </Card>
  );
};

export default RealMoneyPage;
