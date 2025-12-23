@echo off
REM Script to mint 100M FORGE tokens to deployer address using Sui CLI
REM
REM Package: 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
REM Treasury Cap: 0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
REM Recipient: 0xa18380b53746d7b334fcc58f43c27f35a8318ed0af15a4fb572734b342f9c412
REM Amount: 100,000,000 FORGE (10,000,000,000,000,000 in base units with 8 decimals)

setlocal enabledelayedexpansion

set PACKAGE_ID=0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
set TREASURY_CAP=0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
set RECIPIENT=0xa18380b53746d7b334fcc58f43c27f35a8318ed0af15a4fb572734b342f9c412
set AMOUNT=10000000000000000

echo.
echo ======================================
echo   FORGE Token Mint to Deployer
echo ======================================
echo.
echo Package ID:    %PACKAGE_ID%
echo Treasury Cap:  %TREASURY_CAP%
echo Recipient:     %RECIPIENT%
echo Amount:        100,000,000 FORGE
echo.

REM Check if sui cli is available
where sui >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Sui CLI not found. Please install Sui CLI first.
    echo Install from: https://github.com/MystenLabs/sui
    exit /b 1
)

echo Executing transaction...
echo.

REM Execute the transaction using Sui CLI
sui client call ^
    --package %PACKAGE_ID% ^
    --module forge_token ^
    --function mint_and_transfer ^
    --args %TREASURY_CAP% %AMOUNT% ^
    --gas-budget 10000000

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo ✓ SUCCESS: Tokens minted!
    echo ======================================
    echo.
    echo Address: %RECIPIENT%
    echo Explorer: https://suiscan.xyz/testnet/account/%RECIPIENT%
    echo.
) else (
    echo.
    echo ERROR: Transaction failed!
    exit /b 1
)

endlocal
