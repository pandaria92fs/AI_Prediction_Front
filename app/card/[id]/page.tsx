'use client';

import { use, useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCardDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterTags from '@/components/FilterTags';
import MarketDetailCard from '@/components/MarketDetailCard';
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
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const aiSummaryRef = useRef<HTMLDivElement>(null);
  const titleSectionRef = useRef<HTMLDivElement>(null);
  /** 冻结的 AI Summary 高度：仅在可见时测量并写入，隐藏后仍用于上移滚动区与过渡 */
  const frozenAiSummaryHeightRef = useRef(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ['card', id],
    queryFn: () => getCardDetails({ id }),
  });

  // 分别计算标题区域和 AI Summary 的高度
  const [titleHeight, setTitleHeight] = useState(0);
  const [aiSummaryHeight, setAiSummaryHeight] = useState(0);

  // 监听滚动事件和更新高度
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // 更新高度
    const updateHeights = () => {
      // 计算标题区域高度（包括 mb-6）
      if (titleSectionRef.current) {
        const computedStyle = window.getComputedStyle(titleSectionRef.current);
        const marginBottom = parseInt(computedStyle.marginBottom) || 0;
        setTitleHeight(titleSectionRef.current.offsetHeight + marginBottom);
      }
      
      // 计算 AI Summary 高度（包括 mb-[20px]），仅在可见时写入，隐藏后保持冻结值用于上移与过渡
      if (aiSummaryRef.current) {
        const computedStyle = window.getComputedStyle(aiSummaryRef.current);
        const marginBottom = parseInt(computedStyle.marginBottom) || 0;
        if (aiSummaryRef.current.offsetHeight > 0) {
          const h = aiSummaryRef.current.offsetHeight + marginBottom;
          setAiSummaryHeight(h);
          frozenAiSummaryHeightRef.current = h;
        }
      }
    };

    // 初始计算，延迟一下确保 DOM 已渲染
    setTimeout(updateHeights, 0);

    const handleScroll = () => {
      setScrollY(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // 监听窗口大小变化，重新计算高度
    window.addEventListener('resize', updateHeights);
    
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
      setTimeout(updateHeights, 0);
    });
    if (titleSectionRef.current) {
      observer.observe(titleSectionRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
    if (aiSummaryRef.current) {
      observer.observe(aiSummaryRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateHeights);
      observer.disconnect();
    };
  }, [data]);

  const hideThreshold = 50; // 滚动阈值
  const shouldHideAI = scrollY > hideThreshold;
  
  // 计算 Market Analyses 的上移距离（当 AI Summary 隐藏时）
  // 使用冻结高度，使滚动区顶边与「原 aILogicSummary 顶部」对齐，避免标题与内容间留空
  const marginTop = shouldHideAI ? -frozenAiSummaryHeightRef.current : 0;

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
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
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
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
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

  const isSingleMarket = card.markets.length === 1;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 导航栏 + 类目筛选 - 同一 sticky 块，避免缝隙 */}
      <div className="flex-shrink-0 sticky top-0 z-50 bg-white">
        <Navbar />
        <FilterTags selectedTag={selectedTag} onTagSelect={handleTagSelect} stickyBelowNavbar={false} />
      </div>

      {/* 主内容区域 - 使用 flex 布局，占据剩余空间；pt-0 避免与 sticky 头部之间出现缝隙 */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6 flex-1 flex flex-col min-h-0">
          {/* 固定部分：Event Title & Description */}
          <div className="flex-shrink-0 relative z-10 bg-white">
            {/* Event Title & Description */}
            <div ref={titleSectionRef} className="mb-6">
              <div className="flex items-start gap-4 mb-4">
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
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                    {card.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{formatVolume(card.volume)} Vol.</span>
                    <span className="text-gray-300 mx-2">|</span>
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(card.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Event Logic Summary - 内外层分离：外层做收缩，内层固定 py-6 避免滑动后上下间距错乱 */}
            {card.aILogicSummary && (
              <div
                ref={aiSummaryRef}
                className="overflow-hidden pointer-events-none transition-all duration-300 ease-in-out"
                style={{
                  marginBottom: shouldHideAI ? 0 : 20,
                  opacity: shouldHideAI ? 0 : 1,
                  maxHeight: shouldHideAI ? 0 : (aiSummaryHeight || 'none'),
                }}
              >
                <div className="py-3 px-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed m-0">
                    {card.aILogicSummary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Market Analyses - 独立的滚动容器 */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto min-h-0 transition-all duration-300 ease-in-out relative z-0"
            style={{ marginTop: `${marginTop}px` }}
          >
            <div className="pt-0">
              {card.markets.map((market) => (
                <MarketDetailCard key={market.id} market={market} compactRow />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
