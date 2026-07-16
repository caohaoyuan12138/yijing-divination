@echo off
chcp 65001 >nul 2>&1
echo ============================================
echo  周易摇卦 - Android 环境配置脚本
echo ============================================
echo.

REM 检查 JDK
java -version 2>nul
if %errorlevel% neq 0 (
    echo 错误: JDK 未安装，请先安装 JDK 17
    pause
    exit /b 1
)
echo [OK] JDK 已安装

REM 设置环境变量
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
if not exist "%JAVA_HOME%" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17"
)
echo JAVA_HOME = %JAVA_HOME%

REM 设置 Android SDK 路径
set "ANDROID_HOME=C:\Android\Sdk"
if not exist "%ANDROID_HOME%" (
    mkdir "%ANDROID_HOME%" 2>nul
)
echo ANDROID_HOME = %ANDROID_HOME%

REM 写入 local.properties
echo sdk.dir=%ANDROID_HOME% > android\local.properties
echo [OK] 已写入 android/local.properties

echo.
echo 环境配置完成！
echo.
echo 下一步:
echo   1. 安装 Android SDK (platform-tools, build-tools)
echo   2. 构建 APK: npm run build && npx cap sync android
echo.
pause