import { OfflineTrainingCalculator } from '@/components/OfflineTrainingCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const OfflineTrainingCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`offlineTraining.${entry}`);
  return (
    <Card className='w-full max-w-xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{translate('title')}</h1></CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <OfflineTrainingCalculator />
      </CardContent>
    </Card>
  );
};

export default OfflineTrainingCalculatorPage;
