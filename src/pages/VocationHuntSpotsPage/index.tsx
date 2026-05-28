import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { vocations } from '@/helpers';

const VocationHuntSpotsPage = () => {
  const { vocationId } = useParams();
  const { t } = useTranslation();
  const translate = (entry: string) => t(`vocationsHuntSpots.${entry}`);

  const vocation = vocations.find((v) => v.id === vocationId);

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>
          {translate('title')} {vocation?.name || vocationId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Hunting spots data coming soon for {vocation?.name || vocationId}.
        </p>
      </CardContent>
    </Card>
  );
};

export default VocationHuntSpotsPage;
