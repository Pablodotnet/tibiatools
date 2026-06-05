import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { startGoogleSignIn, startLoginWithEmailPassword } from '@/store/auth/thunks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { status, errorMessage } = useAppSelector((state: RootState) => state.auth);
  const formSchema = useMemo(() => z.object({
    email: z.string().email(t('auth.emailFormat')),
    password: z.string().min(6, t('auth.passwordMin')),
  }), [t]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const isAuthenticating = useMemo(() => status === 'checking', [status]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const onSubmit = (data: FormData) => {
    if (!isAuthenticating) {
      dispatch(startLoginWithEmailPassword({ email: data.email, password: data.password }));
    }
  };

  const onGoogleSignIn = () => {
    dispatch(startGoogleSignIn());
  };

  const translate = (entry: string) => t(`auth.${entry}`);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('email')}</FormLabel>
              <FormControl>
                <Input placeholder={translate('emailPlaceholder')} autoComplete='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('password')}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder={translate('passwordPlaceholder')}
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-4'>
          <Button type='submit' disabled={isAuthenticating}>
            {isAuthenticating ? <Loader2 className='size-4 animate-spin' /> : null}
            {translate('login')}
          </Button>
          <Button type='button' variant='outline' onClick={onGoogleSignIn} disabled={isAuthenticating}>
            {isAuthenticating ? <Loader2 className='size-4 animate-spin' /> : <LogIn className='size-4' />}
            {translate('googleButton')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
