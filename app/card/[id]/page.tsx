'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCardDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CardDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => getCardDetails({ id }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">加载失败</div>
          <Link
            href="/"
            className="text-blue-500 hover:underline"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const card = data.data;
  const isYesNoType = card.markets.length === 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 导航栏 */}
      <div className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              Universal Predictor
            </div>
          </div>
        </div>
      </div>

      {/* 详情内容 */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* 卡片头部 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            {card.icon && (
              <div className="flex-shrink-0">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {card.title}
              </h1>
              
              {/* 标签 */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}

              {/* 统计信息 */}
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Volume:</span>{' '}
                  ${(card.volume / 1000).toFixed(1)}K
                </div>
                <div>
                  <span className="font-medium">Liquidity:</span>{' '}
                  ${(card.liquidity / 1000).toFixed(1)}K
                </div>
                <div>
                  <span className="font-medium">Markets:</span> {card.markets.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 市场列表 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            市场选项
          </h2>
          
          {card.markets.map((market) => {
            const probability = market.probability * 100;
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (probability / 100) * circumference;

            return (
              <div
                key={market.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start gap-6">
                  {market.icon && (
                    <div className="flex-shrink-0">
                      <Image
                        src={market.icon}
                        alt={market.question}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {market.question}
                    </h3>

                    {/* 概率显示 */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference * 0.72}
                            strokeDashoffset={offset * 0.72}
                            strokeLinecap="round"
                            className="text-gray-900 dark:text-white transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {probability.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Volume:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${(market.volume / 1000).toFixed(1)}K
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Liquidity:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${(market.liquidity / 1000).toFixed(1)}K
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">开始:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(market.startDate).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">结束:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {new Date(market.endDate).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Yes/No 按钮（如果是Yes/No类型） */}
                    {isYesNoType && (
                      <div className="flex gap-3 mt-6">
                        <button className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors">
                          Yes
                        </button>
                        <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
                          No
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
