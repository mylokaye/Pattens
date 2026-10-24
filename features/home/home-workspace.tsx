'use client';

import type { NewsResponse } from '@/features/news/news-data';
import { NewsStories } from '@/features/news/news-stories';
import type { RoadmapResponse } from '@/features/home/roadmap-data';
import { RoadmapUpdates } from '@/features/home/roadmap-updates';

export function HomeWorkspace({ initialNews, initialRoadmap }: { initialNews: NewsResponse | null; initialRoadmap: RoadmapResponse | null }) {
  return (
    <NewsStories initialData={initialNews} limit={6} sourceFilterGroups={[{ id: 'dynamics', label: 'Dynamics', sourceNames: ['Microsoft Dynamics'] }, { id: 'blogs', label: 'Blogs', sourceNames: ['Meghan', 'Amey Holden'] }]} topSection={<RoadmapUpdates initialData={initialRoadmap} />} title="Latest news" showSourceFilter />
  );
}
