'use client';

import { Card, Market } from '@/types/market';
import Image from 'next/image';

interface MultipleOptionCardProps {
  card: Card;
}

// 计算偏差百分比
function calculateBias(market: Market): number {
  const marketProb = market.probability * 100;
  const aiProb = market.adjustedProbability * 100;
  return Math.abs(aiProb - marketProb);
}

// 获取最大偏差（用于判断是否显示 High Bias）
function getMaxBias(markets: Market[]): number {
  return Math.max(...markets.map(calculateBias));
}

export default function MultipleOptionCard({ card }: MultipleOptionCardProps) {
  if (!card.markets || card.markets.length === 0) {
    return null;
  }

  // 获取前两个市场（按 odds 排序，这里假设已排序）
  const topMarkets = card.markets.slice(0, 2);
  const maxBias = getMaxBias(topMarkets);
  const hasHighBias = maxBias > 10;

  // 判断偏差方向（取第一个市场的偏差方向作为整体方向）
  const firstMarket = card.markets[0];
  const isPositiveBias = firstMarket.adjustedProbability > firstMarket.probability;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg transition-shadow w-full sm:w-[315px] flex flex-col">
      {/* A. 头部 (Header) */}
      <div className="flex items-start gap-2 mb-3 flex-shrink-0">
        {/* 图标 - 统一为方形显示 */}
        {card.icon && (
          <div className="flex-shrink-0 w-[50px] h-[50px] rounded overflow-hidden">
            <Image
              src={card.icon}
              alt={card.title}
              width={50}
              height={50}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        )}
        {/* 标题和 Badge */}
        <div className="flex items-start justify-between flex-1 min-w-0 gap-2">
          <h3 className="text-base font-bold text-[#1F2937] flex-1 leading-tight line-clamp-2">
            {card.title}
          </h3>
          {/* Status Badge - 右上角 */}
          {hasHighBias && (
            <div
              className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${
                isPositiveBias
                  ? 'bg-green-100 text-green-700 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : 'bg-red-100 text-red-700 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
              }`}
            >
              High Bias
            </div>
          )}
        </div>
      </div>

      {/* B. 中部 (Market Comparison Table) - volume 和 market rows 是一个整体；无 aILogicSummary 时不占满剩余空间，避免底部空白 */}
      <div className={`flex flex-col ${card.aILogicSummary ? 'flex-1 min-h-0 mb-1' : ''}`}>
        {/* 表头 */}
        <div className="grid grid-cols-[1fr_50px_50px] gap-2 text-xs text-[#6B7280] font-medium pb-0.5 mb-0.5">
          <div className="text-xs text-[#6B7280] font-normal">
            ${(card.volume / 1000000).toFixed(1)}m Vol.
          </div>
          <div className="text-center">Mkt</div>
          <div className="text-center">AI</div>
        </div>
        {/* 表格内容 */}
        {topMarkets.map((market, index) => {
          const marketProb = market.probability * 100;
          const aiProb = market.adjustedProbability * 100;
          const bias = aiProb - marketProb;
          const isSignificantDiff = Math.abs(bias) > 5; // 显著差异阈值
          const isUp = bias > 0;

          // 获取市场简称（取 groupItemTitle 的前几个单词或首字母）
          const marketName = market.groupItemTitle || market.question;
          const shortName = marketName.length > 15 
            ? marketName.split(' ').map(w => w[0]).join('. ').substring(0, 15) + '.'
            : marketName;

          return (
            <div
              key={market.id}
              className="grid grid-cols-[1fr_50px_50px] gap-2 items-center py-0.5"
            >
              {/* Market Name */}
              <div className="text-sm font-medium text-[#1F2937] truncate">
                {shortName}
              </div>
              {/* Polymarket % */}
              <div className="text-sm font-bold text-[#1F2937] text-center">
                {marketProb.toFixed(1)}%
              </div>
              {/* AI Predicted % */}
              <div
                className={`text-sm font-bold text-center ${
                  isSignificantDiff
                    ? isUp
                      ? 'text-green-600'
                      : 'text-red-600'
                    : 'text-[#1F2937]'
                }`}
              >
                {aiProb.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* C. 底部 (Footer - AI Logic) - 固定 2 行高度，不足空行补齐，超出第二行末尾 ... */}
      {card.aILogicSummary && (
        <div className="flex-shrink-0">
          <div className="min-h-[2.5rem] text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
            {card.aILogicSummary}
          </div>
        </div>
      )}
    </div>
  );
}
