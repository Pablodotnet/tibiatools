import { useTranslation } from 'react-i18next';
import { CharacterManager } from '@/components/CharacterManager';

const CharacterPage = () => {
  const { t } = useTranslation();
  const tc = (key: string) => t(`characters.${key}`);

  return (
    <div className='w-full max-w-2xl mx-auto mt-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>{tc('title')}</h1>
        <p className='text-sm text-muted-foreground'>{tc('description')}</p>
      </div>
      <CharacterManager />
    </div>
  );
};

export default CharacterPage;
