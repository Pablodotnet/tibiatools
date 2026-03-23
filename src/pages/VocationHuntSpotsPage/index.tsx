import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

const VocationHuntSpotsPage = () => {
  const { vocationId } = useParams();
  const { t } = useTranslation();
  const translate = (entry: string) => t(`vocationsHuntSpots.${entry}`);

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>{`${translate('title')} ${vocationId}`}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default VocationHuntSpotsPage;
