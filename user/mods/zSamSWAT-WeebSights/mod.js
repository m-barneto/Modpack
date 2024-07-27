"use strict";

const mbus_sights = [
    "sight_rear_all_magpul_mbus_anti",
    "sight_rear_all_magpul_mbus_gen2_anime",
    "sight_rear_all_magpul_mbus_gen2_anime2",
    "sight_rear_all_magpul_mbus_gen2_anime3",
    "sight_rear_all_magpul_mbus_gen2_anime3v2",
    "sight_rear_all_magpul_mbus_gen2_anti2",
    "sight_rear_all_magpul_mbus_gen2_ramrem",
    "sight_rear_all_magpul_mbus_gen2_fde_anime",
    "sight_rear_all_magpul_mbus_gen2_fde_anime2",
    "sight_rear_all_magpul_mbus_gen2_fde_anime3",
    "sight_rear_all_magpul_mbus_gen2_fde_anime3v2",
    "sight_rear_all_magpul_mbus_gen2_fde_anti",
    "sight_rear_all_magpul_mbus_gen2_fde_anti2",
    "sight_rear_all_magpul_mbus_gen2_fde_ramrem"
];

const sig_sights = [
    "sight_rear_all_sig_flip_up_anime",
    "sight_rear_all_sig_flip_up_anime2",
    "sight_rear_all_sig_flip_up_anime3",
    "sight_rear_all_sig_flip_up_anime3v2",
    "sight_rear_all_sig_flip_up_anti",
    "sight_rear_all_sig_flip_up_anti2",
    "sight_rear_all_sig_flip_up_ramrem"
];

class Mod {
    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const locales = db.locales.global;

        Mod.mbus(db, container);
        Mod.sigFlipUp(db, container);
        Mod.addToFilters(db);

