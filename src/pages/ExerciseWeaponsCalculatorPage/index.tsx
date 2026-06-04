import { ExerciseWeaponsCalculator } from '@/components/ExerciseWeaponsCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ExerciseWeaponsCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`exerciseWeapons.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <h1 className="sr-only">{translate('title')}</h1>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ExerciseWeaponsCalculator />
      </CardContent>
    </Card>
  );
};

export default ExerciseWeaponsCalculatorPage;
