import { ImbuingChecker } from "@/components/ImbuingChecker";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ImbuingsPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>What imbuements can I set to my item?</CardTitle>
        <CardDescription>
          Select your item from list and learn which imbuements it can have.
        </CardDescription>
      </CardHeader>
      <ImbuingChecker />
    </Card>
  );
};

export default ImbuingsPage;
