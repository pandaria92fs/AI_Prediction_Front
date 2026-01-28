# Universal Predictor

一个基于 Next.js 的预测市场平台，支持从后端API获取数据并展示预测市场卡片。

## 功能特性

- 📊 预测市场卡片展示（支持多选项和Yes/No两种类型）
- 🏷️ 标签筛选功能
- 📄 分页支持
- 🔍 排序功能（按Volume或Liquidity）
- 📱 响应式设计，支持移动端和桌面端
- 🌙 深色模式支持
- 🔗 卡片详情页面

## 技术栈

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置后端 CORS（重要！）

前端直接访问后端 API，需要在后端配置 CORS。请参考 `BACKEND_CORS_SETUP.md` 文件中的详细配置说明。

**FastAPI 快速配置：**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Django 快速配置：**
```python
# settings.py
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True
```

### 3. 配置API地址

创建 `.env.local` 文件（如果不存在），并配置后端API地址：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:6000
```

如果不配置，默认使用 `http://localhost:6000`。

### 4. 配置标签映射

在 `app/page.tsx` 中，有一个 `TAG_NAME_TO_ID_MAP` 对象，用于将前端标签名称映射到后端的tagId。请根据你的后端API实际返回的标签数据来调整这个映射：

```typescript
const TAG_NAME_TO_ID_MAP: Record<string, string> = {
  'Politics': 'politics',
  'Crypto': '21',
  'Finance': '120',
  // ... 根据实际API返回的标签ID进行调整
};
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## API接口

应用需要后端提供以下两个接口：

### 1. 获取卡片列表

**接口**: `GET /card/list`

**参数**:
- `page`: 页码（默认: 1）
- `pageSize`: 每页数量（默认: 20）
- `tagId`: 标签ID（可选）
- `sortBy`: 排序字段 ("volume" | "liquidity", 可选)
- `order`: 排序方向 ("asc" | "desc", 可选)

### 2. 获取卡片详情

**接口**: `GET /card/details`

**参数**:
- `id`: 卡片ID

详细的数据结构定义请参考 `types/market.ts` 文件。

## 项目结构

```
universal_predictor/
├── app/
│   ├── page.tsx              # 主页面（列表页）
│   ├── card/[id]/page.tsx   # 卡片详情页
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局样式
├── components/
│   ├── Navbar.tsx           # 导航栏
│   ├── FilterTags.tsx       # 过滤标签组件
│   ├── MarketCard.tsx       # 市场卡片容器
│   ├── MultipleOptionCard.tsx  # 多选项卡片
│   ├── YesNoCard.tsx        # Yes/No卡片
│   └── Providers.tsx        # React Query Provider
├── lib/
│   ├── api.ts               # API服务函数
│   └── queryClient.ts      # React Query配置
└── types/
    └── market.ts            # TypeScript类型定义
```

## 卡片类型

应用支持两种卡片类型：

1. **多选项卡片**: 当卡片包含多个markets时，显示为多选项卡片，只显示概率，不显示Yes/No按钮
2. **Yes/No卡片**: 当卡片只包含一个market时，显示为Yes/No卡片，显示圆形进度条的chance，并保留Yes/No按钮

## 开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 注意事项

- **必须配置后端 CORS**：前端直接访问后端 API，后端必须正确配置 CORS，否则会出现跨域错误
- 确保后端API服务正在运行
- 根据实际后端返回的标签数据调整 `TAG_NAME_TO_ID_MAP` 映射
- 图片URL需要支持跨域访问（或配置Next.js的图片域名白名单）

## CORS 问题解决

如果遇到 CORS 错误：
1. **推荐方案**：在后端配置 CORS（见 `BACKEND_CORS_SETUP.md`）
2. **备选方案**：如果无法修改后端，可以使用 Next.js API 路由作为代理（见 `CORS_SOLUTION.md`）
