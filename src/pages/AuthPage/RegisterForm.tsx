import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { startCreatingUserWithEmailPassword } from '@/store/auth/thunks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Email must have correct format.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { status, errorMessage } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const isAuthenticating = useMemo(() => status === 'checking', [status]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    if (isAuthenticating) return;
    dispatch(
      startCreatingUserWithEmailPassword({
        displayName: data.name,
        email: data.email,
        password: data.password,
      }),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your name...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        {/* Show Firebase error if registration fails */}
        {errorMessage && (
          <p className='text-sm text-destructive'>{errorMessage}</p>
        )}

        <div className='flex justify-end space-x-4'>
          <Button type='submit' disabled={isAuthenticating}>
            {isAuthenticating ? 'Creating account...' : 'Register'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
