import { OfflineTrainingCalculator } from '@/components/OfflineTrainingCalculator';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const OfflineTrainingCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`offlineTraining.${entry}`);
  return (
    <Card className='w-full max-w-xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <OfflineTrainingCalculator />
    </Card>
  );
};

export default OfflineTrainingCalculatorPage;
