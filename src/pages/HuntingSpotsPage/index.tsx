import { HuntingSpotsCard } from "@/components/HuntingSpotsCard";
import { HuntingSpotsAddDialog } from "@/components/HuntingSpotsAddDialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const HuntingSpotsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`huntingSpots.${entry}`);
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
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
        <div className='px-6 pb-4'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Search vocation...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-8 h-9 text-sm'
            />
          </div>
        </div>
      <HuntingSpotsCard searchTerm={search} />
    </Card>
  );
};

export default HuntingSpotsPage;
