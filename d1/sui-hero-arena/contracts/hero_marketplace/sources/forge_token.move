#[allow(duplicate_alias, deprecated_usage, lint(self_transfer))]
module hero_marketplace::forge_token {
    use sui::coin;
    use sui::tx_context::TxContext;

    /// The type identifier for FORGE token
    public struct FORGE_TOKEN has drop {}

    /// One-time witness function to initialize the FORGE token
    fun init(witness: FORGE_TOKEN, ctx: &mut TxContext) {
        let (treasury, metadata) = sui::coin::create_currency<FORGE_TOKEN>(
            witness,
            8,  // decimals
            b"FORGE",  // symbol
            b"Forge Token",  // name
            b"Token for Sui Hero Arena Marketplace - Trade heroes with FORGE tokens",  // description
            std::option::none(),  // icon_url
            ctx
        );

        sui::transfer::public_freeze_object(metadata);
        sui::transfer::public_transfer(treasury, sui::tx_context::sender(ctx));
    }

    /// Mint FORGE tokens (only callable by treasury owner)
    public fun mint_and_transfer(
        treasury: &mut sui::coin::TreasuryCap<FORGE_TOKEN>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let minted = sui::coin::mint(treasury, amount, ctx);
        sui::transfer::public_transfer(minted, sui::tx_context::sender(ctx));
    }

    /// Mint FORGE tokens (returns coin for programmatic use)
    public fun mint(
        treasury: &mut sui::coin::TreasuryCap<FORGE_TOKEN>,
        amount: u64,
        ctx: &mut TxContext
    ): sui::coin::Coin<FORGE_TOKEN> {
        sui::coin::mint(treasury, amount, ctx)
    }

    /// Burn FORGE tokens
    public fun burn(
        treasury: &mut sui::coin::TreasuryCap<FORGE_TOKEN>,
        coin_to_burn: sui::coin::Coin<FORGE_TOKEN>
    ) {
        sui::coin::burn(treasury, coin_to_burn);
    }
}
