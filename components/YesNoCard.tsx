'use client';

import { Card } from '@/types/market';
import Image from 'next/image';

interface YesNoCardProps {
  card: Card;
}

export default function YesNoCard({ card }: YesNoCardProps) {
  const market = card.markets[0];
  if (!market) return null;

  // 市场概率
  const marketYesProb = market.probability * 100;
  const marketNoProb = 100 - marketYesProb;

  // AI 预测概率
  const aiYesProb = market.adjustedProbability * 100;
  const aiNoProb = 100 - aiYesProb;

  // 计算偏差
  const yesBias = Math.abs(aiYesProb - marketYesProb);
  const noBias = Math.abs(aiNoProb - marketNoProb);
  const maxBias = Math.max(yesBias, noBias);
  const hasHighBias = maxBias > 10;

  // 判断偏差方向（以 Yes 的偏差方向为准）
  const isPositiveBias = aiYesProb > marketYesProb;

  // 构建两行数据
  const rows = [
    {
      label: 'Yes',
      marketProb: marketYesProb,
      aiProb: aiYesProb,
    },
    {
      label: 'No',
      marketProb: marketNoProb,
      aiProb: aiNoProb,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 w-full sm:w-[315px] flex flex-col transform-gpu transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* A. 头部 (Header) */}
      <div className="flex items-start gap-2 mb-[3px] flex-shrink-0">
        {/* 图标 - 统一为方形显示 */}
        {card.icon && (
          <div className="flex-shrink-0 w-[40px] h-[40px] rounded overflow-hidden">
            <Image
              src={card.icon}
              alt={card.title}
              width={40}
              height={40}
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
          {/* Status Badge - 右上角 - 已隐藏但保留计算逻辑 */}
          {false && hasHighBias && (
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
            {/* Volume 已隐藏 */}
          </div>
          <div className="text-center">Mkt</div>
          <div className="text-center">AI</div>
        </div>
        {/* 表格内容 */}
        {rows.map((row, index) => {
          // 使用取整后的值计算差异
          const roundedMarketProb = Math.round(row.marketProb);
          const roundedAiProb = Math.round(row.aiProb);
          const bias = roundedAiProb - roundedMarketProb;
          const absBias = Math.abs(bias);
          // 只有当差异 >= 5 时才显示颜色
          const shouldShowColor = absBias >= 5;
          const isUp = bias > 0;

          return (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_50px_50px] gap-2 items-center py-0.5"
            >
              {/* Market Name */}
              <div className="text-sm font-medium text-[#1F2937]">
                {row.label}
              </div>
              {/* Polymarket % */}
              <div className="text-sm font-bold text-[#1F2937] text-center">
                {roundedMarketProb}%
              </div>
              {/* AI Predicted % - 按钮样式 */}
              <div className="flex justify-center">
                <button
                  className={`inline-flex items-center justify-center w-[50px] px-1 py-0.5 text-sm font-bold rounded transition-colors ${
                    shouldShowColor
                      ? isUp
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-[#1F2937] hover:bg-gray-100'
                  }`}
                >
                  {roundedAiProb}%
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* C. 底部 (Footer - AI Logic) - 固定 3 行高度，不足空行补齐，超出第三行末尾 ... */}
      <div className="flex-shrink-0">
        <div className="min-h-[3.75rem] text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
          {card.aILogicSummary || ''}
        </div>
      </div>
    </div>
  );
}
