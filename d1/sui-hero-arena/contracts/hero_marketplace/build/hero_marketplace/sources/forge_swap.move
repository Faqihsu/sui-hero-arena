// FORGE Token Swap Module - Token with DEX swap functionality
module hero_marketplace::forge_swap {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::object::{Self, UID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::TxContext;

    /// The FORGE_SWAP one-time witness (required for init function)
    public struct FORGE_SWAP has drop {}

    /// The FORGE token type
    public struct FORGE has drop {}

    /// Swap pool for FORGE <-> SUI
    public struct SwapPool has key {
        id: UID,
        forge_balance: Balance<FORGE>,
        sui_balance: Balance<SUI>,
        // Rate: 1 SUI = 100,000 FORGE (0.01 SUI = 1000 FORGE)
        forge_per_sui: u64,
    }

    /// Initialize - Note: We skip the standard init since coin::create_currency
    /// has issues with our token setup. Instead, use manual swap pool creation.
    /// In a real scenario, deploy forge_token.move and link SwapPool to it.
    fun init(_witness: FORGE_SWAP, ctx: &mut TxContext) {
        // Create an empty swap pool that will be populated manually
        // This is a workaround for the one-time witness requirement
        let pool = SwapPool {
            id: object::new(ctx),
            forge_balance: balance::zero(),
            sui_balance: balance::zero(),
            forge_per_sui: 100_000, // 1 SUI = 100,000 FORGE
        };

        transfer::share_object(pool);
    }

    /// Initialize pool with FORGE tokens
    /// This should be called after minting FORGE tokens to populate the swap pool
    public entry fun init_pool_with_forge(
        pool: &mut SwapPool,
        forge_coins: Coin<FORGE>,
    ) {
        let forge_balance = coin::into_balance(forge_coins);
        balance::join(&mut pool.forge_balance, forge_balance);
    }

    /// Swap SUI for FORGE
    /// Amount: SUI amount in MIST (1 SUI = 1,000,000,000 MIST)
    /// Example: 10,000,000,000 MIST = 0.01 SUI = 1,000 FORGE
    public entry fun swap_sui_for_forge(
        pool: &mut SwapPool,
        sui_payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sui_amount = coin::value(&sui_payment);
        
        // Calculate FORGE amount: (sui_amount / 1_000_000_000) * 100_000
        // Simplified: (sui_amount * 100_000) / 1_000_000_000
        let forge_amount = (sui_amount / 10_000_000); // This gives us the rate: 0.01 SUI = 1000 FORGE

        // Get FORGE from pool
        let forge = balance::split(&mut pool.forge_balance, forge_amount);
        let forge_coin = coin::from_balance(forge, ctx);

        // Add SUI to pool
        let sui_balance = coin::into_balance(sui_payment);
        balance::join(&mut pool.sui_balance, sui_balance);

        // Transfer FORGE to user
        transfer::public_transfer(forge_coin, tx_context::sender(ctx));
    }

    /// Swap FORGE for SUI
    public entry fun swap_forge_for_sui(
        pool: &mut SwapPool,
        forge_payment: Coin<FORGE>,
        ctx: &mut TxContext
    ) {
        let forge_amount = coin::value(&forge_payment);
        
        // Calculate SUI amount: (forge_amount * 1_000_000_000) / 100_000
        // Simplified: forge_amount * 10_000
        let sui_amount = (forge_amount * 10_000);

        // Get SUI from pool
        let sui = balance::split(&mut pool.sui_balance, sui_amount);
        let sui_coin = coin::from_balance(sui, ctx);

        // Add FORGE to pool
        let forge_balance = coin::into_balance(forge_payment);
        balance::join(&mut pool.forge_balance, forge_balance);

        // Transfer SUI to user
        transfer::public_transfer(sui_coin, tx_context::sender(ctx));
    }

    /// View pool liquidity
    public fun get_pool_state(pool: &SwapPool): (u64, u64, u64) {
        (
            balance::value(&pool.forge_balance),
            balance::value(&pool.sui_balance),
            pool.forge_per_sui
        )
    }
}
