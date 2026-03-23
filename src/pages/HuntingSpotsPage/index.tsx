import { HuntingSpotsCard } from "@/components/HuntingSpotsCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const HuntingSpotsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`huntingSpots.${entry}`);
  return (
    <Card className='w-[350px] bg-white dark:bg-card my-12'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <HuntingSpotsCard />
    </Card>
  );
};

export default HuntingSpotsPage;
