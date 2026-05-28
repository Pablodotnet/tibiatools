import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { vocations, huntingSpotsByVocation } from '@/helpers';
import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

const VocationHuntSpotsPage = () => {
  const { vocationId } = useParams();
  const { t } = useTranslation();
  const translate = (entry: string) => t(`huntingSpotsPage.${entry}`);

  const vocation = vocations.find((v) => v.id === vocationId);
  const spots = vocationId ? huntingSpotsByVocation[vocationId] : undefined;

  return (
    <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>
            {translate('title')} {vocation?.name || vocationId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!spots || spots.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {translate('comingSoon')} {vocation?.name || vocationId}.
            </p>
          ) : (
            <div className="space-y-3">
              {spots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} translate={translate} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function SpotCard({
  spot,
  translate,
}: {
  spot: { id: string; name: string; levelRange: [number, number]; location: string; expRaw: string; expBonus: string; loot: string; set: string; imbuements: string[]; notes: string };
  translate: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
      >
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold">{spot.name}</h4>
          <p className="text-xs text-muted-foreground">
            {translate('level')} {spot.levelRange[0]}–{spot.levelRange[1]} &middot; {spot.location}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t px-4 py-3 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground">{translate('expRaw')}:</span>{' '}
              <span className="tabular-nums">{spot.expRaw}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{translate('expBonus')}:</span>{' '}
              <span className="tabular-nums">{spot.expBonus}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{translate('loot')}:</span>{' '}
              <span className="tabular-nums">{spot.loot}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{translate('location')}:</span>{' '}
              {spot.location}
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">{translate('set')}:</span>{' '}
            {spot.set}
          </div>

          <div>
            <span className="text-muted-foreground">{translate('imbuements')}:</span>{' '}
            {spot.imbuements.join(', ')}
          </div>

          {spot.notes && (
            <p className="text-xs text-muted-foreground italic pt-1 border-t">
              {spot.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VocationHuntSpotsPage;
