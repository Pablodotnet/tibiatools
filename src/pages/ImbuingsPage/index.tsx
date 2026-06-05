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
    <Card className='w-full max-w-lg mx-auto mt-6'>
      <CardHeader>
        <CardTitle asChild><h1>{translate('title')}</h1></CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <ImbuingChecker />
    </Card>
  );
};

export default ImbuingsPage;
