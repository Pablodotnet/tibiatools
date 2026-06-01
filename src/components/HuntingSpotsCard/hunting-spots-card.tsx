import { CardContent } from "@/components/ui/card";
import { vocations, VocationsListItem } from "@/helpers";
import { Link } from "react-router-dom";

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200 dark:bg-amber-800 rounded-sm px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export const HuntingSpotsCard = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const filtered = searchTerm
    ? vocations.filter((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : vocations;

  return (
    <CardContent>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No vocations match your search.
        </p>
      ) : (
        filtered.map((vocation: VocationsListItem) => (
          <Link
            key={vocation.id}
            to={`/hunting-spots/${vocation.id}`}
            className="w-full flex items-center px-4 py-3 mb-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <img src={vocation.icon} alt={vocation.name} className="w-10 h-10 mr-4" />
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {highlightMatch(vocation.name, searchTerm)}
              </h4>
            </div>
          </Link>
        ))
      )}
    </CardContent>
  );
};
