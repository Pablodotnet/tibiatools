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
import { FormEvent, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Email must have correct format.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: RootState) => state.auth);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const isAuthenticating = useMemo(() => status === 'checking', [status]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticating) {
      const { email, password } = form.getValues();
      dispatch(startLoginWithEmailPassword({ email, password }))
    }
  };

  const onGoogleSignIn = () => {
    dispatch(startGoogleSignIn());
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Enter your email...' {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your password...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-4'>
          <Button type='submit'>Log In</Button>
          <Button type='button' variant='outline' onClick={onGoogleSignIn}>
            Google
          </Button>
        </div>
      </form>
    </Form>
  );
}
