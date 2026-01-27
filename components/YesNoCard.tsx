'use client';

import { Card } from '@/types/market';
import Image from 'next/image';

interface YesNoCardProps {
  card: Card;
}

export default function YesNoCard({ card }: YesNoCardProps) {
  // 取第一个market的概率作为chance
  const market = card.markets[0];
  const chance = market ? market.probability * 100 : 0;

  // 计算圆形进度条的样式
  const circumference = 2 * Math.PI * 45; // 半径45
  const offset = circumference - (chance / 100) * circumference;

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
          {market?.question || card.title}
        </h3>
      </div>

      {/* Chance 显示 - 圆形进度条 */}
      <div className="flex items-center justify-center my-6">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* 背景圆 */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* 进度圆 */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-gray-900 dark:text-white transition-all duration-300"
            />
          </svg>
          {/* 中心文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {chance.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                chance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yes/No 按钮 */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
        >
          No
        </button>
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
