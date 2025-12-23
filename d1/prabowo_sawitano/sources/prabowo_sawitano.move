module prabowo_sawitano::prabowo_sawitano {
    use std::option;
    use sui::coin::{Self, TreasuryCap};
    use sui::url;
    use sui::tx_context::TxContext;
    use sui::transfer;

    public struct PRABOWO_SAWITANO has drop {}

    fun init(otw: PRABOWO_SAWITANO, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            otw, 
            9, 
            b"PRBW", 
            b"Prbw Coin", 
            b"Prb Coin is the official currency for upgrading Heroes in Sui Hero Arena", 
            option::some(url::new_unsafe_from_bytes(b"https://cdn.pixabay.com/photo/2018/07/24/16/42/palm-tree-3559581_1280.jpg")), 
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<PRABOWO_SAWITANO>, 
        amount: u64,
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}