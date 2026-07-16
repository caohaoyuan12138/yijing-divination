# 周易摇卦 - 免费公网部署指南

## 方式一：Cloudflare Pages（推荐）

完全免费，无限带宽，支持 API 代理。

### 前置条件
1. [注册 Cloudflare 账号](https://dash.cloudflare.com/sign-up)
2. 将项目推送到 GitHub（私有仓库即可）

### 部署步骤

```bash
# 1. 在项目根目录初始化 Git
git init
git add .
git commit -m "init: yijing divination app"

# 2. 推送到 GitHub
# 在 GitHub 新建仓库后执行：
git remote add origin https://github.com/你的用户名/yijing-divination.git
git push -u origin main
```

### 3. Cloudflare Pages 配置
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Pages** → **创建项目** → **连接到 Git**
3. 授权 GitHub，选择 `yijing-divination` 仓库
4. 填写构建设置：

| 配置项 | 值 |
|--------|-----|
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 根目录 | （留空） |
| Node.js 版本 | 18 或更高 |

### 4. 设置环境变量（重要）

在 Cloudflare Pages 项目设置 → **环境变量** 中添加：

| 变量名 | 值 |
|--------|-----|
| `AI_API_KEY` | `sk-KufhdOMiyBDKpPjItLWFwmn6rnABQLdv` |
| `SEARCH_API_KEY` | `as_sk_3bb84be950b3d94301b14206d1e97323` |

> ⚠️ 不要把这些 key 提交到 Git！Cloudflare 的环境变量会安全地注入到 Functions 中。

### 5. 部署
- 配置完成后点击 **保存并部署**
- 首次部署约 1-2 分钟
- 部署完成后会得到一个 `<项目名>.pages.dev` 域名

### 6. 绑定自定义域名（可选）
- Pages 项目 → **自定义域** → **设置自定义域**
- 输入你的域名，Cloudflare 会自动配置 DNS

---

## 方式二：Vercel（更简单）

不需要创建 Functions 文件，但需要处理 API 代理。

### 步骤
1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目根目录执行 `vercel`
3. 按提示登录并部署

### API 代理处理
Vercel 不支持直接转发带 Authorization header 的请求。
需要在项目根创建 `api/ai.js` 作为 Serverless Function。

但最简单的方式是：**让前端直接调用 API**（API key 会暴露在 JS 中）。

---

## 方式三：Railway（基于 Node.js）

需要写一个简单的 Express 服务器，同时提供静态文件和 API 代理。

### 步骤
1. 在项目根目录创建 `server.js`
2. Railway 免费额度：$5/月，够用

---

## 手机 APP 调用方案

### 方案 A：PWA（最简单，推荐）
项目已经配置了 PWA（`manifest.json`）：
1. 部署完成后，用户在浏览器打开域名
2. 浏览器会提示"添加到主屏幕"
3. 添加后就像原生 APP 一样使用

### 方案 B：Capacitor Android APK
项目已经配置了 Capacitor：

```bash
# 确保 Android SDK 已安装
# 1. 构建前端
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 修改配置指向云端
# 编辑 capacitor.config.ts，将 server.url 设为你的部署域名

# 4. 打开 Android Studio 构建 APK
npx cap open android
```

### 方案 C：修改 APP 直接调用云端 API

无需修改代码。`AiAnalysisPanel.tsx` 已内置 Native 模式支持：
- Web 模式：`/api/ai/...` → Cloudflare Function 代理
- Native 模式：直接调用 `AI_API_BASE`（通过环境变量）

---

## 部署后验证清单

- [ ] 首页正常打开，样式完整
- [ ] 开始摇卦正常
- [ ] AI 解读正常生成（测试 Functions 代理）
- [ ] PWA 添加到主屏幕正常
- [ ] HTTPS 证书自动生效