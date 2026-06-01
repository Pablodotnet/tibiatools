import { TibiaLootSplit } from '@/components/TibiaLootSplit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const TibiaLootSplitPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`tibiaLootSplit.${entry}`);
  return (
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <TibiaLootSplit />
      </CardContent>
    </Card>
  );
};

export default TibiaLootSplitPage;
