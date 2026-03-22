import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const AuthPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const { status } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = status === 'authenticated';

  const toggleForms = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  if (isAuthenticated) {
    window.location.href = '/'
  }

  return (
    <Card className='w-[450px]'>
      <CardHeader>
        {!showRegisterForm ? (
          <>
            <CardTitle>Log In</CardTitle>
            <CardDescription>Use email/password or choose Google.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>Register</CardTitle>
            <CardDescription>Enter your email and password.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {!showRegisterForm ? <LoginForm /> : <RegisterForm />}
      </CardContent>
      <CardFooter className='flex justify-end w-full'>
        {!showRegisterForm ? (
          <p>
            You don't have an account?{' '}
            <a
              type='button'
              className='cursor-pointer text-blue-500 underline'
              onClick={toggleForms}
            >
              Sign In
            </a>
          </p>
        ) : (
          <p>
            You have an account?{' '}
            <a
              type='button'
              className='cursor-pointer text-blue-500 underline'
              onClick={toggleForms}
            >
              Log In
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

export default AuthPage;
