import { BestiaryTracker } from '@/components/BestiaryTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BestiaryPage = () => {
  const { t } = useTranslation();
  const tb = (entry: string) => t(`bestiary.${entry}`);
  return (
    <Card className='w-full max-w-3xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{tb('title')}</h1></CardTitle>
        <CardDescription>{tb('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <BestiaryTracker />
      </CardContent>
    </Card>
  );
};

export default BestiaryPage;
