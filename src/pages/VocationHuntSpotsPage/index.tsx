import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

const VocationHuntSpotsPage = () => {
  const { vocationId } = useParams();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Find the best hunting spots for {vocationId}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default VocationHuntSpotsPage;
