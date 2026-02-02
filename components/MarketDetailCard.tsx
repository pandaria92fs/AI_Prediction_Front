'use client';

import { Market } from '@/types/market';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MarketDetailCardProps {
  market: Market;
  isSingleMarket?: boolean; // 是否为单个市场（显示更大卡片）
  /** 详情页列表用：单行紧凑，无独立卡片 */
  compactRow?: boolean;
}

export default function MarketDetailCard({ market, isSingleMarket = false, compactRow = false }: MarketDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 计算概率百分比并取整
  const marketProbRaw = market.probability * 100;
  const aiProbRaw = market.adjustedProbability * 100;
  const marketProb = Math.round(marketProbRaw);
  const aiProb = Math.round(aiProbRaw);
  const difference = aiProb - marketProb;
  const isHigher = difference > 0;
  const isSame = difference === 0;

  const displayTitle = market.groupItemTitle || market.question;
  const insight = market.structuralAnchor || market.aILogicSummary;

  // 格式化单条 market 的 volume，与 Polymarket 一致：$XXX,XXX Vol.
  const formatVol = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v) + ' Vol.';
  const displayProb = aiProb < 1 ? '<1%' : `${aiProb}%`;
  const isVeryLow = aiProb < 1;

  // 详情页：Polymarket 风格 + 校准条 + Market/AI Odds 一行
  if (compactRow) {
    return (
      <div className="py-3 border-b border-gray-200 last:border-b-0">
        <div className="min-w-0 flex-1">
          {/* 标题 + 紧接后面的 Odds（同一行，与标题区分） */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-base font-bold text-gray-900 truncate" title={displayTitle}>
              {displayTitle}
            </h3>
            <div className="inline-flex flex-shrink-0 items-center gap-x-2 rounded-md bg-gray-50 px-2.5 py-1 text-sm">
              <span className="font-medium text-gray-600">Market Odds: {marketProb}%</span>
              <span className={`font-semibold ${isSame ? 'text-gray-600' : isHigher ? 'text-green-600' : 'text-red-600'}`}>
                AI Calibrated Odds: {aiProb}%
              </span>
              {!isSame && (
                <span className={`font-medium ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
                  {isHigher ? '↑ Higher' : '↓ Lower'} ({Math.abs(difference)}%)
                </span>
              )}
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            {formatVol(market.volume)}
          </p>
        </div>
        {/* 校准条 */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative mt-2">
          <div className="absolute inset-y-0 left-0 h-full bg-gray-400" style={{ width: `${Math.min(marketProb, 100)}%` }} />
          <div
            className={`absolute inset-y-0 left-0 h-full ${isSame ? 'bg-gray-400' : isHigher ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(aiProb, 100)}%` }}
          />
        </div>
        {insight && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-snug">{insight}</p>
        )}
        {market.deepReasoning && (
          <>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              {isExpanded ? 'Hide' : 'Deep reasoning'}
            </button>
            {isExpanded && (
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                {market.deepReasoning.noise && market.deepReasoning.noise.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Noise: </span>
                    {market.deepReasoning.noise.join(' · ')}
                  </div>
                )}
                {market.deepReasoning.structuralBarriers && market.deepReasoning.structuralBarriers.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Barriers: </span>
                    {market.deepReasoning.structuralBarriers.join(' · ')}
                  </div>
                )}
                {market.deepReasoning.blindspotCriticism && (
                  <div>
                    <span className="font-medium text-gray-700">Blindspot: </span>
                    {market.deepReasoning.blindspotCriticism}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // 原有卡片样式（单市场或旧用法）
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${
        isSingleMarket ? 'w-full' : 'w-full sm:w-full'
      } transition-all duration-200 hover:shadow-md`}
    >
      <h3 className="text-lg sm:text-xl font-bold text-black mb-4">
        {displayTitle}
      </h3>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">Market Odds</span>
          <span className="text-sm font-semibold text-gray-700">{marketProb}%</span>
        </div>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative mb-3">
          <div
            className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-300"
            style={{ width: `${Math.min(marketProb, 100)}%` }}
          />
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-300 ${
              isSame ? 'bg-gray-400' : isHigher ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(aiProb, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${
            isSame ? 'text-gray-600' : isHigher ? 'text-green-600' : 'text-red-600'
          }`}>
            AI Calibrated Odds: {aiProb}%
          </span>
          {!isSame && (
            <span className={`text-xs font-medium ${isHigher ? 'text-green-600' : 'text-red-600'}`}>
              {isHigher ? '↑ Higher' : '↓ Lower'} ({Math.abs(difference)}%)
            </span>
          )}
        </div>
      </div>

      {market.structuralAnchor && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Structural Anchor: </span>
            {market.structuralAnchor}
          </p>
        </div>
      )}

      {!market.structuralAnchor && market.aILogicSummary && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Key Insight: </span>
            {market.aILogicSummary}
          </p>
        </div>
      )}

      {market.deepReasoning && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          <span>Show Deep Reasoning</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {isExpanded && market.deepReasoning && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* The Noise */}
          {market.deepReasoning.noise && market.deepReasoning.noise.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">The Noise</h4>
              <ul className="space-y-1">
                {market.deepReasoning.noise.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Structural Barriers */}
          {market.deepReasoning.structuralBarriers && market.deepReasoning.structuralBarriers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Structural Barriers</h4>
              <ul className="space-y-1">
                {market.deepReasoning.structuralBarriers.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Blindspot Criticism */}
          {market.deepReasoning.blindspotCriticism && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Blindspot Criticism</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {market.deepReasoning.blindspotCriticism}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
