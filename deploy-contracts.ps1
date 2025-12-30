#!/usr/bin/env pwsh
# Smart Contract Deployment Script
# Usage: ./deploy-contracts.ps1

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Green
Write-Host "Sui Hero Arena - Smart Contract Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check Sui CLI
Write-Host "`n[1/5] Checking Sui CLI..." -ForegroundColor Cyan
try {
    $suiVersion = sui --version
    Write-Host "✓ Sui CLI found: $suiVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Sui CLI not found! Please install Sui CLI first." -ForegroundColor Red
    exit 1
}

# Check wallet
Write-Host "`n[2/5] Checking wallet..." -ForegroundColor Cyan
$activeAddr = sui client active-address
$activeEnv = sui client active-env
Write-Host "✓ Active wallet: $activeAddr" -ForegroundColor Green
Write-Host "✓ Active network: $activeEnv" -ForegroundColor Green

# Deploy Coin Contract
Write-Host "`n[3/5] Deploying Coin Contract..." -ForegroundColor Cyan
$coinPath = "d:\sui-move-workshop\d1\coin"
Set-Location $coinPath
$coinOutput = sui client publish --gas-budget 50000000 2>&1
Write-Host $coinOutput

# Extract Package ID from output
if ($coinOutput -match "Package ID: 0x([a-f0-9]+)") {
    $coinPackageId = "0x" + $Matches[1]
    Write-Host "✓ Coin Package ID: $coinPackageId" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to extract Coin Package ID" -ForegroundColor Red
}

# Deploy Hero Contract
Write-Host "`n[4/5] Deploying Hero Contract..." -ForegroundColor Cyan
$heroPath = "d:\sui-move-workshop\d1\sui_hero"
Set-Location $heroPath
$heroOutput = sui client publish --gas-budget 50000000 2>&1
Write-Host $heroOutput

if ($heroOutput -match "Package ID: 0x([a-f0-9]+)") {
    $heroPackageId = "0x" + $Matches[1]
    Write-Host "✓ Hero Package ID: $heroPackageId" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to extract Hero Package ID" -ForegroundColor Red
}

# Deploy Marketplace Contract
Write-Host "`n[5/5] Deploying Marketplace Contract..." -ForegroundColor Cyan
$marketplacePath = "d:\sui-move-workshop\d1\sui-hero-arena\contracts\hero_marketplace"
Set-Location $marketplacePath
$marketplaceOutput = sui client publish --gas-budget 100000000 2>&1
Write-Host $marketplaceOutput

if ($marketplaceOutput -match "Package ID: 0x([a-f0-9]+)") {
    $marketplacePackageId = "0x" + $Matches[1]
    Write-Host "✓ Marketplace Package ID: $marketplacePackageId" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to extract Marketplace Package ID" -ForegroundColor Red
}

# Summary
Write-Host "`n================================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host "`n📋 Copy these IDs to src/config/contract.ts:`n" -ForegroundColor Yellow
if ($coinPackageId) { Write-Host "Coin Package ID:       $coinPackageId" -ForegroundColor Cyan }
if ($heroPackageId) { Write-Host "Hero Package ID:       $heroPackageId" -ForegroundColor Cyan }
if ($marketplacePackageId) { Write-Host "Marketplace Package ID: $marketplacePackageId" -ForegroundColor Cyan }

Write-Host "`n✓ Also get these from the transaction output:" -ForegroundColor Yellow
Write-Host "  - Marketplace Admin Object ID" -ForegroundColor Gray
Write-Host "  - FORGE Treasury Cap ID" -ForegroundColor Gray
Write-Host "  - Swap Pool Object ID" -ForegroundColor Gray

Write-Host "`n🚀 Next: npm run dev" -ForegroundColor Green
