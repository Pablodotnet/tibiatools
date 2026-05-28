import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotFoundPage = () => {
  return (
    <Card className='w-full max-w-md mx-auto mt-6 text-center'>
      <CardHeader>
        <CardTitle className='text-6xl font-bold text-muted-foreground'>404</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-muted-foreground'>Page not found</p>
        <Button asChild>
          <Link to='/'>Go Home</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotFoundPage;
