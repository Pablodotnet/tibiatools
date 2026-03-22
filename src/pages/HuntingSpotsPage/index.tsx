import { HuntingSpotsCard } from "@/components/HuntingSpotsCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HuntingSpotsPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          Where can I hunt at certain level? What set should I use?
        </CardTitle>
        <CardDescription>
          Here you can find hunting spots as well as recommendations of set to
          use there and which imbuements to use.
        </CardDescription>
      </CardHeader>
      <HuntingSpotsCard />
    </Card>
  );
};

export default HuntingSpotsPage;
