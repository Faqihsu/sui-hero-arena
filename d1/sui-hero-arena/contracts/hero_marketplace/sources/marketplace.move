// Marketplace Module - Handle hero listing, buying, and selling
module hero_marketplace::marketplace {
    use sui::object::{Self, UID};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;
    use std::string::String;

    use hero_marketplace::forge_token::FORGE_TOKEN;

    // ===== Errors =====
    const EInvalidPrice: u64 = 1;
    const EListingNotFound: u64 = 2;
    const EInsufficientBalance: u64 = 3;
    const ENotListingOwner: u64 = 4;
    const EInvalidAmount: u64 = 5;

    // ===== Objects =====
    /// Represents a hero listing on the marketplace
    public struct HeroListing has key, store {
        id: UID,
        hero_id: String,
        hero_name: String,
        seller: address,
        price: u64,
        level: u64,
        rarity: String,
        image_url: String,
        created_at: u64,
    }

    /// Marketplace admin object
    public struct MarketplaceAdmin has key {
        id: UID,
        listings: Table<String, HeroListing>,
        escrow: Table<String, Balance<FORGE_TOKEN>>,
        total_volume: u64,
        transaction_count: u64,
    }

    // ===== Events =====
    public struct ListingCreated has copy, drop {
        hero_id: String,
        seller: address,
        price: u64,
    }

    public struct HeroPurchased has copy, drop {
        hero_id: String,
        seller: address,
        buyer: address,
        price: u64,
    }

    public struct ListingCancelled has copy, drop {
        hero_id: String,
        seller: address,
    }

    // ===== Functions =====

    /// Initialize marketplace (called once)
    fun init(ctx: &mut TxContext) {
        let marketplace = MarketplaceAdmin {
            id: object::new(ctx),
            listings: table::new(ctx),
            escrow: table::new(ctx),
            total_volume: 0,
            transaction_count: 0,
        };

        transfer::share_object(marketplace);
    }

    /// Create a new listing for a hero
    public entry fun create_listing(
        marketplace: &mut MarketplaceAdmin,
        hero_id: String,
        hero_name: String,
        price: u64,
        level: u64,
        rarity: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        assert!(price > 0, EInvalidPrice);

        let listing = HeroListing {
            id: object::new(ctx),
            hero_id: hero_id,
            hero_name: hero_name,
            seller: tx_context::sender(ctx),
            price: price,
            level: level,
            rarity: rarity,
            image_url: image_url,
            created_at: tx_context::epoch(ctx),
        };

        event::emit(ListingCreated {
            hero_id: hero_id,
            seller: tx_context::sender(ctx),
            price: price,
        });

        table::add(&mut marketplace.listings, hero_id, listing);
    }

    /// Purchase a hero from the marketplace
    public entry fun purchase_hero(
        marketplace: &mut MarketplaceAdmin,
        hero_id: String,
        payment: Coin<FORGE_TOKEN>,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.listings, hero_id), EListingNotFound);

        let listing = table::remove(&mut marketplace.listings, hero_id);
        let buyer = tx_context::sender(ctx);

        assert!(coin::value(&payment) == listing.price, EInvalidAmount);
        assert!(coin::value(&payment) > 0, EInsufficientBalance);

        // Transfer payment to seller
        transfer::public_transfer(
            coin::into_balance(payment).into_coin(),
            listing.seller
        );

        // Update marketplace stats
        marketplace.total_volume = marketplace.total_volume + listing.price;
        marketplace.transaction_count = marketplace.transaction_count + 1;

        event::emit(HeroPurchased {
            hero_id: hero_id,
            seller: listing.seller,
            buyer: buyer,
            price: listing.price,
        });

        // Transfer hero to buyer (object id in escrow for demo)
        // In production, transfer the actual hero NFT object here
        let escrow_key = hero_id;
        let balance = balance::zero<FORGE_TOKEN>();
        table::add(&mut marketplace.escrow, escrow_key, balance);

        object::delete(listing.id);
    }

    /// Cancel a listing
    public entry fun cancel_listing(
        marketplace: &mut MarketplaceAdmin,
        hero_id: String,
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&marketplace.listings, hero_id), EListingNotFound);

        let listing = table::remove(&mut marketplace.listings, hero_id);
        assert!(listing.seller == tx_context::sender(ctx), ENotListingOwner);

        event::emit(ListingCancelled {
            hero_id: hero_id,
            seller: listing.seller,
        });

        object::delete(listing.id);
    }

    /// Get marketplace stats (view function)
    public fun get_marketplace_stats(
        marketplace: &MarketplaceAdmin
    ): (u64, u64) {
        (marketplace.total_volume, marketplace.transaction_count)
    }

    /// Check if a hero is listed
    public fun is_listed(
        marketplace: &MarketplaceAdmin,
        hero_id: String
    ): bool {
        table::contains(&marketplace.listings, hero_id)
    }
}
