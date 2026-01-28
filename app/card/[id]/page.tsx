'use client';

import { use, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCardDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterTags from '@/components/FilterTags';
import { FilterTag } from '@/types/market';

// 标签名称到tagId映射（与首页保持一致）
const TAG_NAME_TO_ID_MAP: Record<string, string> = {
  'Politics': '2',
  'Crypto': '21',
  'Finance': '120',
  'Geopolitics': '100265',
  'Earnings': '1013',
  'Tech': '1401',
  'Culture': '596',
  'World': '101970',
  'Economy': '100328',
  'Climate & Science': '103037',
  'Elections': '144',
  'Mentions': '100343',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CardDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<FilterTag | 'All'>('All');
  const { data, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => getCardDetails({ id }),
  });

  // 切换标签时跳转到首页并应用筛选
  const handleTagSelect = useCallback((tag: FilterTag | 'All') => {
    setSelectedTag(tag);
    // 跳转到首页并应用筛选（与首页行为一致）
    if (tag !== 'All') {
      const tagId = TAG_NAME_TO_ID_MAP[tag];
      router.push(`/?tagId=${tagId}`);
    } else {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">Failed to load</div>
            <Link
              href="/"
              className="text-blue-500 hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = data.data;

  // 格式化数字
  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(volume);
  };

  // 格式化日期为 "Feb 8, 2026" 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // 格式化 groupItemTitle：如果开头是箭头，在箭头和后续内容之间添加空格
  // 返回格式化后的文本和箭头类型（用于颜色判断）
  const formatGroupItemTitle = (title: string): { text: string; arrowType: 'up' | 'down' | 'right' | 'left' | null } => {
    // 箭头映射：保留窄箭头
    const arrowMap: Record<string, { arrow: string; type: 'up' | 'down' | 'right' | 'left' }> = {
      '↑': { arrow: '↑', type: 'up' },      // 向上箭头
      '↓': { arrow: '↓', type: 'down' },    // 向下箭头
      '→': { arrow: '→', type: 'right' },   // 向右箭头
      '←': { arrow: '←', type: 'left' },    // 向左箭头
    };

    const firstChar = title[0];
    
    if (arrowMap[firstChar]) {
      // 替换为粗箭头并在箭头和后续内容之间添加空格
      return {
        text: `${arrowMap[firstChar].arrow} ${title.slice(1)}`,
        arrowType: arrowMap[firstChar].type
      };
    }
    
    return { text: title, arrowType: null };
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 导航栏 */}
      <Navbar />
      
      {/* 类目筛选 - 固定在Navbar下方 */}
      <div className="sticky top-16 z-30 bg-white">
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} />
      </div>

      {/* 固定标题区域 */}
      <div className="sticky top-[129px] z-40 bg-white flex-shrink-0 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* 顶部：图标 + title */}
            <div className="flex items-start gap-4 pt-4 pb-4">
              {card.icon && (
                <div className="flex-shrink-0">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={65}
                    height={65}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
              )}
              <h1 className="text-xl font-bold text-black flex-1">
                {card.title}
              </h1>
            </div>

            {/* 总体Volume + EndDate */}
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-black">
                  {formatVolume(card.volume)} Vol.
                </span>
                <span className="text-gray-300 mx-2">|</span>
                <Clock className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#9CA3AF] font-normal">
                  {formatDate(card.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 可滚动的市场选项列表 - 可以滚动并藏到标题下方 */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="space-y-0">
              {card.markets.map((market, index) => {
                const probability = market.probability * 100;
                const probabilityText = probability < 1 ? '<1%' : `${Math.round(probability)}%`;
                const isLowProbability = probability < 1;
                const percentageChange = market.percentageChange || 0; // 如果后端没有，默认为0
                const isPositive = percentageChange > 0;

                const formattedTitle = formatGroupItemTitle(market.groupItemTitle || market.question);
                // 根据箭头类型设置颜色：上升箭头红色，下降箭头绿色
                const arrowColorClass = formattedTitle.arrowType === 'up' 
                  ? 'text-red-600' 
                  : formattedTitle.arrowType === 'down' 
                  ? 'text-green-600' 
                  : '';

                return (
                  <div
                    key={market.id}
                    className={`flex items-start justify-between py-4 ${
                      index < card.markets.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    {/* 左侧：标题 + Volume + AI Logic Summary */}
                    <div className="flex-1 pr-4">
                      <div className={`font-bold mb-1 ${arrowColorClass || 'text-black'}`}>
                        {formattedTitle.text}
                      </div>
                      {/* AI Logic Summary - 固定两行高度，超出截断 */}
                      {market.aILogicSummary && (
                        <div className="min-h-[2.5rem] text-xs text-[#6B7280] font-normal leading-relaxed line-clamp-2 overflow-hidden text-ellipsis mb-1">
                          {market.aILogicSummary}
                        </div>
                      )}
                      <div className="text-sm text-black">
                        {formatVolume(market.volume)} Vol.
                      </div>
                    </div>

                    {/* 右侧：百分比 + 变化 */}
                    <div className="flex items-center gap-3">
                      {/* 当前百分比 */}
                      <div
                        className={`${
                          isLowProbability
                            ? 'text-gray-400 text-base font-normal'
                            : 'text-black text-xl font-bold'
                        }`}
                      >
                        {probabilityText}
                      </div>

                      {/* 百分比变化 - 如果后端有数据就显示 */}
                      {market.percentageChange !== undefined && market.percentageChange !== 0 && (
                        <div
                          className={`text-sm flex items-center gap-0.5 ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUp className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5" />
                          )}
                          <span>{Math.abs(percentageChange)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
