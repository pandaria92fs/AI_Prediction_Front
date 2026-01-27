'use client';

import { Card } from '@/types/market';
import { useRouter } from 'next/navigation';
import MultipleOptionCard from './MultipleOptionCard';
import YesNoCard from './YesNoCard';

interface MarketCardProps {
  card: Card;
}

export default function MarketCard({ card }: MarketCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/card/${card.id}`);
  };

  // 判断卡片类型：如果只有一个market，可能是Yes/No类型；多个markets则是多选项类型
  const isYesNoType = card.markets.length === 1;

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {isYesNoType ? (
        <YesNoCard card={card} />
      ) : (
        <MultipleOptionCard card={card} />
      )}
    </div>
  );
}
