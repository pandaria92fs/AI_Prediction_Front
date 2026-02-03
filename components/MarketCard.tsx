'use client';

import { Card } from '@/types/market';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { getListPageAiSummary } from '@/lib/format';
import { useState } from 'react';

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

// 判断是否为 Yes/No 类型：仅一条 market 且 groupItemTitle（不区分大小写）为 "yes" 或 "no"
function isYesNoCard(markets: Card['markets']): boolean {
  if (markets.length !== 1) return false;
  const label = (markets[0].groupItemTitle ?? '').trim().toLowerCase();
  return label === 'yes' || label === 'no';
}

// 根据已按 probability 降序排序的 card.markets 构建统一表格行（Mkt 从大到小）
function buildTableRows(card: Card): TableRow[] {
  const markets = card.markets;
  if (!markets.length) return [];

  if (isYesNoCard(markets)) {
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

  // 多选项：取全部 market（已按 probability 降序），格式化为行，列表内可滚动查看
  return markets.map((m) => {
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
  const aILogicSummary = (card as Card & { aILogicSummary?: string }).aILogicSummary;
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-xl border border-gray-200 shadow-[0_2px_9px_rgba(0,0,0,0.08)] px-3 pt-[14px] pb-3 w-full sm:w-[315px] min-h-[225px] flex flex-col transform-gpu transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_2px_9px_rgba(0,0,0,0.12)]"
    >
      {/* A. 头部 */}
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        {card.icon && (
          <div className="flex-shrink-0 w-[46px] h-[46px] overflow-hidden flex items-center justify-center bg-transparent">
            <Image
              src={card.icon}
              alt={card.title}
              width={92}
              height={92}
              className="object-contain max-w-full max-h-full"
              unoptimized
            />
          </div>
        )}
        <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
          <h3 className="text-[15px] font-bold text-[#1F2937] flex-1 leading-tight line-clamp-2">
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

      {/* B. 中部：表头不含背景；左侧选项+Mkt 一块浅灰，AI 列仅单层色块（无灰底） */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-[1fr_50px_50px] text-xs text-[#6B7280] font-medium pb-1 mb-1 w-[288px] flex-shrink-0">
          <div className="text-xs text-[#6B7280] font-normal px-2" />
          <div className="text-center px-2">Mkt</div>
          <div className="text-center px-2">AI</div>
        </div>
        {/* 市场数据区域：固定高度约 2 行，内容可上下滚动；外层圆角裁剪保证底角始终圆角（与行内圆角一致） */}
        <div className="w-[288px] max-h-[88px] rounded-b overflow-hidden flex-shrink-0">
          <div className="w-[288px] max-h-[88px] overflow-y-auto overflow-x-hidden hide-scrollbar">
          {rows.map((row, index) => {
          const roundedMarketProb = Math.round(row.marketProb);
          const roundedAiProb = Math.round(row.aiProb);
          const bias = roundedAiProb - roundedMarketProb;
          // AI 与 Mkt 差值：≥5% 浅绿+深色字，≤-5% 浅红+深色字，5% 以内深灰（单层色块，向图 1 靠拢）
          const aiCellClass =
            bias >= 5
              ? 'bg-[#dff1e5] text-[#1F2937]'
              : bias <= -5
                ? 'bg-[#fce7e7] text-[#1F2937]'
                : 'bg-[#ebf0f0] text-[#374151]';
          const arrowColorClass =
            row.arrowType === 'up'
              ? 'text-green-600'
              : row.arrowType === 'down'
                ? 'text-red-600'
                : '';

          // 第一行顶部圆角，最后一行底部圆角
          const isFirst = index === 0;
          const isLast = index === rows.length - 1;
          const leftRounded = isFirst ? 'rounded-tl' : isLast ? 'rounded-bl' : '';
          const rightRounded = isFirst ? 'rounded-tr' : isLast ? 'rounded-br' : '';

          return (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_50px_50px] items-stretch h-[44px]"
            >
              {/* 选项列 - 左侧圆角，14px */}
              <div
                className={`text-[14px] font-medium truncate bg-[#F7F7F7] px-3 flex items-center ${leftRounded} ${arrowColorClass || 'text-[#1F2937]'}`}
              >
                {row.label}
              </div>
              {/* Mkt列 - 无圆角，18px */}
              <div className="text-[18px] font-bold text-[#1F2937] text-center bg-[#F7F7F7] px-3 flex items-center justify-center">
                {roundedMarketProb}%
              </div>
              {/* AI列 - 右侧圆角，18px */}
              <div
                className={`text-[18px] font-bold text-center px-3 flex items-center justify-center ${rightRounded} ${aiCellClass}`}
              >
                {roundedAiProb}%
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>

      {/* C. 底部：AI Logic 单行截断，鼠标悬停显示3行 */}
      <div 
        className="flex-shrink-0 flex items-start gap-2 mt-auto pt-2"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`flex-1 min-w-0 text-[12px] font-normal text-left text-[#7b7b7b] leading-relaxed overflow-hidden text-ellipsis transition-all duration-200 ${isExpanded ? 'line-clamp-3' : 'line-clamp-1'}`}>
          {getListPageAiSummary(aILogicSummary)}
        </div>
        {aILogicSummary ? (
          <ChevronDown className="w-4 h-4 text-[#7b7b7b] flex-shrink-0 mt-0.5" aria-hidden />
        ) : null}
      </div>
    </div>
  );
}
