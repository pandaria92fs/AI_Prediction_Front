# CORS 问题解决方案

## 问题说明

你遇到的错误是 **CORS（跨域资源共享）** 问题。当前端（运行在 `localhost:3000`）尝试直接访问后端API（运行在 `localhost:6000`）时，浏览器会阻止这个跨域请求。

## 解决方案

我已经实现了 **方案2：使用 Next.js API 路由作为代理**，这是最快速的解决方案，无需修改后端代码。

### 工作原理

1. 前端不再直接访问 `http://localhost:6000/card/list`
2. 而是访问同源的 Next.js API 路由：`/api/card/list`
3. Next.js API 路由在服务器端转发请求到后端
4. 由于服务器端请求不受CORS限制，可以正常访问后端

### 文件结构

```
app/
├── api/
│   └── card/
│       ├── list/
│       │   └── route.ts      # 列表接口代理
│       └── details/
│           └── route.ts      # 详情接口代理
```

### 已更新的文件

1. **`app/api/card/list/route.ts`** - 列表接口代理
2. **`app/api/card/details/route.ts`** - 详情接口代理
3. **`lib/api.ts`** - 更新为使用 Next.js API 路由

## 使用方法

现在你的代码已经配置好了，直接运行即可：

```bash
npm run dev
```

前端会自动通过 `/api/card/list` 和 `/api/card/details` 访问后端，不会再出现CORS错误。

## 环境变量

确保你的 `.env.local` 文件（如果存在）中配置了正确的后端地址：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:6000
```

如果不配置，默认使用 `http://localhost:6000`。

## 替代方案：在后端配置 CORS

如果你可以修改后端代码，也可以在后端配置CORS。以下是常见框架的配置方法：

### FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Django (Python)

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# 或者安装 django-cors-headers
# pip install django-cors-headers
```

### Express.js (Node.js)

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

## 验证

启动开发服务器后，打开浏览器开发者工具，你应该看到：

- ✅ 请求发送到 `/api/card/list`（同源，无CORS问题）
- ✅ 数据正常返回
- ❌ 不再出现 CORS 错误
