import { HuntingSpotsCard } from "@/components/HuntingSpotsCard";
import { HuntingSpotsAddDialog } from "@/components/HuntingSpotsAddDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';

const HuntingSpotsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`huntingSpots.${entry}`);
  const { isAuthenticated } = useAuth();
  return (
    <Card className='w-full max-w-md mx-auto bg-white dark:bg-card my-12'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>{translate('title')}</CardTitle>
            <CardDescription>{translate('description')}</CardDescription>
          </div>
          {isAuthenticated && <HuntingSpotsAddDialog />}
        </div>
      </CardHeader>
      <HuntingSpotsCard />
    </Card>
  );
};

export default HuntingSpotsPage;
