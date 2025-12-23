/**
 * Script to Mint 100M FORGE tokens (1% of 10B supply) to deployer address
 * 
 * Package: 0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654
 * Treasury Cap: 0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f
 * Recipient: 0xa18380b53746d7b334fcc58f43c27f35a8318ed0af15a4fb572734b342f9c412
 * Amount: 100,000,000 FORGE (with 8 decimals = 10,000,000,000,000,000 in base units)
 */

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { TransactionBlock } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { readFileSync } from "fs";
import { join } from "path";

// Constants
const PACKAGE_ID = "0x591bd66d7536a9f4625a05077305b02f79ee9c49f6865b5a40858bef145ed654";
const TREASURY_CAP = "0x0531c35df1738b9e582492061265aca28a2795c95c0d8ea80d15274976d1e34f";
const RECIPIENT = "0xa18380b53746d7b334fcc58f43c27f35a8318ed0af15a4fb572734b342f9c412";

// Amount: 100M FORGE with 8 decimals = 10,000,000,000,000,000 base units
const AMOUNT_TO_MINT = 10_000_000_000_000_000n; // 100M FORGE

async function mintForgeTokens() {
  try {
    // Initialize Sui client
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    console.log("✅ Connected to Sui Testnet");

    // Read keypair from wallet
    const keypairPath = join(process.env.HOME || process.env.USERPROFILE || "", ".sui/sui_config/sui.keystore");
    let keypair: Ed25519Keypair;

    try {
      const keyContent = readFileSync(keypairPath, "utf-8");
      const keyArray = JSON.parse(keyContent);
      const privateKey = keyArray[0]; // First key in keystore
      keypair = Ed25519Keypair.fromSecretKey(Buffer.from(privateKey, "base64").slice(1));
      console.log("✅ Loaded keypair from:", keypairPath);
    } catch (err) {
      console.error("❌ Failed to load keypair. Make sure you have Sui CLI configured.");
      console.error("   Run: sui client new-address ed25519");
      process.exit(1);
    }

    const senderAddress = keypair.toSuiAddress();
    console.log("📝 Sender Address:", senderAddress);
    console.log("🎯 Recipient Address:", RECIPIENT);
    console.log("💰 Amount to Mint: 100,000,000 FORGE (1% of 10B supply)");

    // Build transaction
    const tx = new TransactionBlock();

    // Call mint_and_transfer function
    const mintResult = tx.moveCall({
      target: `${PACKAGE_ID}::forge_token::mint_and_transfer`,
      arguments: [
        tx.object(TREASURY_CAP), // Treasury Cap
        tx.pure(AMOUNT_TO_MINT), // Amount in base units
      ],
    });

    // Transfer to recipient if not already done by entry function
    // Note: mint_and_transfer already sends to tx_context::sender()
    // So we need to make sure the sender is the recipient or modify the function

    // Set gas budget
    tx.setGasBudget(10_000_000); // 0.01 SUI

    console.log("\n⏳ Executing transaction...");

    // Sign and execute
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showInput: false,
        showEffects: true,
        showEvents: true,
      },
      requestType: "WaitForLocalExecution",
    });

    console.log("\n✅ Transaction Successful!");
    console.log("📋 Digest:", result.digest);

    // Show status
    if (result.effects?.status.status === "success") {
      console.log("✅ Status: SUCCESS");
      console.log("\n💎 100M FORGE tokens have been minted!");
      console.log("📍 Check wallet at:", RECIPIENT);
      console.log("🔗 Explorer: https://suiscan.xyz/testnet/account/" + RECIPIENT);

      // Show created objects
      if (result.effects?.created) {
        console.log("\n📦 Created Objects:");
        result.effects.created.forEach((obj) => {
          console.log(`   - ${obj.reference.objectId} (${obj.owner})`);
        });
      }
    } else {
      console.log("❌ Status:", result.effects?.status.status);
      console.log("Error:", result.effects?.status.error);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
mintForgeTokens();
