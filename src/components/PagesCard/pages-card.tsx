import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PageListItem, pagesList } from "./pages-list";
import { useTranslation } from 'react-i18next';

export function PagesCard() {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`pagesCard.${entry}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {pagesList.map((page: PageListItem) => (
          <Card key={page.url} className='px-4 mb-4'>
            <Link to={page.url} className='w-full flex items-center'>
              <img src={page.icon} alt='icon' className='w-10 h-10 mr-4' />
              <div>
                <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
                  {translate(page.title)}
                </h4>
                <small className='text-sm font-medium leading-none'>
                  {translate(page.description)}
                </small>
              </div>
            </Link>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
