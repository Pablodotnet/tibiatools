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

type CalculationResult = {
  tibiaCoins: string;
  realMoney: string;
  goldToConvert: string;
};

const formSchema = z.object({
  priceFor250Tc: z.string().min(2, {
    message: "Price for 250 Tibia Coins must be at least 2 characters.",
  }),
  tibiaGoldForOneTc: z.string().min(2, {
    message: "Tibia gold for one Tibia Coin must be at least 2 characters.",
  }),
  goldToConvert: z.string().min(2, {
    message: "Gold to convert must be at least 2 characters.",
  }),
});

export function RealMoneyCalculator() {
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
      parseKkString(values.tibiaGoldForOneTc) * tibiaCoinsQuantity;
    const goldToConvertInKks = values.goldToConvert;
    const goldToConvert = parseKkString(values.goldToConvert);

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
        <p className="mb-2">
          <strong>
            To get {calculationResult?.goldToConvert} gold you would need:
          </strong>
        </p>
        <p className="mb-4">
          Tibia Coins: {calculationResult?.tibiaCoins} <br />
          Real Money: ${calculationResult?.realMoney}
        </p>
        <Button onClick={handleClear}>Go Back</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="priceFor250Tc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price for 250 Tibia Coins</FormLabel>
              <FormControl>
                <Input placeholder="200" {...field} />
              </FormControl>
              <FormDescription>
                The price in real money, default is $200 pesos MXN.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tibiaGoldForOneTc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tibia Gold for ONE Tibia Coin</FormLabel>
              <FormControl>
                <Input placeholder="10kk" {...field} />
              </FormControl>
              <FormDescription>
                The amount of Tibia Gold for ONE Tibia Coin, default is 40k gold.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goldToConvert"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gold to Convert</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount" {...field} />
              </FormControl>
              <FormDescription>
                Enter the amount of gold you want to convert, with format
                "10kk", for example.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-4">
          <Button type="submit">Calculate</Button>
          <Button type="button" onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
