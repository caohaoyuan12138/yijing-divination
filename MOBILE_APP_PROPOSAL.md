# 周易摇卦 · 跨平台移动应用方案

> **面向平台**：iOS 15+ / Android 8.0+（API 26+）
> **技术选型**：Capacitor 6 + React 18 + TypeScript + Vite
> **应用包名**：`com.yijing.divination`
> **方案版本**：v1.0 · 2026-07-13

---

## 一、技术架构选型与论证

### 1.1 为什么选 Capacitor 而非 Flutter / React Native

| 维度 | Capacitor（推荐） | React Native | Flutter |
|------|-------------------|--------------|---------|
| 复用现有代码 | **100% 复用**（已有完整 Web 应用） | 需重写视图层，保留少量逻辑 | 需全部重写 |
| 上线周期 | 2-3 周出第一版 | 2-3 个月 | 3-4 个月 |
| 性能体验 | WebView 渲染，对占卜类应用**足够** | 原生渲染，更流畅 | 自绘引擎，最流畅 |
| 包体积 | ~15MB（含 WebView） | ~25MB（含 Hermes） | ~30MB（含 Skia） |
| 原生能力 | 通过 Plugin 桥接，生态丰富 | Native Module，需原生开发 | Platform Channel |
| 维护成本 | **低**（前端团队即可维护） | 中（需 RN 经验） | 高（需 Dart + 原生经验） |
| 离线能力 | 本地 HTML/JS/CSS 全离线 | 需额外Bundle策略 | 需额外资源管理 |

**结论**：周易摇卦属于内容交互型应用（非游戏/高频动画），Capacitor 是性价比最优解——直接用现有 React 代码打包为原生应用，两周内可出 MVP，包体积小，前端团队完全自主可控。

### 1.2 整体架构图

```
┌─────────────────────────────────────────────────┐
│                  原生层 (Native)                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │   iOS App     │  │  Android App  │             │
│  │  (WKWebView)  │  │ (WebView)     │             │
│  └──────┬───────┘  └──────┬───────┘             │
│         │      Capacitor    │                    │
│         └──── Bridge ───────┘                    │
│  ┌─────────────────────────────────────┐        │
│  │         Capacitor Plugins            │        │
│  │  ├─ StatusBar (状态栏)               │        │
│  │  ├─ SplashScreen (启动屏)            │        │
│  │  ├─ Haptics (震动反馈)               │        │
│  │  ├─ Share (系统分享)                 │        │
│  │  ├─ PushNotifications (推送)         │        │
│  │  ├─ Camera (相机/拍照)              │        │
│  │  ├─ LocalNotifications (本地通知)    │        │
│  │  └─ Browser (外部浏览器)            │        │
│  └─────────────────────────────────────┘        │
├─────────────────────────────────────────────────┤
│                 WebView 层                       │
│  ┌─────────────────────────────────────┐        │
│  │           React 18 应用              │        │
│  │  ├─ 路由 (React Router)              │        │
│  │  ├─ 状态管理 (Zustand)              │        │
│  │  ├─ UI 层 (Tailwind + 组件库)        │        │
│  │  ├─ 业务逻辑 (起卦/解卦/AI)           │        │
│  │  └─ 数据层 (IndexedDB / SQLite)      │        │
│  └─────────────────────────────────────┘        │
├─────────────────────────────────────────────────┤
│              后端服务层                           │
│  ├─ AI 解卦 API (DeepSeek)                      │
│  ├─ 搜索 API                                    │
│  └─ 用户数据同步 (可选)                          │
└─────────────────────────────────────────────────┘
```

### 1.3 核心技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Capacitor 6.2 | 跨平台容器 |
| 前端 | React 18.3 + TypeScript 5.6 | 现有代码复用 |
| 构建 | Vite 6 | 快速构建 |
| UI | Tailwind CSS 3.4 + 自定义响应式 | 移动端适配 |
| 状态 | Zustand 4.5 | 轻量状态管理（替代 useState 提升性能） |
| 存储 | Capacitor Preferences + IndexedDB | 用户偏好 / 历史记录 |
| 路由 | React Router 6 | 多页面导航 |
| 动画 | Framer Motion + CSS Animation | 铜钱摇卦动画 |
| 原生桥 | Capacitor Plugins | 状态栏、启动屏、震动、分享等 |

---

## 二、iOS / Android 平台适配策略

### 2.1 屏幕适配

