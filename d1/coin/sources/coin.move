#[allow(deprecated_usage)]
module coin::arena_coin {
    public struct ARENA_COIN has drop {}

    fun init(otw: ARENA_COIN, ctx: &mut sui::tx_context::TxContext) {
        let (treasury_cap, metadata) = sui::coin::create_currency(
            otw, 
            9, 
            b"ARENA", 
            b"Arena Coin", 
            b"Arena Coin is the official currency for upgrading Heroes in Sui Hero Arena", 
            std::option::some(sui::url::new_unsafe_from_bytes(b"https://static.vecteezy.com/system/resources/thumbnails/009/726/817/small/pixel-art-gold-coin-icon-for-8bit-game-on-white-background-vector.jpg")), 
            ctx
        );

        sui::transfer::public_freeze_object(metadata);
        sui::transfer::public_transfer(treasury_cap, sui::tx_context::sender(ctx));
    }

    public fun mint(
        treasury_cap: &mut sui::coin::TreasuryCap<ARENA_COIN>, 
        amount: u64,
        recipient: address, 
        ctx: &mut sui::tx_context::TxContext
    ) {
        sui::coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}