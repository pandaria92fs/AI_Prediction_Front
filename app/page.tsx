'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import FilterTags from '@/components/FilterTags';
import MarketCard from '@/components/MarketCard';
import { FilterTag } from '@/types/market';
import { getCardList } from '@/lib/api';

// 标签名称到tagId映射
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

// tagId到标签名称的反向映射
const TAG_ID_TO_NAME_MAP: Record<string, FilterTag> = {
  '2': 'Politics',
  '21': 'Crypto',
  '120': 'Finance',
  '100265': 'Geopolitics',
  '1013': 'Earnings',
  '1401': 'Tech',
  '596': 'Culture',
  '101970': 'World',
  '100328': 'Economy',
  '103037': 'Climate & Science',
  '144': 'Elections',
  '100343': 'Mentions',
};

// 首页加载时的占位内容
function HomePageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 py-6">
        <div className="text-center py-12">
          <div className="text-[#6B7280]">Loading...</div>
        </div>
      </div>
    </div>
  );
}

// 使用 useSearchParams 的内容组件，需放在 Suspense 内
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagIdFromUrl = searchParams.get('tagId');
  
  // 从URL参数初始化selectedTag
  const getInitialTag = useCallback((): FilterTag | 'All' => {
    if (tagIdFromUrl && TAG_ID_TO_NAME_MAP[tagIdFromUrl]) {
      return TAG_ID_TO_NAME_MAP[tagIdFromUrl];
    }
    return 'All';
  }, [tagIdFromUrl]);

  const [selectedTag, setSelectedTag] = useState<FilterTag | 'All'>(getInitialTag);
  const pageSize = 20;
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity'>('volume');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 当URL参数变化时，更新selectedTag
  useEffect(() => {
    const newTag = getInitialTag();
    setSelectedTag(newTag);
  }, [tagIdFromUrl, getInitialTag]);

  // 直接从URL获取tagId，确保与URL保持一致
  const tagId = tagIdFromUrl || undefined;

  // 使用无限查询实现懒加载
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['cards', pageSize, tagId, sortBy, order],
    queryFn: ({ pageParam = 1 }) =>
      getCardList({ page: pageParam, pageSize, tagId, sortBy, order }),
    getNextPageParam: (lastPage) => {
      const total = lastPage.data.total;
      const currentPage = lastPage.data.page;
      const totalPages = Math.ceil(total / pageSize);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // 合并所有页面的数据
  const cards = data?.pages.flatMap((page) => page.data.list) || [];

  // 懒加载：当滚动到底部时加载更多
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 切换标签时更新URL和状态
  const handleTagSelect = useCallback((tag: FilterTag | 'All') => {
    setSelectedTag(tag);
    // 更新URL参数
    if (tag !== 'All') {
      const tagId = TAG_NAME_TO_ID_MAP[tag];
      router.push(`/?tagId=${tagId}`);
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} />

      {/* 排序控制 - 隐藏但保留代码 */}
      <div className="hidden max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-[#4B5563]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'volume' | 'liquidity')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-[#1F2937]"
          >
            <option value="volume">Volume</option>
            <option value="liquidity">Liquidity</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-[#1F2937]"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          {isFetching && (
            <span className="text-sm text-[#6B7280]">Loading...</span>
          )}
        </div>
      </div>

      {/* 市场卡片网格 - 一行4个 */}
      <main className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-[#6B7280]">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">Failed to load. Please check API connection</div>
            <div className="text-sm text-[#6B7280]">
              Ensure the backend service is running and check the NEXT_PUBLIC_API_BASE_URL environment variable
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">
              No matching markets found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px]">
              {cards.map((card) => (
                <MarketCard key={card.id} card={card} />
              ))}
            </div>

            {/* 懒加载触发器 */}
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center py-8">
              {isFetchingNextPage && (
                <div className="text-sm text-[#6B7280]">Load more...</div>
              )}
              {!hasNextPage && cards.length > 0 && (
                <div className="text-sm text-[#6B7280]">No more data</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomeContent />
    </Suspense>
  );
}