```
移动端设计基准：
- 设计宽度：375px（iPhone SE / 标准安卓）
- 最大内容宽度：428px（横屏 / 平板）
- 安全区域：通过 safe-area-inset 适配刘海屏/挖孔屏
- 底部安全区：适配 Android 导航条 / Home Indicator
```

**关键适配点：**

- **Viewport 适配**：使用 `viewport-fit=cover` + CSS `env(safe-area-inset-*)`
- **顶部状态栏**：沉浸式（内容延伸到状态栏下方），状态栏文字颜色跟随主题
- **底部安全区**：所有底部按钮加 `pb-[env(safe-area-inset-bottom)]`
- **横屏限制**：默认仅允许竖屏（`android:screenOrientation="portrait"`）
- **字体缩放**：限制 `text-size-adjust: 100%`，防止系统字体放大导致布局错乱

### 2.2 导航架构（移动端改造）

当前 Web 应用是**单页长滚动**，移动端需改造为**多 Tab 底部导航**：

```
┌──────────────────────────────┐
│         顶部 Header           │
│   周易摇卦 · 当前页面标题      │
├──────────────────────────────┤
│                              │
│         页面内容区            │
│                              │
│                              │
│                              │
│                              │
├──────────────────────────────┤
│  🔮    📜    📖    🎮    👤  │
│  摇卦   历史   典籍   趣味   我的 │
└──────────────────────────────┘
```

**Tab 页面规划：**

| Tab | 图标 | 内容 | 对应现有组件 |
|-----|------|------|-------------|
| 摇卦 | 🔮 | 主功能：提问 + 摇卦 + 卦象展示 | App.tsx 主体 |
| 历史 | 📜 | 历史记录列表 + 搜索 + 收藏 | HistoryItem |
| 典籍 | 📖 | 周易经典文献阅读 | ClassicReadingPanel |
| 趣味 | 🎮 | 每日运势 + 小游戏 + 分享 | FunFeaturesPanel + DailyFortunePanel |
| 我的 | 👤 | 设置 / 主题 / 分享App / 关于 | 新增 |

### 2.3 平台差异处理

| 差异点 | iOS 方案 | Android 方案 |
|--------|----------|-------------|
| 返回手势 | 支持侧滑返回 | 支持物理/虚拟返回键 |
| 状态栏 | Dark/Light Style | StatusBar Plugin 控制 |
| SF Symbol / Icon | 使用 SF Symbols 风格图标 | Material Icons |
| 震动反馈 | Haptics Plugin（UIImpactFeedbackGenerator） | Haptics Plugin（VIBRATE 权限） |
| 分享 | UIActivityViewController（原生体验） | Android Sharesheet |
| 推送 | APNs（需 Apple Developer） | FCM（免费） |
| 支付 | App Store In-App Purchase | Google Play Billing |

### 2.4 Android 已有项目状态

当前 `android/` 目录已通过 `cap add android` 生成完整项目，包含：
- ✅ `AndroidManifest.xml`（已配置包名、权限）
- ✅ SplashScreen 全套分辨率资源
- ✅ MainActivity（Capacitor 默认）
- ✅ `capacitor-cordova-android-plugins`（桥接层）

**需要补充：**
- ⚠️ iOS 平台需通过 `cap add ios` 添加
- ⚠️ 配置 App Icon（各分辨率）
- ⚠️ 配置启动屏故事板（iOS）
- ⚠️ 添加所需权限声明（相机、通知等）

---

## 三、移动端原生功能扩展

### 3.1 核心功能扩展清单

#### 🪙 摇卦体验增强

| 功能 | 实现方式 | 用户体验 |
|------|----------|----------|
| **手机摇晃摇卦** | `MotionPlugin`（DeviceMotion） | 摇晃手机替代点击按钮，铜钱自动翻转 |
| **触感反馈** | `HapticsPlugin` | 摇卦时震动、铜钱落地时短震、成卦时长震 |
| **音效增强** | `NativeAudio` 插件 | 预加载音效，零延迟播放铜钱声 |
| **摇卦手势** | 触摸手势检测 | 屏幕上滑开始摇卦 |

#### 📤 分享功能增强

| 功能 | 实现方式 | 用户体验 |
|------|----------|----------|
| **原生系统分享** | `SharePlugin`（Capacitor Share） | 直接调起 iOS分享面板 / Android Sharesheet |
| **保存图片到相册`FilesystemPlugin` + `Photos` | 卦象图片直接保存到相册 |
| **生成分享海报** | `html2canvas` + 自定义模板 | 精美海报，含二维码引流 |
| **微信小程序分享** | 通过 URL Scheme / Universal Link | 分享到微信好友/朋友圈 |

