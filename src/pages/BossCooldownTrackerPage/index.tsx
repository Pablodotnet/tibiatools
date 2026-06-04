import { BossCooldownTracker } from '@/components/BossCooldownTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BossCooldownTrackerPage = () => {
  const { t } = useTranslation();
  const tb = (entry: string) => t(`bossCooldownTracker.${entry}`);
  return (
    <Card className='w-full max-w-3xl mx-auto mt-6'>
      <CardHeader>
        <h1 className="sr-only">{tb('title')}</h1>
        <CardTitle>{tb('title')}</CardTitle>
        <CardDescription>{tb('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <BossCooldownTracker />
      </CardContent>
    </Card>
  );
};

export default BossCooldownTrackerPage;
