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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow w-full sm:w-[315px] h-[180px] flex flex-col">
      {/* 图标和标题 */}
      <div className="flex items-start gap-3 mb-3 flex-shrink-0">
        {card.icon && (
          <div className="flex-shrink-0 w-10 h-10">
            <Image
              src={card.icon}
              alt={card.title}
              width={40}
              height={40}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
        )}
        <h3 className="text-sm font-semibold text-[#1F2937] flex-1 leading-tight line-clamp-2 overflow-hidden text-ellipsis">
          {card.title}
        </h3>
      </div>

      {/* 市场选项列表 - 只显示前两个，其他隐藏 */}
      <div className="flex-1 min-h-0 flex flex-col">
        {card.markets.slice(0, 2).map((market, index) => {
          const probability = (market.probability * 100).toFixed(1);
          return (
            <div
              key={market.id}
              className={`flex items-center justify-between py-1.5 ${
                index < card.markets.slice(0, 2).length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span className="text-sm font-medium text-[#1F2937] flex-1">
                {market.groupItemTitle || market.question}
              </span>
              <span className="text-sm font-bold text-[#1F2937] ml-3">
                {probability}%
              </span>
            </div>
          );
        })}
      </div>

      {/* 标签和统计信息 */}
      <div className="pt-3 border-t border-gray-100 flex-shrink-0">
        {/* 统计信息 */}
        <div className="flex gap-3 text-xs text-[#6B7280] font-normal">
          <span>${(card.volume / 1000000).toFixed(1)}m Vol.</span>
        </div>
      </div>
    </div>
  );
}
