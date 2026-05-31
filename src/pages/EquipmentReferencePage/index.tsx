import { EquipmentReference } from '@/components/EquipmentReference';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const EquipmentReferencePage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`equipmentReference.${entry}`);
  return (
    <Card className='w-full max-w-4xl mx-auto mt-6'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <EquipmentReference />
    </Card>
  );
};

export default EquipmentReferencePage;
