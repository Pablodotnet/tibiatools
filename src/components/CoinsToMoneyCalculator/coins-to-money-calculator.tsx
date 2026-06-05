import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { parseKkString } from '@/helpers';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type CalculationResult = {
  tibiaCoins: string;
  realMoney: string;
};

export function CoinsToMoneyCalculator() {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`coinsToMoney.calculator.${entry}`);
  const translateErrors = (entry: string) => t(`errors.${entry}`);

  const formSchema = z.object({
    priceForOneTc: z.string().min(1, {
      message: translate('priceForOneTcMsg'),
    }),
    tibiaCoinsQuantity: z.string().min(1, {
      message: translate('tcQuantityMsg'),
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceForOneTc: '0.84',
      tibiaCoinsQuantity: '250',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const result = calculateMoney(values);
    if (result === null) {
      toast.error(translateErrors('invalidStringFormat'));
      return;
    }
    setCalculationResult(result);
    setFormSubmitted(true);
  };

  const calculateMoney = (values: z.infer<typeof formSchema>) => {
    const priceForOneTc = Number(values.priceForOneTc);
    const tibiaCoinsQuantity = parseKkString(values.tibiaCoinsQuantity);

    if (isNaN(tibiaCoinsQuantity)) {
      return null;
    }

    const realMoneyCalculation = priceForOneTc * tibiaCoinsQuantity;

    return {
      tibiaCoins: tibiaCoinsQuantity.toLocaleString(),
      realMoney: realMoneyCalculation.toLocaleString(),
    };
  };

  const handleClear = () => {
    setFormSubmitted(false);
    setCalculationResult(null);
    form.reset();
  };

  if (formSubmitted) {
    return (
      <div className="animate-in fade-in duration-300">
        <p className='mb-2'>
          <strong>
            {translate('toGet')} {calculationResult?.tibiaCoins} {translate('tcYouWould')}:
          </strong>
        </p>
        <p className='mb-4'>
          {translate('realMoney')}: ${calculationResult?.realMoney}
        </p>
        <Button onClick={handleClear}>{translate('goBack')}</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <FormField
          control={form.control}
          name='priceForOneTc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('priceForOneTc')}</FormLabel>
              <FormControl>
                <Input placeholder='0.84' {...field} />
              </FormControl>
              <FormDescription>
                {translate('priceForOneTcDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tibiaCoinsQuantity'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('tcQuantity')}</FormLabel>
              <FormControl>
                <Input placeholder='250' {...field} />
              </FormControl>
              <FormDescription>{translate('tcQuantityDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-4'>
          <Button type='submit'>{translate('calculate')}</Button>
          <Button type='button' onClick={handleClear} variant='outline'>
            {translate('clear')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
