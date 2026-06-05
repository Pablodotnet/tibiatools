import { ImbueCostCalculator } from '@/components/ImbueCostCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ImbueCostCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`imbueCostCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{translate('title')}</h1></CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ImbueCostCalculator />
      </CardContent>
    </Card>
  );
};

export default ImbueCostCalculatorPage;
