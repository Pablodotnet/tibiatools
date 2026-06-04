import { ExpShareCalculator } from '@/components/ExpShareCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ExpShareCalculatorPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`expShareCalculator.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <h1 className="sr-only">{translate('title')}</h1>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpShareCalculator />
      </CardContent>
    </Card>
  );
};

export default ExpShareCalculatorPage;
