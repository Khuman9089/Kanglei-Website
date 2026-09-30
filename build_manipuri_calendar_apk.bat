@echo off
setlocal
echo ========================================================
echo Building Manipuri Calendar Offline Android App...
echo Package: com.kangleiastro.manipuricalendar
echo ========================================================

REM 1. Prepare offline web assets
echo [1/3] Bundling offline assets from /app...
call node "%~dp0scripts\build_offline_mobile.js"

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to bundle offline web assets!
    pause
    exit /b %ERRORLEVEL%
)

REM 2. Set Java environment
if exist "C:\Users\MayNard\.jdks\jbr-21.0.11" (
    set "JAVA_HOME=C:\Users\MayNard\.jdks\jbr-21.0.11"
)

REM 3. Build Android Release APK and Bundle
cd /d "%~dp0android"

echo [2/3] Building Release APK (.apk)...
call gradlew.bat assembleRelease

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Gradle build failed! Check errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Building Release App Bundle (.aab) for Google Play...
call gradlew.bat bundleRelease

echo.
echo ========================================================
echo [SUCCESS] Offline Android Build Complete!
echo.
echo Release APK:
echo %~dp0android\app\build\outputs\apk\release\app-release.apk
echo.
echo Play Store App Bundle (.aab):
echo %~dp0android\app\build\outputs\bundle\release\app-release.aab
echo ========================================================
pause
