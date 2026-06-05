import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <Card className='w-full max-w-md mx-auto mt-6 text-center'>
      <CardHeader>
        <CardTitle asChild><h1 className='text-6xl font-bold text-muted-foreground'>404</h1></CardTitle>
        <p className="sr-only">{t('notFound.title')}</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-muted-foreground'>{t('notFound.title')}</p>
        <Button asChild>
          <Link to='/'>{t('notFound.goHome')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotFoundPage;
