'use client';

import { Card } from '@/types/market';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { stripLeadingLinkFromAiSummary } from '@/lib/format';

interface MarketCardProps {
  card: Card;
}

// 表格行数据（Yes/No 与多选项统一）
interface TableRow {
  key: string;
  label: string;
  marketProb: number;
  aiProb: number;
  arrowType: 'up' | 'down' | 'right' | 'left' | null;
}

// 格式化 groupItemTitle：箭头与后续内容之间加空格，并返回箭头类型（用于颜色）
function formatGroupItemTitle(title: string): { text: string; arrowType: 'up' | 'down' | 'right' | 'left' | null } {
  const arrowMap: Record<string, { arrow: string; type: 'up' | 'down' | 'right' | 'left' }> = {
    '↑': { arrow: '↑', type: 'up' },
    '↓': { arrow: '↓', type: 'down' },
    '→': { arrow: '→', type: 'right' },
    '←': { arrow: '←', type: 'left' },
  };
  const firstChar = title[0];
  if (arrowMap[firstChar]) {
    return {
      text: `${arrowMap[firstChar].arrow} ${title.slice(1)}`,
      arrowType: arrowMap[firstChar].type,
    };
  }
  return { text: title, arrowType: null };
}

// 根据已按 probability 降序排序的 card.markets 构建统一表格行（Mkt 从大到小）
function buildTableRows(card: Card): TableRow[] {
  const markets = card.markets;
  if (!markets.length) return [];

  if (markets.length === 1) {
    // Yes/No：拆成两行，再按市场概率从大到小排
    const m = markets[0];
    const yesProb = m.probability * 100;
    const noProb = 100 - yesProb;
    const aiYes = m.adjustedProbability * 100;
    const aiNo = 100 - aiYes;
    return [
      { key: 'Yes', label: 'Yes', marketProb: yesProb, aiProb: aiYes, arrowType: null },
      { key: 'No', label: 'No', marketProb: noProb, aiProb: aiNo, arrowType: null },
    ].sort((a, b) => b.marketProb - a.marketProb);
  }

  // 多选项：取前两个 market（已按 probability 降序），格式化为行
  return markets.slice(0, 2).map((m) => {
    const formatted = formatGroupItemTitle(m.groupItemTitle || m.question);
    return {
      key: m.id,
      label: formatted.text,
      marketProb: m.probability * 100,
      aiProb: m.adjustedProbability * 100,
      arrowType: formatted.arrowType,
    };
  });
}

export default function MarketCard({ card }: MarketCardProps) {
  const router = useRouter();

  // 按 Mkt（市场概率）从大到小排序
  const sortedCard: Card = {
    ...card,
    markets: [...card.markets].sort((a, b) => b.probability - a.probability),
  };

  const rows = buildTableRows(sortedCard);
  if (rows.length === 0) return null;

  const maxBias = Math.max(...rows.map((r) => Math.abs(r.aiProb - r.marketProb)));
  const hasHighBias = maxBias > 10;
  const isPositiveBias = rows[0].aiProb > rows[0].marketProb;

  const handleClick = () => {
    router.push(`/card/${card.id}`);
  };

  const aILogicSummary = (card as Card & { aILogicSummary?: string }).aILogicSummary;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg border border-gray-200 p-3 w-full sm:w-[315px] flex flex-col transform-gpu transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* A. 头部 */}
      <div className="flex items-start gap-2 mb-[3px] flex-shrink-0">
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
        <div className="flex items-start justify-between flex-1 min-w-0 gap-2">
          <h3 className="text-base font-bold text-[#1F2937] flex-1 leading-tight line-clamp-2">
            {card.title}
          </h3>
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

      {/* B. 中部：Mkt / AI 表格（Yes/No 与多选项共用） */}
      <div className={`flex flex-col ${aILogicSummary ? 'flex-1 min-h-0 mb-1' : ''}`}>
        <div className="grid grid-cols-[1fr_50px_50px] gap-2 text-xs text-[#6B7280] font-medium pb-0.5 mb-0.5">
          <div className="text-xs text-[#6B7280] font-normal" />
          <div className="text-center">Mkt</div>
          <div className="text-center">AI</div>
        </div>
        {rows.map((row) => {
          const roundedMarketProb = Math.round(row.marketProb);
          const roundedAiProb = Math.round(row.aiProb);
          const bias = roundedAiProb - roundedMarketProb;
          const absBias = Math.abs(bias);
          const shouldShowColor = absBias >= 5;
          const isUp = bias > 0;
          const arrowColorClass =
            row.arrowType === 'up'
              ? 'text-green-600'
              : row.arrowType === 'down'
                ? 'text-red-600'
                : '';

          return (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_50px_50px] gap-2 items-center py-0.5"
            >
              <div
                className={`text-base font-medium truncate ${arrowColorClass || 'text-[#1F2937]'}`}
              >
                {row.label}
              </div>
              <div className="text-base font-bold text-[#1F2937] text-center">
                {roundedMarketProb}%
              </div>
              <div className="flex justify-center">
                <button
                  className={`inline-flex items-center justify-center w-[50px] px-1 py-0.5 text-base font-bold rounded transition-colors ${
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

      {/* C. 底部：AI Logic */}
      <div className="flex-shrink-0">
        <div className="min-h-[3.75rem] text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
          {stripLeadingLinkFromAiSummary(aILogicSummary)}
        </div>
      </div>
    </div>
  );
}
