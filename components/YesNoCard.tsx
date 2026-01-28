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

  // 计算圆形进度条的样式 - 缩小尺寸
  const radius = 28; // 缩小半径
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (chance / 100) * circumference;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow w-full sm:w-[315px] h-[180px] flex flex-col">
      {/* 图标、标题和Chance - 一行显示 */}
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
        <h3 className="text-base font-semibold text-[#1F2937] flex-1 leading-tight line-clamp-2 overflow-hidden text-ellipsis">
          {market?.groupItemTitle || market?.question || card.title}
        </h3>
        {/* Chance 显示在右上角 */}
        <div className="flex-shrink-0 relative w-16 h-16">
          <svg className="transform -rotate-90 w-16 h-16">
            {/* 背景圆 */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            {/* 进度圆 */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-gray-400 transition-all duration-300"
            />
          </svg>
          {/* 中心文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-[#1F2937] leading-none">
                {chance.toFixed(0)}%
              </div>
              <div className="text-[10px] text-[#6B7280] font-normal mt-0.5 leading-none">
                chance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yes/No 按钮 - 缩小尺寸，点击进入详情 */}
      <div className="flex gap-2 mb-3 flex-1 min-h-0 items-start">
        <button
          className="flex-1 py-2 px-3 bg-[#D1FAE5] text-[#065F46] rounded-lg text-sm font-normal transition-colors"
        >
          Yes
        </button>
        <button
          className="flex-1 py-2 px-3 bg-[#FEE2E2] text-[#991B1B] rounded-lg text-sm font-normal transition-colors"
        >
          No
        </button>
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
