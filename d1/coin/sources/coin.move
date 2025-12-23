module coin::arena_coin {
    use std::option;
    use sui::coin::{Self, TreasuryCap};
    use sui::url;

    public struct ARENA_COIN has drop {}

    fun init(otw: ARENA_COIN, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            otw, 
            9, 
            b"ARENA", 
            b"Arena Coin", 
            b"Arena Coin is the official currency for upgrading Heroes in Sui Hero Arena", 
            option::some(url::new_unsafe_from_bytes(b"https://static.vecteezy.com/system/resources/thumbnails/009/726/817/small/pixel-art-gold-coin-icon-for-8bit-game-on-white-background-vector.jpg")), 
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<ARENA_COIN>, 
        amount: u64,
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}