#### 🔔 推送通知

| 功能 | 实现方式 | 用户体验 |
|------|----------|----------|
| **每日卦象提醒** | `PushNotificationsPlugin` | 每日固定时间推送"今日宜忌" |
| **时辰吉凶提醒** | `LocalNotificationsPlugin` | 基于用户设定的吉时提醒 |
| **历史记录同步** | 云端推送 | 新用户引导、功能更新提醒 |

#### 🎨 个性化

| 功能 | 实现方式 |
|------|----------|
| **动态主题** | 跟随系统 + 手动切换 |
| **深色模式** | 已有，需优化移动端对比度 |
| **主题色定制** | 周易五行主题（金木水火土） |
| **字体大小** | 跟随系统无障碍设置 |

#### 📷 特色功能

| 功能 | 实现方式 | 场景 |
|------|----------|------|
| **拍照测字** | `CameraPlugin` + OCR | 拍摄招牌/文字识别后测字 |
| **AR 卦象** | 可选（复杂度高，V2 考虑） | 增强现实展示卦象方位 |
| **语音提问** | Web Speech API + Native STT | 语音输入问题 |

### 3.2 Capacitor 插件清单

```json
{
  "dependencies": {
    "@capacitor/core": "^6.2.1",
    "@capacitor/ios": "^6.2.1",
    "@capacitor/android": "^6.1.2",
    "@capacitor/splash-screen": "^6.0.4",
    "@capacitor/status-bar": "^6.0.3",
    "@capacitor/haptics": "^6.0.0",
    "@capacitor/share": "^6.0.0",
    "@capacitor/push-notifications": "^6.0.0",
    "@capacitor/local-notifications": "^6.0.0",
    "@capacitor/camera": "^6.0.0",
    "@capacitor/filesystem": "^6.0.0",
    "@capacitor/preferences": "^6.0.0",
    "@capacitor/network": "^6.0.0",
    "@capacitor/device": "^6.0.0",
    "@capacitor/screen-orientation": "^6.0.0",
    "@capacitor-community/native-audio": "^5.0.0",
    "@capacitor-community/sqlite": "^6.0.0"
  }
}
```

### 3.3 数据存储策略

```
┌──────────────────────────────────────────┐
│              数据存储架构                   │
├──────────────────────────────────────────┤
│                                          │
│  ┌─────────────┐    ┌──────────────┐    │
│  │ Preferences  │    │  IndexedDB   │    │
│  │ (键值对)     │    │  (结构化数据) │    │
│  │             │    │              │    │
│  │ · 主题设置   │    │ · 摇卦历史   │    │
│  │ · 音效开关   │    │ · AI解读缓存 │    │
│  │ · 用户名    │    │ · 典籍收藏   │    │
│  │ · 上次登录   │    │ · 笔记数据   │    │
│  └─────────────┘    └──────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │         文件系统 (可选)            │    │
│  │  · 用户头像                        │    │
│  │  · 分享海报缓存                    │    │
│  │  · 离线资源包                      │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

---

## 四、性能优化策略

### 4.1 启动时间优化（目标：< 2 秒冷启动）

| 优化项 | 方案 | 预期收益 |
|--------|------|----------|
| **启动屏展示策略** | SplashScreen 显示至首帧渲染完成，再隐藏 | 提升感知速度 |
| **JS Bundle 拆分** | Vite 代码分割，按 Tab 懒加载 | 减少首屏 JS 40% |
| **资源预加载** | 关键图片/字体内联或 `preload` | 减少渲染阻塞 |
| **WebView 预热** | Android 使用 `WebView.startSafeBrowsing` | 加速 WebView 初始化 |
| **离线优先** | 所有前端资源打包到本地 | 零网络依赖启动 |
| **Tree Shaking** | 移除未使用的 Tailwind class | CSS 体积减半 |

### 4.2 运行时性能

| 优化项 | 方案 | 工具 |
|--------|------|------|
| **React 渲染优化** | `React.memo` + `useMemo` + `useCallback` | 避免不必要重渲染 |
| **列表虚拟化** | 历史记录使用 `react-window` | 仅渲染可见项 |
| **动画优化** | 使用 `transform`/`opacity`（GPU 加速），避免 `top/left` | Chrome DevTools |
| **图片优化** | WebP 格式 + 懒加载 + 占位符 | `loading="lazy"` |
| **内存管理** | 及时清理 `AbortController`、定时器、事件监听 | Memory Profiler |

### 4.3 电池与网络优化

```
电池优化：
├── 减少后台 Activity（App 进入后台暂停动画）
├── 降低帧率（静态页面 30fps，动画页面 60fps）
├── 减少 GPS 使用（不主动定位，依赖手动选择城市）
└── 深色模式节省 OLED 屏幕电量

