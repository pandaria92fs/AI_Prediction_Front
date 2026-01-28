import { ApiResponse, CardListResponse, CardListParams, Card, CardDetailsParams } from '@/types/market';

// 获取API基础URL
// 优先使用环境变量，如果没有则使用默认地址
function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8081';
}

const API_BASE_URL = getApiBaseUrl();

// 默认请求头
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// 获取卡片列表
export async function getCardList(params: CardListParams = {}): Promise<ApiResponse<CardListResponse>> {
  // 构建查询参数
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page || 1));
  searchParams.set('pageSize', String(params.pageSize || 20));
  if (params.tagId) searchParams.set('tagId', params.tagId);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.order) searchParams.set('order', params.order);

  // 直接访问后端API
  const url = `${API_BASE_URL}/card/list?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch card list: ${response.statusText}`);
  }

  return response.json();
}

// 获取卡片详情
export async function getCardDetails(params: CardDetailsParams): Promise<ApiResponse<Card>> {
  // 构建查询参数
  const searchParams = new URLSearchParams();
  searchParams.set('id', params.id);

  // 直接访问后端API
  const url = `${API_BASE_URL}/card/details?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch card details: ${response.statusText}`);
  }

  return response.json();
}
