import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code); // persist
  };

  return (
    <div className='flex gap-1'>
      {LANGUAGES.map(({ code, label }) => (
        <Button
          key={code}
          className='cursor-pointer'
          variant={i18n.language === code ? 'default' : 'ghost'}
          size='sm'
          onClick={() => handleChange(code)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