网络优化：
├── AI 响应流式传输（Streaming），无需等待完整响应
├── 历史数据本地缓存，网络恢复后批量同步
├── 图片压缩（WebP 质量 80%）
├── API 请求合并（搜索 + AI 可并行但不可串行）
└── 智能重试策略（指数退避）
```

### 4.4 包体积预算

| 组成 | 目标大小 |
|------|----------|
| JS Bundle（压缩后） | < 500KB |
| CSS（PurgeCSS 后） | < 80KB |
| 图片资源 | < 2MB |
| 字体（子集化） | < 300KB |
| **WebView 总资源** | **< 3MB** |
| 原生壳 + 插件 | ~12MB |
| **安装包总体积** | **< 15MB** |

---

## 五、App Store / Google Play 上架策略

### 5.1 应用信息

| 项目 | 内容 |
|------|------|
| **应用名称** | 周易摇卦 · 六爻占卜 |
| **副标题** | 三枚铜钱 · 六爻成卦 · 趋吉避凶 |
| **关键词** | 周易, 摇卦, 占卜, 六爻, 八卦, 命理, 运势, 算命, 玄学, 易经 |
| **分类** | 生活 / Lifestyle（iOS）· 生活（Android） |
| **年龄分级** | 12+（无暴力恐怖内容，纯文化工具） |
| **定价** | 免费下载 + 内购（高级 AI 解读） |
| **隐私政策** | 需要（收集数据：无强制，仅本地存储） |

### 5.2 商业模式

```
免费版：
├── 基础摇卦（金钱卦、数字卦、时间卦）
├── 每日 3 次 AI 解卦
├── 基础卦象展示
└── 历史记录保存

高级版（订阅制 ¥18/月 或 ¥98/年）：
├── 无限 AI 解卦
├── 全部起卦方式（方位卦、测字卦、姓名卦）
├── AI 追问对话
├── 五行深度分析
├── 专属卦象报告
├── 每日运势定制推送
└── 云同步历史记录

一次性购买（¥30）：
└── 去广告（如有广告位）
```

### 5.3 两大商店审核注意点

#### iOS App Store
- ✅ 必须提供**隐私政策 URL**
- ✅ 需要**ICP备案号**（中国区上架必须）
- ⚠️ "占卜" 类应用可能被拒，定位为**传统文化工具**而非"算命"
- ⚠️ 内购必须使用 Apple IAP（不可跳转第三方支付）
- ⚠️ 年龄分级如实填写，避免误导用户
- 📸 提供优质截图（6.5" + 5.5" 两套）

#### Google Play
- ✅ 相对宽松，占卜类应用可上架
- ⚠️ 需提供数据安全保障声明
- ⚠️ 应用签名（Upload Key）妥善保管
- 📸 提供 Phone + 7" + 10" 截图各至少 3 张

### 5.4 ASO 优化

- **标题**：核心关键词前置
- **描述**：突出"传统文化 + AI 智能解读 + 多种起卦方式"
- **截图**：展示核心功能界面 + AI 解读效果
- **视频**：15-30 秒录屏展示摇卦全流程

---

## 六、开发路线图与里程碑

### Phase 1：基础适配（第 1-2 周）

```
Week 1:
├── [Day 1]  添加 iOS 平台支持（cap add ios）
├── [Day 1]  移动端响应式改造（视口、安全区域）
├── [Day 2]  底部 Tab 导航架构搭建
├── [Day 3]  状态管理迁移到 Zustand
├── [Day 4]  历史记录 IndexedDB 重构
└── [Day 5]  路由系统搭建（React Router）

Week 2:
├── [Day 1]  摇卦页面移动端交互优化
├── [Day 2]  横屏锁定 + 状态栏沉浸
├── [Day 3]  启动屏配置（iOS/Android）
├── [Day 4]  应用图标替换（各分辨率）
├── [Day 5]  基础测试 + Bug 修复
└── ✅ M1 里程碑：可在手机上完整运行所有功能
```

### Phase 2：原生能力集成（第 3-4 周）

```
Week 3:
├── [Day 1]  震动反馈集成（摇卦触感）
├── [Day 2]  音频预加载（零延迟摇卦音效）
├── [Day 3]  系统原生分享（文字+图片）
├── [Day 4]  安装包签名 + 内测分发
└── [Day 5]  内部 TestFlight / Firebase App Distribution 分发

