import { LevelCalculator } from '@/components/LevelCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const LevelCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`levelCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{translate('title')}</h1></CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <LevelCalculator />
      </CardContent>
    </Card>
  );
};

export default LevelCalculatorPage;
