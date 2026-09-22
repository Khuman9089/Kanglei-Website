@echo off
setlocal
echo ========================================================
echo Building SuryaSiddha Release App Bundle (.aab)...
echo ========================================================

set JAVA_HOME=C:\Users\MayNard\.jdks\jbr-21.0.11
cd /d "%~dp0android-twa"

call gradlew.bat bundleRelease

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] App Bundle built successfully!
    echo Output: %~dp0android-twa\app\build\outputs\bundle\release\app-release.aab
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo [ERROR] Build failed! Check above logs.
    echo ========================================================
)

pause