Week 4:
├── [Day 1]  震动音效组合体验调优
├── [Day 2]  历史记录云同步（可选）
├── [Day 3]  性能优化（启动速度、内存）
├── [Day 4]  UI 微调 + 动画优化
├── [Day 5]  Beta 测试 + 用户反馈收集
└── ✅ M2 里程碑：原生功能完整，体验流畅
```

### Phase 3：高级功能 + 上架（第 5-7 周）

```
Week 5:
├── [Day 1]  拍照测字（Camera + OCR）
├── [Day 2]  本地通知（每日卦象提醒）
├── [Day 3]  语音输入问题
├── [Day 4]  分享海报生成优化
└── [Day 5]  主题色定制（五行主题）

Week 6:
├── [Day 1]  应用内购集成（iOS IAP + Google Play Billing）
├── [Day 2]  付费墙 UI/UX
├── [Day 3]  多语言支持（中英双语）
├── [Day 4]  无障碍适配（VoiceOver / TalkBack）
└── [Day 5]  全机型兼容性测试

Week 7:
├── [Day 1]  隐私政策 + 用户协议
├── [Day 2]  应用截图制作 + 预览视频
├── [Day 3]  提交 TestFlight 审核
├── [Day 4]  提交 Google Play 审核
├── [Day 5]  准备上线物料 + 推广文案
└── ✅ M3 里程碑：应用已上架，正式对外发布
```

### Phase 4：持续迭代（上线后）

```
V1.1 (第 8-10 周)：
├── 基于用户反馈的 UI 优化
├── 微信/朋友圈分享优化
└── 性能数据监控接入（Crashlytics）

V1.2 (第 11-14 周)：
├── AI 解读质量优化
├── 新增"每日一卦"功能
└── 社交功能（卦象社区、好友对比）

V1.3 (第 15-18 周)：
├── AR 卦象展示（可选）
├── 穿戴设备支持（Apple Watch / Wear OS）
└── 海外版本（多语言扩展）
```

---

## 七、风险评估与应对

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| iOS 审核被拒（占卜类敏感） | 中 | 高 | 定位为"传统文化学习工具"，弱化占卜措辞 |
| 用户隐私合规 | 中 | 高 | 仅本地存储，最小化数据收集，提供隐私政策 |
| 低端机型 WebView 性能差 | 中 | 中 | 做性能测试，低端机降级动画、减少特效 |
| AI API 成本高 | 中 | 中 | 本地缓存相同问题结果，限流免费用户 |
| 竞品出现 | 低 | 高 | 持续迭代，建立用户社区壁垒 |
| Apple 政策变化 | 低 | 高 | 保持技术栈灵活，必要时可转 React Native |

---

## 八、团队与资源需求

| 角色 | 人数 | 职责 | 周期 |
|------|------|------|------|
| 前端工程师 | 1-2 人 | React 移动端适配、UI 优化 | 全程 |
| iOS 开发 | 0.5 人 | Capacitor 配置、审核跟进 | Phase 1-3 |
| Android 开发 | 0.5 人 | Capacitor 配置、打包 | Phase 1-3 |
| UI/UX 设计师 | 0.5 人 | 移动端设计规范、应用图标 | Phase 1 |
| 测试 | 0.5 人 | 多机型兼容性测试 | Phase 2-3 |
| 运营/ASO | 0.5 人 | 商店物料、推广策略 | Phase 3 |

**预估总工时：** 约 6-8 人周（MVP 到上架）
**开发成本：** 以 1 名全栈前端为主力，配合零星原生支持

---

## 九、总结

### 核心策略

> **以 Capacitor 为桥，100% 复用现有 React 代码，通过增量增强原生体验，目标 7 周内完成从 Web 应用到双平台上线的全流程。**

### 即刻可执行的第一步

```bash
# 1. 添加 iOS 平台（立即可做）
npx cap add ios

# 2. 安装核心插件
npm install @capacitor/haptics @capacitor/share \
  @capacitor/push-notifications @capacitor/local-notifications \
  @capacitor/camera @capacitor/preferences

# 3. 构建并同步
npm run build && npx cap sync

# 4. 在 Xcode 中打开 iOS 项目
npx cap open ios

# 5. 在 Android Studio 中打开（已有）
npx cap open android
```

---

**方案制定：** Mobile App Builder
**日期：** 2026-07-13
**状态：** 待评审确认
