// 后端API类型定义

// Tag类型
export interface Tag {
  id: string;
  label: string;
  slug: string;
}

// Market类型（子市场）
export interface Market {
  id: string;
  question: string;
  groupItemTitle: string; // 用于在card上显示的标题，替代question
  startDate: string;
  endDate: string;
  icon: string;
  active: boolean;
  volume: number;
  liquidity: number;
  probability: number; // 0-1之间
  adjustedProbability: number; // 0-1之间
  tagIds: string[];
  percentageChange?: number; // 百分比变化（可选，如果后端有的话）
}

// Card类型（卡片）
export interface Card {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  active: boolean;
  volume: number;
  liquidity: number;
  icon: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  markets: Market[];
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 列表响应
export interface CardListResponse {
  total: number;
  page: number;
  pageSize: number;
  list: Card[];
}

// 列表请求参数
export interface CardListParams {
  page?: number;
  pageSize?: number;
  tagId?: string;
  sortBy?: 'volume' | 'liquidity';
  order?: 'asc' | 'desc';
}

// 详情请求参数
export interface CardDetailsParams {
  id: string;
}

// 前端使用的过滤标签（用于筛选）
export type FilterTag = 
  | 'Politics'
  | 'Crypto'
  | 'Finance'
  | 'Geopolitics'
  | 'Earnings'
  | 'Tech'
  | 'Culture'
  | 'World'
  | 'Economy'
  | 'Climate & Science'
  | 'Elections'
  | 'Mentions';
