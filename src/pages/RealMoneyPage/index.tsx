import { RealMoneyCalculator } from "@/components/RealMoneyCalculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const RealMoneyPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`realMoney.${entry}`);

  return (
    <Card className='w-full max-w-md mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RealMoneyCalculator />
      </CardContent>
    </Card>
  );
};

export default RealMoneyPage;
