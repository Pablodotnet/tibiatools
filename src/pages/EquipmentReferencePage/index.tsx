import { EquipmentReference } from '@/components/EquipmentReference';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const EquipmentReferencePage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`equipmentReference.${entry}`);
  return (
    <Card className='w-full max-w-4xl mx-auto mt-6'>
      <CardHeader>
        <h1 className="sr-only">{translate('title')}</h1>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <EquipmentReference />
      </CardContent>
    </Card>
  );
};

export default EquipmentReferencePage;
