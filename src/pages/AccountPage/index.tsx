import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { startLogout } from '@/store/auth/thunks';
import { useTranslation } from 'react-i18next';

const AccountPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { displayName, email, photoURL, uid } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const translate = (entry: string) => t(`account.${entry}`);

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const handleLogout = () => {
    dispatch(startLogout());
  };

  return (
    <div className='w-full max-w-xl px-4'>
      <Card>
        <CardHeader className='flex flex-row items-center gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage
              src={photoURL ?? undefined}
              alt={displayName ?? 'User'}
            />
            <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className='text-2xl'>
              {displayName ?? 'Anonymous'}
            </CardTitle>
            <CardDescription>{email}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Separator />

          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {translate('userId')}
              </span>
              <span className='font-mono text-xs text-muted-foreground truncate max-w-[240px]'>
                {uid}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {translate('email')}
              </span>
              <span>{email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>
                {translate('displayName')}
              </span>
              <span>{displayName ?? '—'}</span>
            </div>
          </div>

          <Separator />

          <div className='flex justify-end pt-2'>
            <Button
              className='cursor-pointer'
              variant='destructive'
              onClick={handleLogout}
            >
              {translate('logout')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
