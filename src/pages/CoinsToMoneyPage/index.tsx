import { CoinsToMoneyCalculator } from '@/components/CoinsToMoneyCalculator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CoinsToMoneyPage = () => {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Tibia Coins to Real Money Calculator</CardTitle>
        <CardDescription>
          Here you can calculate how much real money would cost certain amount of Tibia Coins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CoinsToMoneyCalculator />
      </CardContent>
    </Card>
  );
};

export default CoinsToMoneyPage;
