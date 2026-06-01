import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { vocations } from '@/helpers';
import { type HuntingSpotData, formatRate, formatProfit, calculateHoursToNextLevel, formatHours, huntingSpotsByVocation } from '@/helpers/huntingSpots';
import { getAllHuntingSpots, deleteHuntingSpot } from '@/firebase/huntingSpots';
import { getSessionsForSpot, deleteHuntSession } from '@/firebase/huntSessions';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp, Calculator, Trash2, User, ListChecks, Search } from 'lucide-react';
import { HuntSessionUploadDialog } from '@/components/HuntSessionUploadDialog';
import { HuntSessionCard } from '@/components/HuntSessionDisplay';
import type { HuntSession } from '@/types/huntSession';

const VocationHuntSpotsPage = () => {
  const { vocationId } = useParams();
  const { t } = useTranslation();
  const translate = (entry: string) => t(`huntingSpotsPage.${entry}`);
  const { user } = useAuth();

  const vocation = vocations.find((v) => v.id === vocationId);
  const [userSpots, setUserSpots] = useState<HuntingSpotData[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'profit' | 'exp' | 'level'>('default');

  const loadSpots = useCallback(async () => {
    setLoadingSpots(true);
    try {
      const spots = await getAllHuntingSpots(vocationId);
      setUserSpots(spots);
    } catch {
      void 0;
    } finally {
      setLoadingSpots(false);
    }
  }, [vocationId]);

  useEffect(() => {
    loadSpots();
  }, [loadSpots]);

  const mergedSpots = useMemo(() => {
    if (!vocationId) return [];
    const builtIn = huntingSpotsByVocation[vocationId] ?? [];
    const builtInIds = new Set(builtIn.map((s) => s.id));
    const matchingUserSpots = userSpots.filter((s) => s.vocationId === vocationId && !builtInIds.has(s.id));
    let all = [...builtIn, ...matchingUserSpots];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      all = all.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (sortBy === 'profit') {
      all = [...all].sort((a, b) => b.profit - a.profit);
    } else if (sortBy === 'exp') {
      all = [...all].sort((a, b) => b.expBonus - a.expBonus);
    } else if (sortBy === 'level') {
      all = [...all].sort((a, b) => a.levelRange[0] - b.levelRange[0]);
    }
    return all;
  }, [vocationId, userSpots, searchTerm, sortBy]);

  const handleDelete = useCallback(async (spotId: string) => {
    try {
      await deleteHuntingSpot(spotId);
      setUserSpots((prev) => prev.filter((s) => s.id !== spotId));
      toast.success(translate('spotDeleted'));
    } catch (e) {
      console.error(e);
      toast.error(translate('deleteSpotError'));
    }
  }, [translate]);

  return (
    <div className='w-full max-w-2xl mx-auto mt-6 space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>
            {translate('title')} {vocation?.name || vocationId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSpots ? (
            <p className="text-muted-foreground text-center py-8">{translate('loading')}</p>
          ) : mergedSpots.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {translate('comingSoon')} {vocation?.name || vocationId}.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder={translate('searchSpots')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="default">{translate('sortDefault')}</option>
                  <option value="profit">{translate('sortProfit')}</option>
                  <option value="exp">{translate('sortExp')}</option>
                  <option value="level">{translate('sortLevel')}</option>
                </select>
              </div>
              {mergedSpots.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  {translate('noSpotsMatch')}
                </p>
              ) : (
                mergedSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    translate={translate}
                    isOwner={spot.ownerUid === user.uid}
                    onDelete={handleDelete}
                    userId={user.uid}
                  />
                ))
              )}
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
  isOwner,
  onDelete,
  userId,
}: {
  spot: HuntingSpotData;
  translate: (key: string) => string;
  isOwner: boolean;
  onDelete: (id: string) => void;
  userId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcLevel, setCalcLevel] = useState('');
  const [calcPercent, setCalcPercent] = useState('0');
  const [customSupplyCost, setCustomSupplyCost] = useState('');

  const [sessions, setSessions] = useState<HuntSession[]>([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const loadingRef = useRef(false);

  const loadSessions = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setSessionsLoading(true);
    try {
      const data = await getSessionsForSpot(spot.id);
      setSessions(data);
      setSessionsLoaded(true);
    } catch {
      void 0;
    } finally {
      setSessionsLoading(false);
      loadingRef.current = false;
    }
  }, [spot.id]);

  useEffect(() => {
    if (expanded && !sessionsLoaded) {
      loadSessions();
    }
  }, [expanded, sessionsLoaded, loadSessions]);

  const handleSessionDelete = useCallback(async (sessionId: string) => {
    try {
      await deleteHuntSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success(translate('sessionDeleted'));
    } catch (e) {
      console.error(e);
      toast.error(translate('deleteSessionError'));
    }
  }, [translate]);

  const handleSessionAdded = useCallback(() => {
    setSessionsLoaded(false);
    setSessions([]);
  }, []);

  const sessionStats = useMemo(() => {
    if (sessions.length === 0) return null;
    const count = sessions.length;
    const avgXpPerHour = Math.round(sessions.reduce((s, x) => s + (x.xpPerHour ?? 0), 0) / count);
    const avgBalance = Math.round(sessions.reduce((s, x) => s + (x.balance ?? 0), 0) / count);
    const avgDuration = Math.round(sessions.reduce((s, x) => s + (x.durationMinutes ?? 0), 0) / count);
    const bestXpPerHour = Math.max(...sessions.map((x) => x.xpPerHour ?? 0));
    const bestBalance = Math.max(...sessions.map((x) => x.balance ?? 0));
    return { count, avgXpPerHour, avgBalance, avgDuration, bestXpPerHour, bestBalance };
  }, [sessions]);

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
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{spot.name}</h4>
            {spot.ownerDisplayName && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                <User className="size-2.5" />
                {spot.ownerDisplayName}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {translate('level')} {spot.levelRange[0]}–{spot.levelRange[1]} &middot; {spot.location}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(spot.id); }}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              title={translate('deleteSpot')}
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
          {expanded ? (
            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          )}
        </div>
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

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <ListChecks className="size-3" />
                {translate('huntSessions')}
                {sessions.length > 0 && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm">{sessions.length}</span>
                )}
              </p>
              <HuntSessionUploadDialog
                spotId={spot.id}
                spotName={spot.name}
                onSubmit={handleSessionAdded}
              />
            </div>

            {sessionStats && (
              <div className="grid grid-cols-3 gap-2 text-[10px] bg-muted/40 rounded-md p-2">
                <div>
                  <span className="text-muted-foreground">{translate('avgXpPerHour')}</span>
                  <p className="font-medium tabular-nums">{formatRate(sessionStats.avgXpPerHour)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{translate('avgProfit')}</span>
                  <p className={`font-medium tabular-nums ${sessionStats.avgBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {formatProfit(sessionStats.avgBalance)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">{translate('avgDuration')}</span>
                  <p className="font-medium tabular-nums">{formatHours(sessionStats.avgDuration / 60)}</p>
                </div>
              </div>
            )}

            {sessionsLoading && (
              <p className="text-xs text-muted-foreground text-center py-2">{translate('loadingSessions')}</p>
            )}

            {!sessionsLoading && sessions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">{translate('noSessions')}</p>
            )}

            <div className="space-y-1.5">
              {sessions.map((session) => (
                <HuntSessionCard
                  key={session.id}
                  session={session}
                  isOwner={!!userId && session.ownerUid === userId}
                  onDelete={handleSessionDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VocationHuntSpotsPage;
