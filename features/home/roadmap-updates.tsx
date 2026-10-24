'use client';

import { ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { RoadmapResponse } from '@/features/home/roadmap-data';

const emptyData: RoadmapResponse = { items: [], sourceName: 'Microsoft 365 Roadmap', sourceUrl: '', refreshedAt: 0 };
const statusOptions = ['In development', 'Rolling out', 'Launched'];
const productOptions = [
  {
    label: 'Dynamics 365 Customer Insights',
    categories: [
      'Dynamics 365 Customer Insights',
      'Dynamics 365 Customer Insights - Data',
      'Dynamics 365 Customer Insights - Journeys',
    ],
  },
];

function displayDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(timestamp));
}

export function RoadmapUpdates({ initialData }: { initialData: RoadmapResponse | null }) {
  const [data, setData] = useState<RoadmapResponse>(initialData ?? emptyData);
  const [status, setStatus] = useState('');
  const [products, setProducts] = useState<string[]>(productOptions.map((product) => product.label));
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState('');

  const load = async () => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/m365-roadmap');
      const payload = await response.json() as RoadmapResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'The roadmap could not be loaded.');
      setData(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'The roadmap could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) return;
    void load();
  }, [initialData]);

  const visibleItems = useMemo(
    () => data.items
      .filter((item) => !status || item.status === status)
      .filter((item) => productOptions.some((product) => products.includes(product.label)
        && item.categories.some((category) => product.categories.includes(category))))
      .slice(0, 3),
    [data.items, status, products],
  );
  const productFilterLabel = products.length === 0 ? 'No products' : 'Customer Insights';

  return (
    <section aria-labelledby="roadmap-section-heading" className="border-b">
      <CardHeader className="px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <h3 id="roadmap-section-heading" className="font-heading text-base leading-5 font-medium"><span className="sm:hidden">Roadmap</span><span className="hidden sm:inline">Microsoft 365 roadmap</span></h3>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw data-icon="inline-start" className={loading ? 'animate-spin' : undefined} />Refresh</Button>
      </CardHeader>

      <div className="grid gap-4 px-4 pb-4">
        <div className="relative flex flex-wrap items-center gap-4">
          <label className="sr-only" htmlFor="roadmap-status">Filter roadmap updates</label>
          <select id="roadmap-status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-8 min-w-36 rounded-[10px] border border-input bg-background px-3 text-[13px] leading-4 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">All statuses</option>
            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <details className="group">
            <summary className="flex h-8 cursor-pointer list-none items-center rounded-[10px] border border-input bg-background px-3 text-[13px] leading-4 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
              {productFilterLabel}
            </summary>
            <div className="absolute left-0 z-20 mt-1 grid w-full max-w-[24rem] grid-cols-1 gap-x-4 gap-y-1 rounded-xl border bg-white p-3 text-neutral-900 shadow-lg dark:bg-neutral-900 dark:text-neutral-100">
              {productOptions.map((product, index) => (
                <label key={product.label} htmlFor={`roadmap-product-${index}`} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2 text-sm hover:bg-accent">
                  <input
                    id={`roadmap-product-${index}`}
                    type="checkbox"
                    aria-label={product.label}
                    checked={products.includes(product.label)}
                    onChange={() => setProducts((current) => current.includes(product.label)
                      ? current.filter((item) => item !== product.label)
                      : [...current, product.label])}
                    className="size-4 accent-primary"
                  />
                  <span>{product.label}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
        {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">{error}</div>}
        {loading && <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">Refreshing the Microsoft 365 roadmap…</div>}
        {!loading && !error && visibleItems.length === 0 && <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">No roadmap updates match this filter.</div>}
        {!loading && !error && visibleItems.length > 0 && <div className="grid gap-4 md:grid-cols-3">
          {visibleItems.map((item) => <Card key={item.id} size="sm" className="h-full bg-background/45 transition-colors hover:bg-muted/40"><CardContent className="flex h-full flex-col gap-4 p-4"><a href={item.url} target="_blank" rel="noreferrer" className="group flex flex-1 flex-col gap-2"><h3 className="text-base font-semibold leading-6 group-hover:text-primary">{item.title}<ExternalLink className="ml-1.5 inline size-3.5" /></h3><p className="line-clamp-4 text-sm leading-6 text-muted-foreground">{item.summary}</p></a><div className="flex items-center justify-between gap-3"><Badge>{item.status || 'Roadmap update'}</Badge><span className="text-right text-xs text-muted-foreground">{displayDate(item.updatedAt)}</span></div></CardContent></Card>)}
        </div>}
      </div>
    </section>
  );
}
