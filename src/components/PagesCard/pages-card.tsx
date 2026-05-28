import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { getPagesList, PageListItem } from './pages-list';
import { useTranslation } from 'react-i18next';

interface PagesCardProps {
  isLoggedIn: boolean;
}

export function PagesCard({ isLoggedIn }: PagesCardProps) {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`pagesCard.${entry}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'>
          {getPagesList(isLoggedIn).map((page: PageListItem) => (
            <Link key={page.url} to={page.url} className='block'>
              <div
                className='
                  rounded-xl border bg-card text-card-foreground shadow-sm
                  p-6 h-full
                  flex flex-col items-center text-center
                  transition-all duration-200
                  hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
                  cursor-pointer
                '
              >
                <img src={page.icon} alt={translate(page.title)} className='w-12 h-12 mb-4' />

                <h4 className='text-lg font-semibold mb-1'>
                  {translate(page.title)}
                </h4>

                <p className='text-sm text-muted-foreground'>
                  {translate(page.description)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
