# 周易摇卦 Android APK 构建指南

## 当前状态

✅ **已完成：**
- Web 应用已构建（`dist/` 目录）
- Capacitor Android 项目已同步（`android/app/src/main/assets/public/`）
- 移动端 UI 已完整适配（底部 Tab、安全区域、触控优化）

⚠️ **需要你提供：**
- 本机未安装 Android SDK 和 JDK，无法直接编译 APK

---

## 方案 A：在你自己的电脑上构建（推荐）

### 1. 安装 Android Studio

下载地址：https://developer.android.com/studio

安装时勾选：
- Android SDK
- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android SDK Command-line Tools

### 2. 配置环境变量

```bash
# 添加到系统环境变量
ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin
```

### 3. 构建 APK

```bash
# 克隆/复制项目到你的电脑
cd yijing-divination

# 安装依赖
npm install

# 构建 Web 资源
npm run build

# 同步到 Android 项目
npx cap sync android

# 构建 Debug APK
cd android
./gradlew assembleDebug

# APK 位置：android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 方案 B：使用在线构建服务

### 1. 使用 Appetize.io（在线模拟器）

访问 https://appetize.io/，上传 `android/` 文件夹的 zip 包，可在线预览。

### 2. 使用 Ionic Appflow（云端构建）

```bash
npm install @ionic/cli
ionic login
ionic cap build android --prod
```

---

## 方案 C：PWA 安装（立即可用）

你的手机 Chrome 浏览器支持 PWA，可以直接"安装"到桌面：

1. 将项目部署到任何静态托管（如 GitHub Pages、Vercel、Netlify）
2. 在手机 Chrome 中打开网址
3. 点击右上角 ⋮ → **添加到主屏幕**
4. 应用会以全屏模式运行，体验接近原生 APK

---

## 项目结构

```
yijing-divination/
├── android/                    # Android 原生项目
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/  # Web 资源（已同步）
│   │   │   └── java/...        # Java 源码
│   │   └── build.gradle        # 应用构建配置
│   ├── build.gradle            # 项目构建配置
│   └── settings.gradle
├── dist/                       # Web 构建产物
├── src/                        # React 源码
├── capacitor.config.ts         # Capacitor 配置
└── package.json
```

---

## 构建脚本（一键构建）

创建 `build-android.bat`：

```batch
@echo off
echo ===== 周易摇卦 Android APK 构建脚本 =====

echo [1/4] 安装依赖...
call npm install

echo [2/4] 构建 Web 资源...
call npm run build

echo [3/4] 同步到 Android 项目...
call npx cap sync android

echo [4/4] 构建 Debug APK...
cd android
call gradlew assembleDebug
cd ..

echo ===== 构建完成！ =====
echo APK 位置: android/app/build/outputs/apk/debug/app-debug.apk
pause
```

---

## 常见问题

### Q: 构建时报错 "SDK location not found"
A: 创建 `android/local.properties` 文件：
```properties
sdk.dir=C\:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

### Q: 如何生成 Release APK（发布版）？
A: 先签名，再构建：
```bash
# 生成密钥
keytool -genkey -v -keystore yijing-release.keystore -alias yijing -keyalg RSA -keysize 2048 -validity 10000

# 构建 Release
./gradlew assembleRelease
```

### Q: 如何修改应用名称和包名？
A: 编辑 `capacitor.config.ts`：
```typescript
appId: 'com.yijing.divination',  // 包名
appName: '周易摇卦',               // 应用名称
```

### Q: 如何添加应用图标？
A: 替换 `android/app/src/main/res/mipmap-*/ic_launcher.png` 系列文件。

---

## 下一步

1. **立即可用**：部署为 PWA，手机 Chrome 添加到主屏幕
2. **获取 APK**：在装有 Android Studio 的电脑上运行 `./gradlew assembleDebug`
3. **发布上线**：生成签名 Release APK，提交应用商店

需要我帮你做哪一步？
