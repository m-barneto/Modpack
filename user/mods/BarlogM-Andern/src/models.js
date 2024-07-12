"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootTableIndexs = exports.Gear = exports.GearItem = exports.GeneratedWeapon = exports.WeaponPreset = exports.Config = exports.PresetData = void 0;
class PresetData {
    config;
    gear;
    weapon;
    ammo;
    modules;
}
exports.PresetData = PresetData;
class Config {
    minLevel;
    maxLevel;
    kittedHelmetPercent;
    nightVisionPercent;
    getMinMax() {
        return {
            min: this.minLevel,
            max: this.maxLevel,
        };
    }
}
exports.Config = Config;
class WeaponPreset {
    Id;
    Name;
    Root;
    Items;
}
exports.WeaponPreset = WeaponPreset;
class GeneratedWeapon {
    weaponWithMods;
    weaponTemplate;
    ammoTpl;
    magazineTpl;
}
exports.GeneratedWeapon = GeneratedWeapon;
class GearItem {
    weight;
    id;
    name;
}
exports.GearItem = GearItem;
class Gear {
    headsets;
    helmets;
    armoredRigs;
    armor;
    rigs;
    backpacks;
    face;
    eyewear;
    sheath;
    chadMasks;
    chadHelmets;
    chadArmor;
}
exports.Gear = Gear;
var LootTableIndexs;
(function (LootTableIndexs) {
    LootTableIndexs[LootTableIndexs["EXTREMELY_RARE"] = 0] = "EXTREMELY_RARE";
    LootTableIndexs[LootTableIndexs["RARE"] = 1] = "RARE";
    LootTableIndexs[LootTableIndexs["VALUABLE"] = 2] = "VALUABLE";
    LootTableIndexs[LootTableIndexs["COMMON"] = 3] = "COMMON";
})(LootTableIndexs || (exports.LootTableIndexs = LootTableIndexs = {}));
//# sourceMappingURL=models.js.map