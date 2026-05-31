import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { vocations, huntingSpotsByVocation } from '@/helpers';
import { type HuntingSpotData, formatRate, formatProfit, calculateHoursToNextLevel, formatHours } from '@/helpers/huntingSpots';
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';

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
  spot: HuntingSpotData;
  translate: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcLevel, setCalcLevel] = useState('');
  const [calcPercent, setCalcPercent] = useState('0');
  const [customSupplyCost, setCustomSupplyCost] = useState('');

  const supplyCost = customSupplyCost !== '' ? (parseInt(customSupplyCost, 10) || 0) : spot.supplyCost;
  const netProfit = spot.profit - (supplyCost - spot.supplyCost);

  const timeToNext = useMemo(() => {
    const lvl = parseInt(calcLevel, 10);
    const pct = Math.min(Math.max(parseFloat(calcPercent) || 0, 0), 99);
    if (isNaN(lvl) || lvl < 1) return null;
    return calculateHoursToNextLevel(lvl, pct, spot.expBonus);
  }, [calcLevel, calcPercent, spot.expBonus]);

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
              <span className="tabular-nums font-medium">{formatRate(spot.expRaw)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{translate('expBonus')}:</span>{' '}
              <span className="tabular-nums font-medium">{formatRate(spot.expBonus)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{translate('profit')}:</span>{' '}
              <span className={`tabular-nums font-medium ${spot.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                {formatProfit(spot.profit)}
              </span>
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

          <button
            onClick={(e) => { e.stopPropagation(); setShowCalc(!showCalc); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Calculator className="size-3.5" />
            {showCalc ? translate('hideCalc') : translate('showCalc')}
          </button>

          {showCalc && (
            <div className="rounded-md border bg-muted/30 p-3 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">{translate('calculator')}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{translate('yourLevel')}</label>
                  <Input
                    type="number"
                    value={calcLevel}
                    onChange={(e) => setCalcLevel(e.target.value)}
                    min={1}
                    placeholder={String(spot.levelRange[0])}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{translate('percent')}</label>
                  <Input
                    type="number"
                    value={calcPercent}
                    onChange={(e) => setCalcPercent(e.target.value)}
                    min={0}
                    max={99}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">{translate('supplyCost')}</label>
                  <Input
                    type="number"
                    value={customSupplyCost}
                    onChange={(e) => setCustomSupplyCost(e.target.value)}
                    min={0}
                    placeholder={String(spot.supplyCost)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">{translate('netProfit')}:</span>{' '}
                  <span className={netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                    {formatProfit(netProfit)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{translate('supplyCost')}:</span>{' '}
                  <span className="tabular-nums">{formatProfit(supplyCost)}</span>
                </div>
                {timeToNext !== null && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{translate('timeToNext')}:</span>{' '}
                    <span className="font-medium">{formatHours(timeToNext)}</span>
                  </div>
                )}
              </div>

              {calcLevel && isNaN(parseInt(calcLevel, 10)) === false && timeToNext === null && (
                <p className="text-xs text-destructive">{translate('invalidLevel')}</p>
              )}
            </div>
          )}

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
