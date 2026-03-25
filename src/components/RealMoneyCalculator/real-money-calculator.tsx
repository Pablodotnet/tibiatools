import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { parseKkString } from '@/helpers';
import { useTranslation } from 'react-i18next';

type CalculationResult = {
  tibiaCoins: string;
  realMoney: string;
  goldToConvert: string;
};

export function RealMoneyCalculator() {
  const { t } = useTranslation();
  const translate = (entry: string) => t(`realMoney.calculator.${entry}`);
  const translateErrors = (entry: string) => t(`errors.${entry}`);

  const formSchema = z.object({
    priceFor250Tc: z.string().min(2, {
      message: translate('priceFor250TcMsg'),
    }),
    tibiaGoldForOneTc: z.string().min(2, {
      message: translate('tibiaGoldForOneTcMsg'),
    }),
    goldToConvert: z.string().min(2, {
      message: translate('goldToConvertMsg'),
    }),
  });

  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceFor250Tc: "200",
      tibiaGoldForOneTc: "40k",
      goldToConvert: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const result = calculateTibiaGold(values);
    setCalculationResult(result);
    setFormSubmitted(true);
  };

  const calculateTibiaGold = (values: z.infer<typeof formSchema>) => {
    const priceFor250 = Number(values.priceFor250Tc);
    const tibiaCoinsQuantity = 250;
    const tibiaGoldFor250 =
      parseKkString(values.tibiaGoldForOneTc, translateErrors('invalidStringFormat')) *
      tibiaCoinsQuantity;
    const goldToConvertInKks = values.goldToConvert;
    const goldToConvert = parseKkString(
      values.goldToConvert,
      translateErrors('invalidStringFormat'),
    );

    const tibiaCoinsCalculation =
      (goldToConvert / tibiaGoldFor250) * tibiaCoinsQuantity;

    const realMoneyCalculation =
      (tibiaCoinsCalculation / tibiaCoinsQuantity) * priceFor250;

    return {
      tibiaCoins: tibiaCoinsCalculation.toLocaleString(),
      realMoney: realMoneyCalculation.toLocaleString(),
      goldToConvert: goldToConvertInKks,
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
            {translate('toGet')} {calculationResult?.goldToConvert}{' '}
            {translate('goldYouWould')}:
          </strong>
        </p>
        <p className='mb-4'>
          {translate('tibiaCoins')}: {calculationResult?.tibiaCoins} <br />
          {translate('realMoney')}: ${calculationResult?.realMoney}
        </p>
        <Button onClick={handleClear}>{translate('goBack')}</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='priceFor250Tc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('priceFor250Tc')}</FormLabel>
              <FormControl>
                <Input placeholder='200' {...field} />
              </FormControl>
              <FormDescription>
                {translate('priceFor250TcDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tibiaGoldForOneTc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('tibiaGoldForOneTc')}</FormLabel>
              <FormControl>
                <Input placeholder='10kk' {...field} />
              </FormControl>
              <FormDescription>
                {translate('tibiaGoldForOneTcDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='goldToConvert'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate('goldToConvert')}</FormLabel>
              <FormControl>
                <Input placeholder='Enter amount' {...field} />
              </FormControl>
              <FormDescription>
                {translate('goldToConvertDesc')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='space-x-4'>
          <Button type='submit'>{translate('calculate')}</Button>
          <Button type='button' onClick={handleClear} variant='outline'>
            {translate('clear')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
