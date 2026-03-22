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

type CalculationResult = {
  tibiaCoins: string;
  realMoney: string;
};

const formSchema = z.object({
  priceForOneTc: z.string().min(1, {
    message: 'Price for One Tibia Coin must be at least 1 character.',
  }),
  tibiaCoinsQuantity: z.string().min(1, {
    message: 'Tibia Coins Quantity must be at least 1 character.',
  }),
});

export function CoinsToMoneyCalculator() {
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceForOneTc: '0.84',
      tibiaCoinsQuantity: '250',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const result = calculateMoney(values);
    setCalculationResult(result);
    setFormSubmitted(true);
  };

  const calculateMoney = (values: z.infer<typeof formSchema>) => {
    const priceForOneTc = Number(values.priceForOneTc);
    const tibiaCoinsQuantity = parseKkString(values.tibiaCoinsQuantity);

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
      <div>
        <p className='mb-2'>
          <strong>
            To get {calculationResult?.tibiaCoins} Tibia Coins you would need:
          </strong>
        </p>
        <p className='mb-4'>
          Real Money: ${calculationResult?.realMoney}
        </p>
        <Button onClick={handleClear}>Go Back</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='priceForOneTc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price for One Tibia Coin</FormLabel>
              <FormControl>
                <Input placeholder='0.84' {...field} />
              </FormControl>
              <FormDescription>
                The price in real money, default is $0.84 pesos MXN.
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
              <FormLabel>Tibia Coins Quantity</FormLabel>
              <FormControl>
                <Input placeholder='250' {...field} />
              </FormControl>
              <FormDescription>
                The amount of Tibia Coins you want to convert, default is 250.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='space-x-4'>
          <Button type='submit'>Calculate</Button>
          <Button type='button' onClick={handleClear} variant='outline'>
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
