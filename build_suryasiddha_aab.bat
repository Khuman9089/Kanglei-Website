@echo off
setlocal
echo ========================================================
echo Building SuryaSiddha Release App Bundle (.aab)...
echo ========================================================

if exist "C:\Program Files\Android\Android Studio\jbr" (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
) else if exist "C:\Users\MayNard\.jdks\jbr-21.0.11" (
    set "JAVA_HOME=C:\Users\MayNard\.jdks\jbr-21.0.11"
)


echo [1/3] Syncing offline assets to Android app...
node "%~dp0scripts\sync_suryasiddha_assets.js"

echo.
echo [2/3] Compiling Android Release App Bundle (.aab) and APK...
cd /d "%~dp0android-twa"

call gradlew.bat bundleRelease assembleRelease

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] SuryaSiddha Built Successfully!
    echo.
    echo Google Play App Bundle (.aab):
    echo %~dp0android-twa\app\build\outputs\bundle\release\app-release.aab
    echo.
    echo Direct Installable APK:
    echo %~dp0android-twa\app\build\outputs\apk\release\app-release.apk
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo [ERROR] Build failed! Check above logs.
    echo ========================================================
)

pause

