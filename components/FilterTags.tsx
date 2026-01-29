'use client';

import { FilterTag } from '@/types/market';
import { useRef, useEffect, useState } from 'react';

const AVAILABLE_TAGS: FilterTag[] = [
  'Politics',
  'Crypto',
  'Finance',
  'Geopolitics',
  'Earnings',
  'Tech',
  'Culture',
  'World',
  'Economy',
  'Climate & Science',
  'Elections',
  'Mentions',
];

interface FilterTagsProps {
  selectedTag: FilterTag | 'All';
  onTagSelect: (tag: FilterTag | 'All') => void;
}

export default function FilterTags({ selectedTag, onTagSelect }: FilterTagsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);

  // 检查是否需要显示渐变遮罩
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        // 如果内容宽度大于容器宽度，且未滚动到最右侧，显示渐变
        const needsGradient = scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10;
        setShowGradient(needsGradient);
      }
    };

    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // 监听窗口大小变化
      window.addEventListener('resize', checkScroll);
      // 初始检查
      setTimeout(checkScroll, 100);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return (
    <div className="sticky top-16 z-40 w-full border-b border-gray-200 bg-white relative">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 py-4">
        {/* 可横向滚动的标签容器 */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto hide-scrollbar"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* All 标签 */}
            <button
              onClick={() => onTagSelect('All')}
              className={`text-base font-bold transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedTag === 'All'
                  ? 'text-[#1F2937]'
                  : 'text-[#9CA3AF] hover:text-[#1F2937]'
              }`}
            >
              All
            </button>

            {/* 其他标签 */}
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagSelect(tag)}
                className={`text-base font-bold transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTag === tag
                    ? 'text-[#1F2937]'
                    : 'text-[#9CA3AF] hover:text-[#1F2937]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 右侧渐变遮罩 */}
          {showGradient && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}
