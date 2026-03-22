import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PageListItem, pagesList } from "./pages-list";

export function PagesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilities</CardTitle>
        <CardDescription>
          Useful or not so useful tools, just for practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pagesList.map((page: PageListItem) => (
          <Card key={page.url} className="px-4 mb-4">
            <Link to={page.url} className="w-full flex items-center">
              <img src={page.icon} alt="icon" className="w-10 h-10 mr-4" />
              <div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {page.title}
                </h4>
                <small className="text-sm font-medium leading-none">
                  {page.description}
                </small>
              </div>
            </Link>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
