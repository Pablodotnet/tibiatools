import { CoinsToMoneyCalculator } from '@/components/CoinsToMoneyCalculator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const CoinsToMoneyPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`coinsToMoney.${entry}`);

  return (
    <Card className='w-full max-w-md mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{translate('title')}</h1></CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <CoinsToMoneyCalculator />
      </CardContent>
    </Card>
  );
};

export default CoinsToMoneyPage;
