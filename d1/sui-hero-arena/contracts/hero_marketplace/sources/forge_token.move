// FORGE Token Module - Custom token for the Sui Hero Arena marketplace
module hero_marketplace::forge_token {
    use sui::coin;

    /// The type identifier for FORGE token
    public struct FORGE_TOKEN has drop {}

    /// One-time witness function to initialize the FORGE token
    fun init(witness: FORGE_TOKEN, ctx: &mut sui::tx_context::TxContext) {
        let (treasury, metadata) = coin::create_currency<FORGE_TOKEN>(
            witness,
            8,  // decimals
            b"FORGE",  // symbol
            b"Forge Token",  // name
            b"Token for Sui Hero Arena Marketplace - Trade heroes with FORGE tokens",  // description
            option::none(),  // icon_url
            ctx
        );

        sui::transfer::public_freeze_object(metadata);
        sui::transfer::public_transfer(treasury, sui::tx_context::sender(ctx));
    }

    /// Mint FORGE tokens (only callable by treasury owner)
    public entry fun mint_and_transfer(
        treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
        amount: u64,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let minted = coin::mint(treasury, amount, ctx);
        sui::transfer::public_transfer(minted, sui::tx_context::sender(ctx));
    }

    /// Mint FORGE tokens (returns coin for programmatic use)
    public fun mint(
        treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
        amount: u64,
        ctx: &mut sui::tx_context::TxContext
    ): coin::Coin<FORGE_TOKEN> {
        coin::mint(treasury, amount, ctx)
    }

    /// Burn FORGE tokens
    public fun burn(
        treasury: &mut coin::TreasuryCap<FORGE_TOKEN>,
        coin_to_burn: coin::Coin<FORGE_TOKEN>
    ) {
        coin::burn(treasury, coin_to_burn);
    }
}
