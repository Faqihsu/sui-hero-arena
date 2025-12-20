module sui_hero::hero {
    use std::string::String;
    use sui::package;
    use sui::display;

    public struct HERO has drop {}

    public struct Hero has key, store {
        id: UID,
        name: String,
        hp: u64,
        level: u64,
        image_url: String,
    }

    fun init(otw: HERO, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"hp".to_string(),
            b"level".to_string(),
            b"image_url".to_string()
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{hp}".to_string(),
            b"{level}".to_string(),
            b"{image_url}".to_string()
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<Hero>(&publisher, keys, values, ctx);

        display::update_version(&mut display);

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
    }

    // Fungsi untuk Minting Hero Baru
    public entry fun mint_hero(name: String, image_url: String, ctx: &mut TxContext) {
        let hero = Hero {
            id: object::new(ctx),
            name,
            hp: 100,
            level: 1,
            image_url,
        };
        
        // Transfer ke dompet pemanggil
        transfer::public_transfer(hero, tx_context::sender(ctx));
    }

    // Fungsi Mutasi: Level Up
    public entry fun train_hero(hero: &mut Hero) {
            hero.level = hero.level + 1;
    }
    }

