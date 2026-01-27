'use client';

import { Card } from '@/types/market';
import Image from 'next/image';

interface MultipleOptionCardProps {
  card: Card;
}

export default function MultipleOptionCard({ card }: MultipleOptionCardProps) {
  if (!card.markets || card.markets.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* 图标和标题 */}
      <div className="flex items-start gap-4 mb-4">
        {card.icon && (
          <div className="flex-shrink-0">
            <Image
              src={card.icon}
              alt={card.title}
              width={64}
              height={64}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {card.title}
        </h3>
      </div>

      {/* 市场选项列表 - 只显示概率，不显示Yes/No按钮 */}
      <div className="space-y-3">
        {card.markets.map((market) => {
          const probability = (market.probability * 100).toFixed(1);
          return (
            <div
              key={market.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                {market.question}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white ml-4">
                {probability}%
              </span>
            </div>
          );
        })}
      </div>

      {/* 标签和统计信息 */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* 标签 */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {card.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        {/* 统计信息 */}
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Volume: ${(card.volume / 1000).toFixed(1)}K</span>
          <span>Liquidity: ${(card.liquidity / 1000).toFixed(1)}K</span>
        </div>
      </div>
    </div>
  );
}
