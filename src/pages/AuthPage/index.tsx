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

// Note: redirect logic is now handled by PublicRoute wrapper,
// so this page doesn't need to check auth status itself.

const AuthPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleForms = () => {
    setShowRegisterForm((prev) => !prev);
  };

  return (
    <Card className='w-[450px]'>
      <CardHeader>
        {!showRegisterForm ? (
          <>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Use email/password or choose Google.
            </CardDescription>
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
              className='cursor-pointer text-blue-500 underline'
              onClick={toggleForms}
            >
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a
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
};

export default AuthPage;
