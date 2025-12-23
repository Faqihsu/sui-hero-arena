@echo off
REM FORGE Token Verification Script (Windows)
REM Run this to verify the deployment is working

setlocal enabledelayedexpansion

echo ============================================================
echo    FORGE Token Deployment Verification Script
echo ============================================================
echo.

REM Addresses
set PACKAGE_ID=0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
set SWAP_POOL_ID=0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7
set TREASURY_CAP=0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f

echo 1. Checking Sui CLI installation...
where sui >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Sui CLI found
) else (
    echo [ERROR] Sui CLI not found
    exit /b 1
)

echo.
echo 2. Verifying network connection (testnet)...
for /f "tokens=*" %%A in ('sui client active-env') do set CURRENT_ENV=%%A
if "%CURRENT_ENV%"=="testnet" (
    echo [OK] Connected to testnet
) else (
    echo [WARNING] Current environment: %CURRENT_ENV%
)

echo.
echo 3. Verifying Package exists...
echo Package ID: %PACKAGE_ID%
sui client object %PACKAGE_ID% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Package found on-chain
) else (
    echo [ERROR] Package not found
)

echo.
echo 4. Verifying SwapPool exists...
echo SwapPool ID: %SWAP_POOL_ID%
sui client object %SWAP_POOL_ID% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] SwapPool object found
) else (
    echo [ERROR] SwapPool not found
)

echo.
echo 5. Verifying Treasury Cap exists...
echo Treasury Cap ID: %TREASURY_CAP%
sui client object %TREASURY_CAP% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Treasury Cap found
) else (
    echo [ERROR] Treasury Cap not found
)

echo.
echo 6. Getting current account address...
for /f "tokens=*" %%A in ('sui client active-address') do set CURRENT_ADDR=%%A
echo Current address: %CURRENT_ADDR%

echo.
echo 7. Checking account balance...
sui client gas >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Can retrieve gas coins
) else (
    echo [WARNING] Could not retrieve balance
)

echo.
echo ============================================================
echo    Verification Complete!
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Mint FORGE tokens:
echo    sui client call ^
echo      --package %PACKAGE_ID% ^
echo      --module forge_token ^
echo      --function mint_and_transfer ^
echo      --args "%TREASURY_CAP%" "100000000000000000" ^
echo      --gas-budget 10000000
echo.
echo 2. Initialize swap pool with FORGE:
echo    sui client call ^
echo      --package %PACKAGE_ID% ^
echo      --module forge_swap ^
echo      --function init_pool_with_forge ^
echo      --args "%SWAP_POOL_ID%" "^<FORGE_COIN_ID^>" ^
echo      --gas-budget 5000000
echo.
echo 3. Test swap:
echo    sui client call ^
echo      --package %PACKAGE_ID% ^
echo      --module forge_swap ^
echo      --function swap_sui_for_forge ^
echo      --args "%SWAP_POOL_ID%" "^<SUI_COIN_ID^>" ^
echo      --gas-budget 5000000
echo.
echo.
pause
