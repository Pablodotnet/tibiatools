import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUserSessions } from '@/firebase/huntSessions';
import { useAuth } from '@/hooks/useAuth';
import { captureError } from '@/lib/monitoring';
import { toast } from 'sonner';
import { formatGp } from '@/helpers/exaltationForge';
import type { HuntSession } from '@/types/huntSession';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function formatRate(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function ChartSkeleton() {
  return <Skeleton className='h-64 w-full' />;
}

interface Filters {
  spotName: string;
  dateFrom: string;
  dateTo: string;
}

const MySessionsPage = () => {
  const { t } = useTranslation();
  const ts = useCallback((key: string) => t(`mySessions.${key}`), [t]);
  const { user } = useAuth();

  const [sessions, setSessions] = useState<HuntSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ spotName: '', dateFrom: '', dateTo: '' });

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUserSessions();
      setSessions(data);
    } catch (e) {
      captureError(e, { context: 'loadMySessions' });
      toast.error(ts('loadError'));
    } finally {
      setLoading(false);
    }
  }, [ts]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const filteredSessions = useMemo(() => {
    let result = sessions;
    if (filters.spotName) {
      const q = filters.spotName.toLowerCase();
      result = result.filter((s) => s.spotName.toLowerCase().includes(q));
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((s) => {
        const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt as unknown as string);
        return d >= from;
      });
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((s) => {
        const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt as unknown as string);
        return d <= to;
      });
    }
    return result;
  }, [sessions, filters]);

  const uniqueSpots = useMemo(() => {
    const names = new Set(sessions.map((s) => s.spotName));
    return Array.from(names).sort();
  }, [sessions]);

  const xpChartData = useMemo(() => {
    return filteredSessions
      .filter((s) => s.xpPerHour != null)
      .map((s) => ({
        name: s.spotName,
        xpPerHour: s.xpPerHour ?? 0,
        date: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : '',
      }));
  }, [filteredSessions]);

  const profitChartData = useMemo(() => {
    return filteredSessions
      .filter((s) => s.balance != null)
      .map((s) => ({
        name: s.spotName,
        balance: s.balance ?? 0,
        date: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : '',
      }));
  }, [filteredSessions]);

  const lootSuppliesChartData = useMemo(() => {
    return filteredSessions
      .filter((s) => s.loot != null || s.supplies != null)
      .map((s) => ({
        name: s.spotName,
        loot: s.loot ?? 0,
        supplies: s.supplies ?? 0,
        date: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : '',
      }));
  }, [filteredSessions]);

  if (!user) {
    return (
      <div className='w-full max-w-4xl mx-auto mt-6'>
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            {t('auth.loginRequired')}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto mt-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading'>{ts('title')}</h1>
        <p className='text-sm text-muted-foreground'>{ts('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>{ts('filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='space-y-1'>
              <Label htmlFor='ms-spot' className='text-xs text-muted-foreground'>{ts('spotFilter')}</Label>
              <Input
                id='ms-spot'
                list='spots-list'
                value={filters.spotName}
                onChange={(e) => setFilters((p) => ({ ...p, spotName: e.target.value }))}
                placeholder={ts('spotFilterPlaceholder')}
                className='h-8 text-xs'
              />
              <datalist id='spots-list'>
                {uniqueSpots.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div className='space-y-1'>
              <Label htmlFor='ms-date-from' className='text-xs text-muted-foreground'>{ts('dateFrom')}</Label>
              <Input
                id='ms-date-from'
                type='date'
                value={filters.dateFrom}
                onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
                className='h-8 text-xs'
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='ms-date-to' className='text-xs text-muted-foreground'>{ts('dateTo')}</Label>
              <Input
                id='ms-date-to'
                type='date'
                value={filters.dateTo}
                onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
                className='h-8 text-xs'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className='space-y-4'>
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center text-muted-foreground'>
            {ts('empty')}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>{ts('xpPerHourChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              {xpChartData.length > 0 ? (
                <div role='img' aria-label={ts('xpPerHourChart')}>
                  <ResponsiveContainer width='100%' height={256}>
                    <LineChart data={xpChartData}>
                      <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                      <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={formatRate} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatGp(Number(value) || 0)} />
                      <Legend />
                      <Line type='monotone' dataKey='xpPerHour' stroke='hsl(var(--primary))' strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>{ts('noData')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>{ts('profitChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              {profitChartData.length > 0 ? (
                <div role='img' aria-label={ts('profitChart')}>
                  <ResponsiveContainer width='100%' height={256}>
                    <BarChart data={profitChartData}>
                      <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                      <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={formatRate} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatGp(Number(value) || 0)} />
                      <Legend />
                      <Bar dataKey='balance' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>{ts('noData')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>{ts('lootSuppliesChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              {lootSuppliesChartData.length > 0 ? (
                <div role='img' aria-label={ts('lootSuppliesChart')}>
                  <ResponsiveContainer width='100%' height={256}>
                    <BarChart data={lootSuppliesChartData}>
                      <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                      <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={formatRate} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => formatGp(Number(value) || 0)} />
                      <Legend />
                      <Bar dataKey='loot' fill='hsl(var(--chart-1))' radius={[4, 4, 0, 0]} />
                      <Bar dataKey='supplies' fill='hsl(var(--chart-2))' radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>{ts('noData')}</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MySessionsPage;
