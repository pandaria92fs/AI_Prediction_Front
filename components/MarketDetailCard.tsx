'use client';

import { Market } from '@/types/market';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MarketDetailCardProps {
  market: Market;
  isSingleMarket?: boolean; // 是否为单个市场（显示更大卡片）
}

export default function MarketDetailCard({ market, isSingleMarket = false }: MarketDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 计算概率百分比并取整
  const marketProbRaw = market.probability * 100;
  const aiProbRaw = market.adjustedProbability * 100;
  const marketProb = Math.round(marketProbRaw);
  const aiProb = Math.round(aiProbRaw);
  // 使用取整后的值计算差异
  const difference = aiProb - marketProb;
  const isHigher = difference > 0;
  const isSame = difference === 0;

  // 格式化标题
  const displayTitle = market.groupItemTitle || market.question;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${
        isSingleMarket ? 'w-full' : 'w-full sm:w-full'
      } transition-all duration-200 hover:shadow-md`}
    >
      {/* Market Header: Question Name */}
      <h3 className="text-lg sm:text-xl font-bold text-black mb-4">
        {displayTitle}
      </h3>

      {/* The Calibration Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 font-medium">Market Odds</span>
          <span className="text-sm font-semibold text-gray-700">{marketProb}%</span>
        </div>
        
        {/* Visual Calibration Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative mb-3">
          {/* Market Odds Indicator (Gray) - 背景层 */}
          <div
            className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-300"
            style={{ width: `${Math.min(marketProb, 100)}%` }}
          />
          {/* AI Calibrated Odds Indicator (Colored) - 前景层，显示差异 */}
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

      {/* The "Structural Anchor" */}
      {market.structuralAnchor && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Structural Anchor: </span>
            {market.structuralAnchor}
          </p>
        </div>
      )}

      {/* Fallback: 如果没有structuralAnchor，使用aILogicSummary */}
      {!market.structuralAnchor && market.aILogicSummary && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Key Insight: </span>
            {market.aILogicSummary}
          </p>
        </div>
      )}

      {/* "Show Deep Reasoning" Button */}
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

      {/* Progressive Disclosure: Deep Dive (展开时显示) */}
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
