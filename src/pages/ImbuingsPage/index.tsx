import { ImbuingChecker } from "@/components/ImbuingChecker";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const ImbuingsPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`imbuings.${entry}`);

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <ImbuingChecker />
    </Card>
  );
};

export default ImbuingsPage;
