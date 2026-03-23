import { ExaltationForgeSimulator } from "@/components/ExaltationForgeSimulator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const ExaltationPage = () => {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`exaltationForge.${entry}`);
  return (
    <Card className='max-w-4xl w-full bg-white dark:bg-card my-12'>
      <CardHeader>
        <CardTitle>{translate('title')}</CardTitle>
        <CardDescription>{translate('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ExaltationForgeSimulator />
      </CardContent>
    </Card>
  );
};

export default ExaltationPage;
