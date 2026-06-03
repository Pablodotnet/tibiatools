import { StaminaCalculator } from '@/components/StaminaCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const StaminaCalculatorPage = () => {
  const { t } = useTranslation();
  const ts = (entry: string) => t(`staminaCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{ts('title')}</CardTitle>
        <CardDescription>{ts('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <StaminaCalculator />
      </CardContent>
    </Card>
  );
};

export default StaminaCalculatorPage;
