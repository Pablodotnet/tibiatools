import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { vocations, VocationsListItem } from "@/helpers";
import { Link } from "react-router-dom";

export const HuntingSpotsCard = () => {
  return (
    <>
      <CardContent>
        {vocations.map((vocation: VocationsListItem) => (
          <Card key={vocation.id} className="px-4 mb-4">
            <Link
              to={`/hunting-spots/${vocation.id}`}
              className="w-full flex items-center"
            >
              <img src={vocation.icon} alt="icon" className="w-10 h-10 mr-4" />
              <div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {vocation.name}
                </h4>
              </div>
            </Link>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </>
  );
};
