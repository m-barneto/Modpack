"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotLootGenerator_1 = require("C:/snapshot/project/obj/generators/BotLootGenerator");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const WeaponGenerator_1 = require("./WeaponGenerator");
const mapUtils_1 = require("./mapUtils");
const Data_1 = require("./Data");
const GearGeneratorHelper_1 = require("./GearGeneratorHelper");
const HelmetGenerator_1 = require("./HelmetGenerator");
const config = __importStar(require("../config/config.json"));
let GearGenerator = class GearGenerator {
    logger;
    hashUtil;
    randomUtil;
    itemHelper;
    botGeneratorHelper;
    botLootGenerator;
    botWeaponGenerator;
    weaponGenerator;
    data;
    gearGeneratorHelper;
    helmetGenerator;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SECURED_CONTAINER_BOSS = "5c0a794586f77461c458f892";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    POCKETS_1x4 = "557ffd194bdc2d28148b457f";
    constructor(logger, hashUtil, randomUtil, itemHelper, botGeneratorHelper, botLootGenerator, botWeaponGenerator, weaponGenerator, data, gearGeneratorHelper, helmetGenerator) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.itemHelper = itemHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.botLootGenerator = botLootGenerator;
        this.botWeaponGenerator = botWeaponGenerator;
        this.weaponGenerator = weaponGenerator;
        this.data = data;
        this.gearGeneratorHelper = gearGeneratorHelper;
        this.helmetGenerator = helmetGenerator;
    }
    generateInventoryBase() {
        const equipmentId = this.hashUtil.generate();
        const equipmentTpl = "55d7217a4bdc2d86028b456d";
        const stashId = this.hashUtil.generate();
        const stashTpl = "566abbc34bdc2d92178b4576";
        const questRaidItemsId = this.hashUtil.generate();
        const questRaidItemsTpl = "5963866286f7747bf429b572";
        const questStashItemsId = this.hashUtil.generate();
        const questStashItemsTpl = "5963866b86f7747bfa1c4462";
        const sortingTableId = this.hashUtil.generate();
        const sortingTableTpl = "602543c13fee350cd564d032";
        return {
            items: [
                {
                    _id: equipmentId,
                    _tpl: equipmentTpl,
                },
                {
                    _id: stashId,
                    _tpl: stashTpl,
                },
                {
                    _id: questRaidItemsId,
                    _tpl: questRaidItemsTpl,
                },
                {
                    _id: questStashItemsId,
                    _tpl: questStashItemsTpl,
                },
                {
                    _id: sortingTableId,
                    _tpl: sortingTableTpl,
                },
            ],
            equipment: equipmentId,
            stash: stashId,
            questRaidItems: questRaidItemsId,
            questStashItems: questStashItemsId,
            sortingTable: sortingTableId,
            hideoutAreaStashes: {},
            fastPanel: {},
            favoriteItems: []
        };
    }
    getGearItem(presetName, botLevel, equipmentSlot) {
        switch (equipmentSlot) {
            case EquipmentSlots_1.EquipmentSlots.EARPIECE: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).headsets);
            }
            case EquipmentSlots_1.EquipmentSlots.HEADWEAR: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).helmets);
            }
            case EquipmentSlots_1.EquipmentSlots.BACKPACK: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).backpacks);
            }
            case EquipmentSlots_1.EquipmentSlots.FACE_COVER: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).face);
            }
            case EquipmentSlots_1.EquipmentSlots.EYEWEAR: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).eyewear);
            }
            case EquipmentSlots_1.EquipmentSlots.SCABBARD: {
                return this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).sheath);
            }
        }
    }
    generateArmor(presetName, botLevel, botRole, botInventory) {
        if (this.randomUtil.getBool()) {
            this.generateArmoredRig(presetName, botLevel, botRole, botInventory);
        }
        else {
            this.generateArmorVest(presetName, botLevel, botRole, botInventory);
            this.generateTacticalVest(presetName, botLevel, botRole, botInventory);
        }
    }
    generateArmoredRig(presetName, botLevel, botRole, botInventory) {
        const armoredRig = this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).armoredRigs);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST, botRole, botInventory, armoredRig.id, true, botLevel);
    }
    generateArmorVest(presetName, botLevel, botRole, botInventory) {
        const armor = this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).armor);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.ARMOR_VEST, botRole, botInventory, armor.id, true, botLevel);
    }
    generateTacticalVest(presetName, botLevel, botRole, botInventory) {
        const vest = this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).rigs);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST, botRole, botInventory, vest.id, false, botLevel);
    }
    generateChad(presetName, botRole, botInventory, botLevel, raidInfo) {
        const chance = Math.random() <= config.chadsPercentage / 100;
        const isMapOk = config.chadsOnFactoryAndLabOnly
            ? (0, mapUtils_1.isFactoryOrLab)(raidInfo.location)
            : true;
        if (chance && isMapOk && botLevel >= config.chadsMinimumLevel) {
            this.generateTacticalVest(presetName, botLevel, botRole, botInventory);
            this.generateChadArmor(presetName, botLevel, botRole, botInventory);
            if (this.randomUtil.getBool()) {
                this.generateChadHelmet(presetName, botLevel, botRole, botInventory, raidInfo.isNight);
                this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.FACE_COVER);
                this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.EYEWEAR);
            }
            else {
                this.generateChadMask(presetName, botLevel, botRole, botInventory);
            }
            return true;
        }
        return false;
    }
    generateChadArmor(presetName, botLevel, botRole, botInventory) {
        let armor = this.data.getGear(presetName, botLevel).chadArmor;
        if (armor.length == 0) {
            armor = this.data.getGear(presetName, botLevel).armor;
        }
        const selectedArmor = this.gearGeneratorHelper.weightedRandomGearItem(armor);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.ARMOR_VEST, botRole, botInventory, selectedArmor.id, true, botLevel);
    }
    generateChadHelmet(presetName, botLevel, botRole, botInventory, isNightVision) {
        let helmets = this.data.getGear(presetName, botLevel).chadHelmets;
        if (helmets.length == 0) {
            helmets = this.data.getGear(presetName, botLevel).helmets;
        }
        const selectedHelmet = this.gearGeneratorHelper.weightedRandomGearItem(helmets);
        this.helmetGenerator.generateHelmet(botLevel, botRole, botInventory, selectedHelmet.id, isNightVision, true);
    }
    generateChadMask(presetName, botLevel, botRole, botInventory) {
        const mask = this.gearGeneratorHelper.weightedRandomGearItem(this.data.getGear(presetName, botLevel).chadMasks);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.FACE_COVER, botRole, botInventory, mask.id, false, botLevel);
    }
    generateGearItem(presetName, botLevel, botRole, botInventory, equipmentSlot) {
        const gearItem = this.getGearItem(presetName, botLevel, equipmentSlot);
        const equipmentItemTpl = gearItem.id;
        this.gearGeneratorHelper.putGearItemToInventory(equipmentSlot, botRole, botInventory, equipmentItemTpl, false, botLevel);
        return gearItem;
    }
    generateHeadwearAndEarpieceItem(presetName, botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const headwearItem = this.getGearItem(presetName, botLevel, EquipmentSlots_1.EquipmentSlots.HEADWEAR);
        this.helmetGenerator.generateHelmet(botLevel, botRole, botInventory, headwearItem.id, isNightVision, isKittedHelmet);
        // for "SSh-68 steel helmet" only one earpiece "GSSh-01 active headset"
        if (headwearItem.id === "5c06c6a80db834001b735491") {
            this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.EARPIECE, botRole, botInventory, "5b432b965acfc47a8774094e", false, botLevel);
            return;
        }
        if (this.helmetGenerator.isEarpieceIncompatible(headwearItem.id)) {
            return;
        }
        const earpieceItem = this.getGearItem(presetName, botLevel, EquipmentSlots_1.EquipmentSlots.EARPIECE);
        const earpieceTpl = this.helmetGenerator.isEarpieceNotFullyCompatible(headwearItem.id)
            ? this.gearGeneratorHelper.replaceEarpiece(earpieceItem.id)
            : earpieceItem.id;
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.EARPIECE, botRole, botInventory, earpieceTpl, false, botLevel);
    }
    generateInventory(sessionId, botJsonTemplate, botRole, isPmc, botLevel, raidInfo) {
        const presetName = this.data.getPresetName();
        const botInventory = this.generateInventoryBase();
        const presetTierConfig = this.data.getConfig(presetName, botLevel);
        const isNightVision = (raidInfo.isNight) ? this.randomUtil.getChance100(presetTierConfig.nightVisionPercent) : false;
        const isKittedHelmet = this.randomUtil.getChance100(presetTierConfig.kittedHelmetPercent);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.POCKETS, botRole, botInventory, this.POCKETS_1x4, false, botLevel);
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.SECURED_CONTAINER, botRole, botInventory, this.SECURED_CONTAINER_BOSS, false, botLevel);
        if (!this.generateChad(presetName, botRole, botInventory, botLevel, raidInfo)) {
            this.generateHeadwearAndEarpieceItem(presetName, botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
            this.generateArmor(presetName, botLevel, botRole, botInventory);
            this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.EYEWEAR);
            this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.FACE_COVER);
        }
        this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.BACKPACK);
        this.generateGearItem(presetName, botLevel, botRole, botInventory, EquipmentSlots_1.EquipmentSlots.SCABBARD);
        const generatedWeapon = this.weaponGenerator.generateWeapon(presetName, botLevel, botInventory.equipment, isNightVision);
        botInventory.items.push(...generatedWeapon.weaponWithMods);
        const generatedWeaponResult = {
            weapon: generatedWeapon.weaponWithMods,
            chosenAmmoTpl: generatedWeapon.ammoTpl,
            chosenUbglAmmoTpl: undefined,
            weaponMods: botJsonTemplate.inventory.mods,
            weaponTemplate: generatedWeapon.weaponTemplate,
        };
        this.botWeaponGenerator.addExtraMagazinesToInventory(generatedWeaponResult, botJsonTemplate.generation.items.magazines, botInventory, botRole);
        if (config.lootingBotsCompatibility) {
            botJsonTemplate.generation.items.backpackLoot.weights = { "0": 1 };
            botJsonTemplate.generation.items.backpackLoot.whitelist = {};
        }
        this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
        return botInventory;
    }
};
exports.GearGenerator = GearGenerator;
exports.GearGenerator = GearGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(5, (0, tsyringe_1.inject)("BotLootGenerator")),
    __param(6, (0, tsyringe_1.inject)("BotWeaponGenerator")),
    __param(7, (0, tsyringe_1.inject)("AndernWeaponGenerator")),
    __param(8, (0, tsyringe_1.inject)("AndernData")),
    __param(9, (0, tsyringe_1.inject)("AndernGearGeneratorHelper")),
    __param(10, (0, tsyringe_1.inject)("AndernHelmetGenerator")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _e : Object, typeof (_f = typeof BotLootGenerator_1.BotLootGenerator !== "undefined" && BotLootGenerator_1.BotLootGenerator) === "function" ? _f : Object, typeof (_g = typeof BotWeaponGenerator_1.BotWeaponGenerator !== "undefined" && BotWeaponGenerator_1.BotWeaponGenerator) === "function" ? _g : Object, typeof (_h = typeof WeaponGenerator_1.WeaponGenerator !== "undefined" && WeaponGenerator_1.WeaponGenerator) === "function" ? _h : Object, typeof (_j = typeof Data_1.Data !== "undefined" && Data_1.Data) === "function" ? _j : Object, typeof (_k = typeof GearGeneratorHelper_1.GearGeneratorHelper !== "undefined" && GearGeneratorHelper_1.GearGeneratorHelper) === "function" ? _k : Object, typeof (_l = typeof HelmetGenerator_1.HelmetGenerator !== "undefined" && HelmetGenerator_1.HelmetGenerator) === "function" ? _l : Object])
], GearGenerator);
//# sourceMappingURL=GearGenerator.js.map