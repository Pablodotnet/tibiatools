import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { t } = useTranslation();

  const translate = (entry: string) => t(`auth.${entry}`);

  const toggleForms = () => {
    setShowRegisterForm((prev) => !prev);
  };

  return (
    <Card className='w-full max-w-md mx-auto mt-6'>
      <CardHeader>
        {!showRegisterForm ? (
          <>
            <CardTitle>{translate('login')}</CardTitle>
            <CardDescription>{translate('useEmailOrGoogle')}</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>{translate('register')}</CardTitle>
            <CardDescription>{translate('enterEmailPass')}</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {!showRegisterForm ? <LoginForm /> : <RegisterForm />}
      </CardContent>
      <CardFooter className='flex justify-end w-full'>
        {!showRegisterForm ? (
          <p>
            {translate('youDontHave')}{' '}
            <a
              className='cursor-pointer text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-ring rounded'
              onClick={toggleForms}
            >
              {translate('signUp')}
            </a>
          </p>
        ) : (
          <p>
            {translate('hasAccount')}{' '}
            <a
              className='cursor-pointer text-blue-500 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-ring rounded'
              onClick={toggleForms}
            >
              {translate('login')}
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthPage;