        for (const locale of Object.values(locales)) {
            locale["sight_rear_all_magpul_mbus_anti Name"] = "Magpul MBUS Gen2 rear flip-up sight [Anti]";
            locale["sight_rear_all_magpul_mbus_anti ShortName"] = "MBUS RS";
            locale["sight_rear_all_magpul_mbus_anti Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Your personal waifu giving her neko love to support you in combat.";
            
            locale["sight_rear_all_magpul_mbus_gen2_anime Name"] = "Magpul MBUS Gen2 rear flip-up sight [Ai Fuyuumi]";
            locale["sight_rear_all_magpul_mbus_gen2_anime ShortName"] = "MBUS RS";
            locale["sight_rear_all_magpul_mbus_gen2_anime Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul.";
            
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime2 Name"] = "Magpul MBUS Gen2 rear flip-up sight [GF M4 SOPMOD II]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul."
            
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3 Name"] = "Magpul MBUS Gen2 rear flip-up sight [Animu 3]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3v2 Name"] = "Magpul MBUS Gen2 rear flip-up sight [Animu 3 v2]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3v2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anime3v2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_anti2 Name"] = "Magpul MBUS Gen2 rear flip-up sight [Anti 2]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anti2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_anti2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. The personal sight used by Anti, the war Neko! Nya!!"
            
	 	 	locale["sight_rear_all_magpul_mbus_gen2_ramrem Name"] = "Magpul MBUS Gen2 rear flip-up sight [Ram & Rem]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_ramrem ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_ramrem Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Ai Fuyuumi]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime2 Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [GF M4 SOPMOD II]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3 Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Animu 3]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3v2 Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Animu 3 v2]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3v2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anime3v2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Anti]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color. Your personal waifu giving her neko love to support you in combat."

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti2 Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Anti 2]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti2 ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_anti2 Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color. The personal sight used by Anti, the war Neko! Nya!!"

	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_ramrem Name"] = "Magpul MBUS Gen2 rear flip-up sight (FDE) [Ram & Rem]";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_ramrem ShortName"] = "MBUS RS";
	 	 	locale["sight_rear_all_magpul_mbus_gen2_fde_ramrem Description"] = "Removable flip-up rear sight MBUS Gen2, installed on the mount. Manufactured by Magpul. Flat Dark Earth color."

			locale["sight_rear_all_sig_flip_up_anime Name"] = "MCX flip-up rear sight [Ai Fuyuumi]",
			locale["sight_rear_all_sig_flip_up_anime ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anime Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer."
            
			locale["sight_rear_all_sig_flip_up_anime2 Name"] = "MCX flip-up rear sight [GF M4 SOPMOD II]",
			locale["sight_rear_all_sig_flip_up_anime2 ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anime2 Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer."
            
			locale["sight_rear_all_sig_flip_up_anime3 Name"] = "MCX flip-up rear sight [Animu 3]",
			locale["sight_rear_all_sig_flip_up_anime3 ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anime3 Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer."
           
			locale["sight_rear_all_sig_flip_up_anime3v2 Name"] = "MCX flip-up rear sight [Animu 3 v2]",
			locale["sight_rear_all_sig_flip_up_anime3v2 ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anime3v2 Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer."
            
			locale["sight_rear_all_sig_flip_up_anti Name"] = "MCX flip-up rear sight [Anti]",
			locale["sight_rear_all_sig_flip_up_anti ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anti Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer. Your personal waifu giving her neko love to support you in combat."
            
			locale["sight_rear_all_sig_flip_up_anti2 Name"] = "MCX flip-up rear sight [Anti 2]",
			locale["sight_rear_all_sig_flip_up_anti2 ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_anti2 Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer. The personal sight used by Anti, the war Neko! Nya!!"
            
			locale["sight_rear_all_sig_flip_up_ramrem Name"] = "MCX flip-up rear sight [Ram & Rem]",
			locale["sight_rear_all_sig_flip_up_ramrem ShortName"] = "MCX RS",
			locale["sight_rear_all_sig_flip_up_ramrem Description"] = "Removable flip-up rear sight for MCX assault rifles, manufactured by SIG Sauer."
        }
    }

    static mbus(db, container) {
        const jsonUtil = container.resolve("JsonUtil");
        const items = db.templates.items
        const mechanic = db.traders["5a7c2eca46aef81a7ca2145d"];

        for (const sight in mbus_sights) {
            let weebsights = jsonUtil.clone(items["5bc09a18d4351e003562b68e"]);
            weebsights._id = mbus_sights[sight];
            weebsights._props.Prefab.path = "assets/content/items/mods/sights rear/".concat(mbus_sights[sight], ".bundle");
            weebsights._props.CreditsPrice = 4000;
            weebsights._props.Ergonomics = 3;
            items[mbus_sights[sight]] = weebsights;

            db.templates.handbook.Items.push(
                {
                    "Id": mbus_sights[sight],
                    "ParentId": "5b5f746686f77447ec5d7708",
                    "Price": weebsights._props.CreditsPrice,
                });

            let mbus_assort_items = {
                "_id": mbus_sights[sight],
                "_tpl": mbus_sights[sight],
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 999999999
                }
            };

            let mbus_barter_scheme = [
                [
                    {
                        "count": weebsights._props.CreditsPrice,
                        "_tpl": "5449016a4bdc2d6f028b456f"
                    }]
            ];

            mechanic.assort.items.push(mbus_assort_items);
            mechanic.assort.barter_scheme[mbus_sights[sight]] = mbus_barter_scheme;
            mechanic.assort.loyal_level_items[mbus_sights[sight]] = 1;
        }
    }

    static sigFlipUp(db, container) {
        const jsonUtil = container.resolve("JsonUtil");
        const items = db.templates.items
        const mechanic = db.traders["5a7c2eca46aef81a7ca2145d"];

        for (const sight in sig_sights) {
            let sigfuweeb = jsonUtil.clone(items["5fc0fa957283c4046c58147e"]);
            sigfuweeb._id = sig_sights[sight];
            sigfuweeb._props.Prefab.path = "assets/content/items/mods/sights rear/".concat(sig_sights[sight], ".bundle");
            sigfuweeb._props.CreditsPrice = 2500;
            sigfuweeb._props.Ergonomics = 2;
            items[sig_sights[sight]] = sigfuweeb;

            db.templates.handbook.Items.push(
                {
                    "Id": sig_sights[sight],
                    "ParentId": "5b5f746686f77447ec5d7708",
                    "Price": sigfuweeb._props.CreditsPrice,
                });

            let sig_assort_items = {
                "_id": sig_sights[sight],
                "_tpl": sig_sights[sight],
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": true,
                    "StackObjectsCount": 999999999
                }
            };

            let sig_barter_scheme = [
                [
                    {
                        "count": sigfuweeb._props.CreditsPrice,
                        "_tpl": "5449016a4bdc2d6f028b456f"
                    }]
            ];

            mechanic.assort.items.push(sig_assort_items);
            mechanic.assort.barter_scheme[sig_sights[sight]] = sig_barter_scheme;
            mechanic.assort.loyal_level_items[sig_sights[sight]] = 1;
        }
    }

    static addToFilters(db) {
        const isModFilterExist = (slots) => slots.findIndex((slot) => slot._name === "mod_sight_rear");
        const isItemSlotsExist = (item) => item._props.Slots && item._props.Slots.length > 0;
        const filtersIncludeAttachment = (filterArray) => filterArray.includes("5bc09a18d4351e003562b68e");
        const combinedarray = mbus_sights.concat(sig_sights);
        for (const item of Object.values(db.templates.items)) {
            if (isItemSlotsExist(item)) {
                const index = isModFilterExist(item._props.Slots);
                if (index > -1 && filtersIncludeAttachment(item._props.Slots[index]._props.filters[0].Filter)) {
                    for (const sight of combinedarray) {
                        item._props.Slots[index]._props.filters[0].Filter.push(sight);
                    }
                }
            }
        }
    }
}

module.exports = { mod: new Mod() }