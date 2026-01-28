# 后端 CORS 配置指南（最佳实践）

## 推荐方案：在后端配置 CORS

这是标准的、最佳实践的做法。配置后，前端可以直接访问后端 API，无需通过 Next.js 代理。

---

## FastAPI 配置

### 1. 安装依赖（如果还没有）

```bash
pip install fastapi uvicorn
```

### 2. 在 FastAPI 应用中添加 CORS 中间件

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js 开发服务器
        "http://localhost:3001",  # 如果有其他端口
        # 生产环境添加你的域名，例如：
        # "https://yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法，或指定 ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],   # 允许所有请求头，或指定需要的头部
)

# 你的路由
@app.get("/card/list")
async def get_card_list():
    # 你的代码
    pass

@app.get("/card/details")
async def get_card_details(id: str):
    # 你的代码
    pass
```

### 3. 更安全的配置（推荐生产环境）

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# 从环境变量读取允许的来源
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Total-Count"],  # 如果需要暴露自定义头部
)
```

---

## Django 配置

### 1. 安装 django-cors-headers

```bash
pip install django-cors-headers
```

### 2. 在 `settings.py` 中配置

```python
# settings.py

INSTALLED_APPS = [
    # ... 其他应用
    'corsheaders',
    # ... 其他应用
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 必须放在最前面
    'django.middleware.common.CommonMiddleware',
    # ... 其他中间件
]

# CORS 配置
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    # 生产环境添加：
    # "https://yourdomain.com",
]

# 或者允许所有来源（仅开发环境）
# CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ 生产环境不要使用

# 允许携带凭证（cookies, authorization headers）
CORS_ALLOW_CREDENTIALS = True

# 允许的 HTTP 方法
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# 允许的请求头
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### 3. 更灵活的配置（使用环境变量）

```python
# settings.py
import os

# 开发环境允许所有来源，生产环境限制特定域名
if os.getenv('ENVIRONMENT') == 'development':
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = [
        "https://yourdomain.com",
        "https://www.yourdomain.com",
    ]
```

---

## 验证配置

配置完成后，重启后端服务，然后在前端测试：

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 刷新页面或触发 API 请求
4. 检查请求：
   - ✅ 状态码应该是 200
   - ✅ 响应头应该包含 `Access-Control-Allow-Origin: http://localhost:3000`
   - ❌ 不应该有 CORS 错误

---

## 测试 CORS 配置

你可以使用 curl 测试：

```bash
# 测试 OPTIONS 预检请求
curl -X OPTIONS http://localhost:6000/card/list \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v

# 应该看到响应头包含：
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Methods: GET, POST, ...
```

---

## 生产环境注意事项

1. **不要使用 `allow_origins=["*"]`** - 这会允许任何网站访问你的 API
2. **明确指定允许的域名** - 只允许你的前端域名
3. **使用 HTTPS** - 生产环境必须使用 HTTPS
4. **限制允许的方法和头部** - 只允许实际需要的 HTTP 方法和请求头

---

## 配置完成后

配置完成后，你可以：
1. 删除 Next.js API 代理路由（`app/api/card/` 目录）
2. 更新前端代码直接访问后端（见下面的代码更新）
