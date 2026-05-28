import { CardContent } from "@/components/ui/card";
import { vocations, VocationsListItem } from "@/helpers";
import { Link } from "react-router-dom";

export const HuntingSpotsCard = () => {
  return (
    <CardContent>
      {vocations.map((vocation: VocationsListItem) => (
        <Link
          key={vocation.id}
          to={`/hunting-spots/${vocation.id}`}
          className="w-full flex items-center px-4 py-3 mb-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <img src={vocation.icon} alt="icon" className="w-10 h-10 mr-4" />
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {vocation.name}
            </h4>
          </div>
        </Link>
      ))}
    </CardContent>
  );
};
