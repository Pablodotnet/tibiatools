import { ImbueCostCalculator } from '@/components/ImbueCostCalculator';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ImbueCostCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`imbueCostCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <ImbueCostCalculator />
    </Card>
  );
};

export default ImbueCostCalculatorPage;
