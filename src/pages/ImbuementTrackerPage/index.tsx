import { ImbuementTracker } from '@/components/ImbuementTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ImbuementTrackerPage = () => {
  const { t } = useTranslation();
  const ti = (entry: string) => t(`imbuementTracker.${entry}`);
  return (
    <Card className='w-full max-w-xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{ti('title')}</CardTitle>
        <CardDescription>{ti('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ImbuementTracker />
      </CardContent>
    </Card>
  );
};

export default ImbuementTrackerPage;
