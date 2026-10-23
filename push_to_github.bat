@echo off
echo ========================================================
echo  MITHRA KHANTH S // PUSHING 3D PORTFOLIO TO GITHUB
echo ========================================================

git remote remove origin 2>nul
git remote add origin https://github.com/mithrakhanth5/portfolio.git
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Pushed to https://github.com/mithrakhanth5/portfolio
    echo ========================================================
    echo.
    echo Next: Go to https://github.com/mithrakhanth5/portfolio/settings/pages
    echo Set Source to 'Deploy from a branch' and select branch 'main'.
    start https://github.com/mithrakhanth5/portfolio/settings/pages
) else (
    echo.
    echo If repository name is different, run:
    echo git remote set-url origin https://github.com/mithrakhanth5/YOUR_REPO_NAME.git
    echo git push -u origin main
)
pause
