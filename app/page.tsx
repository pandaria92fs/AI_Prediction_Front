'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import FilterTags from '@/components/FilterTags';
import MarketCard from '@/components/MarketCard';
import { FilterTag } from '@/types/market';
import { getCardList } from '@/lib/api';

// 标签名称到可能的tagId映射（根据实际情况调整）
const TAG_NAME_TO_ID_MAP: Record<string, string> = {
  'Politics': 'politics',
  'Crypto': '21', // 从示例数据中看到Crypto的id是21
  'Finance': '120', // 从示例数据中看到Finance的id是120
  'Geopolitics': 'geopolitics',
  'Earnings': 'earnings',
  'Tech': '1401', // 从示例数据中看到Tech的id是1401
  'Culture': 'culture',
  'World': 'world',
  'Economy': 'economy',
  'Climate & Science': 'climate-science',
  'Elections': 'elections',
  'Mentions': 'mentions',
};

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<FilterTag | 'All'>('All');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity'>('volume');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  // 获取tagId
  const tagId = selectedTag !== 'All' ? TAG_NAME_TO_ID_MAP[selectedTag] : undefined;

  // 使用React Query获取数据
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['cards', page, pageSize, tagId, sortBy, order],
    queryFn: () => getCardList({ page, pageSize, tagId, sortBy, order }),
  });

  const cards = data?.data?.list || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <FilterTags selectedTag={selectedTag} onTagSelect={(tag) => {
        setSelectedTag(tag);
        setPage(1); // 切换标签时重置到第一页
      }} />

      {/* 排序控制 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'volume' | 'liquidity')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="volume">Volume</option>
            <option value="liquidity">Liquidity</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
          {isFetching && (
            <span className="text-sm text-gray-500 dark:text-gray-400">加载中...</span>
          )}
        </div>
      </div>

      {/* 市场卡片网格 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">加载中...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">加载失败，请检查API连接</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              请确保后端服务正在运行，并检查 NEXT_PUBLIC_API_BASE_URL 环境变量
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              没有找到匹配的市场
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <MarketCard key={card.id} card={card} />
              ))}
            </div>

            {/* 分页控制 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  第 {page} 页，共 {totalPages} 页（总计 {total} 条）
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
