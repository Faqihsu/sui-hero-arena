#!/bin/bash
# FORGE Token Verification Script
# Run this to verify the deployment is working

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "   FORGE Token Deployment Verification Script"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Addresses
PACKAGE_ID="0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654"
SWAP_POOL_ID="0xd3266c0006540933cba225a48d400d8495bb49e324405ed3d421d460a4a009c7"
TREASURY_CAP="0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f"

echo "1. Checking Sui CLI installation..."
if command -v sui &> /dev/null; then
    echo -e "${GREEN}✓ Sui CLI found${NC}"
else
    echo -e "${RED}✗ Sui CLI not found${NC}"
    exit 1
fi

echo ""
echo "2. Verifying network connection (testnet)..."
NETWORK=$(sui client envs | grep -A1 "testnet" | head -1)
if [[ $NETWORK == *"testnet"* ]]; then
    echo -e "${GREEN}✓ Connected to testnet${NC}"
else
    echo -e "${YELLOW}⚠ Not using testnet (current: $(sui client active-env))${NC}"
fi

echo ""
echo "3. Verifying Package exists..."
echo "Package ID: $PACKAGE_ID"
PACKAGE_EXISTS=$(sui client object $PACKAGE_ID 2>&1 | grep -c "Package ID" || true)
if [ $PACKAGE_EXISTS -gt 0 ]; then
    echo -e "${GREEN}✓ Package found on-chain${NC}"
else
    echo -e "${RED}✗ Package not found${NC}"
fi

echo ""
echo "4. Verifying SwapPool exists..."
echo "SwapPool ID: $SWAP_POOL_ID"
POOL_EXISTS=$(sui client object $SWAP_POOL_ID 2>&1 | grep -c "SwapPool" || true)
if [ $POOL_EXISTS -gt 0 ]; then
    echo -e "${GREEN}✓ SwapPool object found${NC}"
else
    echo -e "${RED}✗ SwapPool not found${NC}"
fi

echo ""
echo "5. Verifying Treasury Cap exists..."
echo "Treasury Cap ID: $TREASURY_CAP"
TREASURY_EXISTS=$(sui client object $TREASURY_CAP 2>&1 | grep -c "TreasuryCap" || true)
if [ $TREASURY_EXISTS -gt 0 ]; then
    echo -e "${GREEN}✓ Treasury Cap found${NC}"
else
    echo -e "${RED}✗ Treasury Cap not found${NC}"
fi

echo ""
echo "6. Getting current account address..."
CURRENT_ADDR=$(sui client active-address)
echo "Current address: $CURRENT_ADDR"

echo ""
echo "7. Checking account balance..."
BALANCE=$(sui client gas 2>/dev/null | grep "gas objects" | head -1 || echo "Could not retrieve balance")
echo $BALANCE

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   Verification Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Mint FORGE tokens:"
echo "   sui client call \\"
echo "     --package $PACKAGE_ID \\"
echo "     --module forge_token \\"
echo "     --function mint_and_transfer \\"
echo "     --args \"$TREASURY_CAP\" \"100000000000000000\" \\"
echo "     --gas-budget 10000000"
echo ""
echo "2. Initialize swap pool with FORGE:"
echo "   sui client call \\"
echo "     --package $PACKAGE_ID \\"
echo "     --module forge_swap \\"
echo "     --function init_pool_with_forge \\"
echo "     --args \"$SWAP_POOL_ID\" \"<FORGE_COIN_ID>\" \\"
echo "     --gas-budget 5000000"
echo ""
echo "3. Test swap:"
echo "   sui client call \\"
echo "     --package $PACKAGE_ID \\"
echo "     --module forge_swap \\"
echo "     --function swap_sui_for_forge \\"
echo "     --args \"$SWAP_POOL_ID\" \"<SUI_COIN_ID>\" \\"
echo "     --gas-budget 5000000"
echo ""
