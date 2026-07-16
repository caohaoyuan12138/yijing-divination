@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
set ANDROID_HOME=C:\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest bin;%ANDROID_HOME%\platform-tools;%PATH%

echo Installing Android SDK...
echo.

echo Accepting licenses...
yes | sdkmanager --licenses

echo Installing platform-tools...
sdkmanager platform-tools

echo Installing platforms;android-34...
sdkmanager "platforms;android-34"

echo Installing build-tools;34.0.0...
sdkmanager "build-tools;34.0.0"

echo.
echo === Done ===
echo.
echo Platforms:
dir /B "%ANDROID_HOME%\platforms" 2>nul
echo.
echo Build-Tools:
dir /B "%ANDROID_HOME%\build-tools" 2>nul
pause