module sui_hero::hero {
    use std::string::String;
    use sui::package;
    use sui::display;
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID};

    public struct HERO has drop {} // one time witness

    public struct Hero has key, store {
        id: UID,
        name: String,
        hp: u64,
        level: u64,
        attack: u64,
        defense: u64,
        damage: u64,
        chakra: u64,
        image_url: String,
        hero_class: String,
    }

    fun init(otw: HERO, ctx: &mut TxContext) {
        let keys = vector[
            b"name".to_string(),
            b"hp".to_string(),
            b"level".to_string(),
            b"attack".to_string(),
            b"defense".to_string(),
            b"damage".to_string(),
            b"chakra".to_string(),
            b"image_url".to_string(),
            b"hero_class".to_string()
        ];

        let values = vector[
            b"{name}".to_string(),
            b"{hp}".to_string(),
            b"{level}".to_string(),
            b"{attack}".to_string(),
            b"{defense}".to_string(),
            b"{damage}".to_string(),
            b"{chakra}".to_string(),
            b"{image_url}".to_string(),
            b"{hero_class}".to_string()
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<Hero>(&publisher, keys, values, ctx);

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // Mint Hero baru
    public entry fun mint_hero(name: String, image_url: String, hero_class: String, ctx: &mut TxContext) {
        let hero = Hero {
            id: object::new(ctx),
            name,
            hp: 100,
            level: 1,
            attack: 10,
            defense: 5,
            damage: 0,
            chakra: 50,
            image_url,
            hero_class,
        };

        transfer::public_transfer(hero, tx_context::sender(ctx));
    }

    // Latih hero: naik level + sedikit stat
    public entry fun train_hero(hero: &mut Hero) {
        hero.level = hero.level + 1;
        hero.attack = hero.attack + 2;
        hero.defense = hero.defense + 1;
        hero.chakra = hero.chakra + 5;
    }

    // Battle: serangan pakai attack & chakra, dikurangi defense lawan
    public entry fun fight(
        hero1: &mut Hero,
        hero2: &mut Hero,
    ) {
        // butuh chakra minimal untuk skill
        let cost: u64 = 5;

        // hero1 serang
        let mut dmg1 = 0;
        if (hero1.chakra >= cost) {
            hero1.chakra = hero1.chakra - cost;
            let base1 = hero1.attack + hero1.level;
            dmg1 = if (base1 > hero2.defense) { base1 - hero2.defense } else { 0 };
        };

        // hero2 serang
        let mut dmg2 = 0;
        if (hero2.chakra >= cost) {
            hero2.chakra = hero2.chakra - cost;
            let base2 = hero2.attack + hero2.level;
            dmg2 = if (base2 > hero1.defense) { base2 - hero1.defense } else { 0 };
        };

        // terapkan damage ke HP
        if (hero2.hp > dmg1) {
            hero2.hp = hero2.hp - dmg1;
        } else {
            hero2.hp = 0;
        };

        if (hero1.hp > dmg2) {
            hero1.hp = hero1.hp - dmg2;
        } else {
            hero1.hp = 0;
        };

        // simpan total damage terakhir (opsional buat ditampilkan)
        hero1.damage = dmg1;
        hero2.damage = dmg2;

        // pemenang: yang HP-nya masih lebih besar, naik level sedikit
        if (hero1.hp > hero2.hp) {
            hero1.level = hero1.level + 1;
        } else if (hero2.hp > hero1.hp) {
            hero2.level = hero2.level + 1;
        };
    }
}
