import { BlessCalculator } from '@/components/BlessCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BlessCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`blessCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <BlessCalculator />
      </CardContent>
    </Card>
  );
};

export default BlessCalculatorPage;
