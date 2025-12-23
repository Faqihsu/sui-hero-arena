// FORGE Token Module - Custom token for the Sui Hero Arena marketplace
module hero_marketplace::forge_token {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// The type identifier for FORGE token
    public struct FORGE_TOKEN has drop {}

    /// One-time witness function to initialize the FORGE token
    fun init(witness: FORGE_TOKEN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency<FORGE_TOKEN>(
            witness,
            8,  // decimals
            b"FORGE",  // symbol
            b"Forge Token",  // name
            b"Token for Sui Hero Arena Marketplace - Trade heroes with FORGE tokens",  // description
            option::none(),  // icon_url
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }

    /// Mint FORGE tokens (only callable by treasury owner)
    public fun mint(
        treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<FORGE_TOKEN> {
        coin::mint(treasury, amount, ctx)
    }

    /// Burn FORGE tokens
    public fun burn(
        treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
        coin: Coin<FORGE_TOKEN>
    ) {
        coin::burn(treasury, coin);
    }
}
