'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCardDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterTags from '@/components/FilterTags';
import MarketDetailCard from '@/components/MarketDetailCard';
import { FilterTag } from '@/types/market';

// 标签名称到tagId映射（与首页保持一致）
const TAG_NAME_TO_ID_MAP: Record<string, string> = {
  'Politics': '2',
  'Crypto': '21',
  'Finance': '120',
  'Geopolitics': '100265',
  'Earnings': '1013',
  'Tech': '1401',
  'Culture': '596',
  'World': '101970',
  'Economy': '100328',
  'Climate & Science': '103037',
  'Elections': '144',
  'Mentions': '100343',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CardDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<FilterTag | 'All'>('All');
  const [aiSummaryExpanded, setAiSummaryExpanded] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => getCardDetails({ id }),
  });

  // 切换标签时跳转到首页并应用筛选
  const handleTagSelect = useCallback((tag: FilterTag | 'All') => {
    setSelectedTag(tag);
    if (tag !== 'All') {
      const tagId = TAG_NAME_TO_ID_MAP[tag];
      router.push(`/?tagId=${tagId}`);
    } else {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">Failed to load</div>
            <Link
              href="/"
              className="text-blue-500 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = data.data;

  // 格式化数字
  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(volume);
  };

  // 格式化日期为 "Feb 8, 2026" 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 导航栏 + 类目筛选 - 固定在顶部 */}
      <div className="flex-shrink-0 bg-white">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
      </div>

      {/* 可滚动容器 */}
      <div className="flex-1 overflow-y-auto">
        {/* 标题区域 - sticky 固定 */}
        <div className="sticky top-0 z-40 bg-white">
          <div className="w-full min-w-0 sm:min-w-[600px] lg:min-w-[800px] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-4">
              {card.icon && (
                <div className="flex-shrink-0">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={65}
                    height={65}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  {card.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4" />
                  <span>{formatVolume(card.volume)} Vol.</span>
                  <span className="text-gray-300 mx-2">|</span>
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(card.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 内容区域 - AI Summary + Market 列表 */}
        <div className="w-full min-w-0 sm:min-w-[600px] lg:min-w-[800px] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* AI Event Logic Summary */}
            {card.aILogicSummary && (
              <div className="transition-all duration-300 ease-in-out">
                <div
                  className={`py-3 px-3 bg-white rounded-lg border border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${!aiSummaryExpanded ? 'max-h-[240px]' : ''}`}
                  style={{ overflow: aiSummaryExpanded ? 'visible' : 'hidden' }}
                >
                  <div className={`flex-1 min-h-0 ${!aiSummaryExpanded ? 'overflow-hidden' : ''}`}>
                    <p className="text-sm font-semibold text-gray-700 leading-relaxed m-0 whitespace-pre-line">
                      {card.aILogicSummary?.replace(/\r\n/g, '\n')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiSummaryExpanded((e) => !e)}
                    className="mt-2 text-sm font-medium text-blue-600 hover:underline flex-shrink-0 text-left"
                  >
                    {aiSummaryExpanded ? 'Less' : 'More'}
                  </button>
                </div>
              </div>
            )}

            {/* Market Analyses 列表 */}
            <div className="space-y-0">
              {card.markets.map((market) => (
                <MarketDetailCard key={market.id} market={market} compactRow />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
