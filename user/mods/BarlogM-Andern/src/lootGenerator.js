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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const BotLootGenerator_1 = require("C:/snapshot/project/obj/generators/BotLootGenerator");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const lootGeneratorHelper_1 = require("./lootGeneratorHelper");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const HandbookHelper_1 = require("C:/snapshot/project/obj/helpers/HandbookHelper");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const BotLootCacheService_1 = require("C:/snapshot/project/obj/services/BotLootCacheService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const IBotLootCache_1 = require("C:/snapshot/project/obj/models/spt/bots/IBotLootCache");
const ItemAddedResult_1 = require("C:/snapshot/project/obj/models/enums/ItemAddedResult");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const config = __importStar(require("../config/config.json"));
const backpackLootConfig = __importStar(require("../config/backpack.json"));
let LootGenerator = class LootGenerator extends BotLootGenerator_1.BotLootGenerator {
    constructor(logger, hashUtil, randomUtil, itemHelper, inventoryHelper, databaseService, handbookHelper, botGeneratorHelper, botWeaponGenerator, weightedRandomHelper, botHelper, botLootCacheService, localisationService, configServer, cloner) {
        super(logger, hashUtil, randomUtil, itemHelper, inventoryHelper, databaseService, handbookHelper, botGeneratorHelper, botWeaponGenerator, weightedRandomHelper, botHelper, botLootCacheService, localisationService, configServer, cloner);
    }
    generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel, raidInfo) {
        if (!isPmc || !config.pmcBackpackLoot) {
            return super.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
        }
        const itemCounts = botJsonTemplate.generation.items;
        const pocketLootCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.pocketLoot.weights));
        const vestLootCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.vestLoot.weights));
        const specialLootCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.specialItems.weights));
        const healingItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.healing.weights));
        const drugItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.drugs.weights));
        const stimItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.stims.weights));
        const grenadeItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.grenades.weights));
        if (isPmc && this.pmcConfig.forceHealingItemsIntoSecure) {
            this.addForcedMedicalItemsToPmcSecure(botInventory, botRole);
        }
        const botItemLimits = this.getItemSpawnLimitsForBot(botRole);
        const containersBotHasAvailable = this.getAvailableContainersBotCanStoreItemsIn(botInventory);
        // Special items
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.SPECIAL, botJsonTemplate), containersBotHasAvailable, specialLootCount, botInventory, botRole, botItemLimits);
        // Healing items
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.HEALING_ITEMS, botJsonTemplate), containersBotHasAvailable, healingItemCount, botInventory, botRole, null, 0, isPmc);
        // Drugs
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.DRUG_ITEMS, botJsonTemplate), containersBotHasAvailable, drugItemCount, botInventory, botRole, null, 0, isPmc);
        // Stims
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.STIM_ITEMS, botJsonTemplate), containersBotHasAvailable, stimItemCount, botInventory, botRole, botItemLimits, 0, isPmc);
        // Grenades
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.GRENADE_ITEMS, botJsonTemplate), containersBotHasAvailable, grenadeItemCount, botInventory, botRole, null, 0, isPmc);
        // Backpack
        this.generateBackpackLoot(sessionId, botLevel, botRole, botInventory, botJsonTemplate, isPmc, raidInfo);
        // Tactical vestLoot
        if (containersBotHasAvailable.includes(EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST)) {
            this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.VEST, botJsonTemplate), [EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST], vestLootCount, botInventory, botRole, botItemLimits, this.pmcConfig.maxVestLootTotalRub, isPmc);
        }
        // Pockets
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.POCKET, botJsonTemplate), [EquipmentSlots_1.EquipmentSlots.POCKETS], pocketLootCount, botInventory, botRole, botItemLimits, this.pmcConfig.maxPocketLootTotalRub, isPmc);
        // Secure
        this.addLootFromPool(this.botLootCacheService.getLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.SECURE, botJsonTemplate), [EquipmentSlots_1.EquipmentSlots.SECURED_CONTAINER], 50, botInventory, botRole, null, -1, isPmc);
    }
    generateBackpackLoot(sessionId, botLevel, botRole, botInventory, botJsonTemplate, isPmc, raidInfo) {
        const mapLootTable = this.getMapData(raidInfo);
        const globalLootTableAvailable = backpackLootConfig.global.weights.length > 0;
        let selectedLootDataForBot;
        if (mapLootTable && isPmc) {
            selectedLootDataForBot = this.getBotLootData(botLevel, mapLootTable);
        }
        let backpackLootCount = config.pmcBackpackLoot && isPmc && selectedLootDataForBot ?
            this.randomUtil.getInt(selectedLootDataForBot.min_items, selectedLootDataForBot.max_items) :
            this.weightedRandomHelper.getWeightedValue(botJsonTemplate.generation.items.backpackLoot.weights);
        const containersBotHasAvailable = this.getAvailableContainersBotCanStoreItemsIn(botInventory);
        const canAddBackpackLoot = containersBotHasAvailable.includes(EquipmentSlots_1.EquipmentSlots.BACKPACK) && !config.disableBotBackpackLoot;
        const canUseCustomBackpackLoot = mapLootTable || globalLootTableAvailable;
        if (!canAddBackpackLoot || !canUseCustomBackpackLoot) {
            return;
        }
        const canAddWeaponsToBackpack = backpackLootConfig.include_weapons && this.randomUtil.getChance100(this.pmcConfig.looseWeaponInBackpackChancePercent);
        if (canAddWeaponsToBackpack) {
            this.addLooseWeaponsToInventorySlot(sessionId, botInventory, EquipmentSlots_1.EquipmentSlots.BACKPACK, botJsonTemplate.inventory, botJsonTemplate.chances.weaponMods, botRole, isPmc, botLevel);
        }
        //Keycards and rare keys
        //TODO -- keycard and rare keys should have weights attached to them
        const shouldAddKeycard = this.randomUtil.getChance100((selectedLootDataForBot?.keycard_chance || backpackLootConfig.global.keycard_chance) * 100);
        const shouldAddRareKey = this.randomUtil.getChance100((selectedLootDataForBot?.rare_key_chance || backpackLootConfig.global.rare_key_chance) * 100);
        if (shouldAddKeycard) {
            const keycardTpl = this.randomUtil.getArrayValue(this.randomUtil.shuffle(backpackLootConfig.loot_tables.keycards));
            this.addLootFromPool({ [keycardTpl]: 1 }, [EquipmentSlots_1.EquipmentSlots.BACKPACK], 1, botInventory, botRole, null, -1, isPmc);
            backpackLootCount--;
        }
        if (shouldAddRareKey) {
            const rareKeyTpl = this.randomUtil.getArrayValue(this.randomUtil.shuffle(backpackLootConfig.loot_tables.rare_keys));
            this.addLootFromPool({ [rareKeyTpl]: 1 }, [EquipmentSlots_1.EquipmentSlots.BACKPACK], 1, botInventory, botRole, null, -1, isPmc);
            backpackLootCount--;
        }
        if (mapLootTable) {
            const combinedLootTable = (0, lootGeneratorHelper_1.combineMapItemListIntoArray)(selectedLootDataForBot);
            const itemTplsAdded = {};
            this.addLootFromList(this.getBackpackLootItemList(combinedLootTable, selectedLootDataForBot.weights, backpackLootCount, itemTplsAdded), [EquipmentSlots_1.EquipmentSlots.BACKPACK], botInventory, botRole, isPmc);
            return;
        }
        if (globalLootTableAvailable && backpackLootCount > 0) {
            const combinedLootTable = (0, lootGeneratorHelper_1.combineGlobalItemListIntoArray)();
            const itemTplsAdded = {};
            this.addLootFromList(this.getBackpackLootItemList(combinedLootTable, backpackLootConfig.global.weights, backpackLootCount, itemTplsAdded), [EquipmentSlots_1.EquipmentSlots.BACKPACK], botInventory, botRole, isPmc);
        }
    }
    getMapData(raidInfo) {
        if (Object.prototype.hasOwnProperty.call(backpackLootConfig.custom_map_loot_tables, raidInfo.location)) {
            return backpackLootConfig.custom_map_loot_tables[raidInfo.location];
        }
        return null;
    }
    getBotLootData(botLevel, lootTableGroups) {
        return lootTableGroups.find((group) => botLevel >= group.min_level && botLevel <= group.max_level);
    }
    getBackpackLootItem(lootTableArray, weights, botAddedBackpackItems) {
        const selectedLootTable = this.weightedRandomHelper.weightedRandom(lootTableArray, weights);
        let selectedItemTpl = this.randomUtil.getArrayValue(this.randomUtil.shuffle(selectedLootTable.item));
        while (Object.prototype.hasOwnProperty.call(botAddedBackpackItems, selectedItemTpl) && botAddedBackpackItems[selectedItemTpl] >= backpackLootConfig.duplicate_item_limit) {
            selectedItemTpl = this.randomUtil.getArrayValue(this.randomUtil.shuffle(selectedLootTable.item));
        }
        if (!Object.prototype.hasOwnProperty.call(botAddedBackpackItems, selectedItemTpl)) {
            botAddedBackpackItems[selectedItemTpl] = 1;
        }
        if (Object.prototype.hasOwnProperty.call(botAddedBackpackItems, selectedItemTpl)) {
            botAddedBackpackItems[selectedItemTpl]++;
        }
        return selectedItemTpl;
    }
    getBackpackLootItemList(lootTableArray, weights, amountToAdd, botAddedBackpackItems) {
        return Array.from({ length: amountToAdd }, () => "").map(() => this.getBackpackLootItem(lootTableArray, weights, botAddedBackpackItems));
    }
    addLootFromList(itemList, equipmentSlots, inventoryToAddItemsTo, botRole, isPmc) {
        const itemListSize = itemList.length;
        if (itemListSize > 0) {
            let fitItemIntoContainerAttempts = 0;
            for (let i = 0; i < itemListSize; i++) {
                if (itemList.length === 0) {
                    return;
                }
                const itemTpl = itemList.shift();
                const item = this.itemHelper.getItem(itemTpl);
                const itemToAddTemplate = item[1];
                if (!item[0]) {
                    this.logger.warning(`Unable to process item tpl: ${itemTpl} for slots: ${equipmentSlots} on bot: ${botRole}`);
                    continue;
                }
                const newRootItemId = this.hashUtil.generate();
                const itemWithChildrenToAdd = [{
                        _id: newRootItemId,
                        _tpl: itemToAddTemplate._id,
                        ...this.botGeneratorHelper.generateExtraPropertiesForItem(itemToAddTemplate, botRole)
                    }];
                if (this.botConfig.walletLoot.walletTplPool.includes(itemTpl)) {
                    const addCurrencyToWallet = this.randomUtil.getChance100(this.botConfig.walletLoot.chancePercent);
                    if (addCurrencyToWallet) {
                        const itemsToAdd = this.createWalletLoot(newRootItemId);
                        const containerGrid = this.inventoryHelper.getContainerSlotMap(itemTpl);
                        const canAddToContainer = this.inventoryHelper.canPlaceItemsInContainer(this.cloner.clone(containerGrid), itemsToAdd);
                        if (canAddToContainer) {
                            for (const itemToAdd of itemsToAdd) {
                                this.inventoryHelper.placeItemInContainer(containerGrid, itemToAdd, itemWithChildrenToAdd[0]._id, "main");
                            }
                        }
                    }
                }
                this.addRequiredChildItemsToParent(itemToAddTemplate, itemWithChildrenToAdd, isPmc, botRole);
                const itemAddedResult = this.botGeneratorHelper.addItemWithChildrenToEquipmentSlot(equipmentSlots, newRootItemId, itemToAddTemplate._id, itemWithChildrenToAdd, inventoryToAddItemsTo);
                if (itemAddedResult !== ItemAddedResult_1.ItemAddedResult.SUCCESS) {
                    if (itemAddedResult === ItemAddedResult_1.ItemAddedResult.NO_CONTAINERS) {
                        this.logger.debug(`Unable to add: ${itemListSize} items to bot as it lacks a container to include them`);
                        break;
                    }
                    fitItemIntoContainerAttempts++;
                    if (fitItemIntoContainerAttempts >= 4) {
                        this.logger.debug(`Failed to place item ${i} of ${itemListSize} items into ${botRole} containers: ${equipmentSlots.join(",")}
                            Tried ${fitItemIntoContainerAttempts} times, reason: ${ItemAddedResult_1.ItemAddedResult[itemAddedResult]}, skipping`);
                        // Original method breaks here, but the next item could fit
                        fitItemIntoContainerAttempts = 0;
                        continue;
                    }
                    itemList.unshift(itemTpl); // Add item back into item list
                    i--;
                    continue;
                }
                fitItemIntoContainerAttempts = 0;
            }
        }
    }
};
exports.LootGenerator = LootGenerator;
exports.LootGenerator = LootGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(5, (0, tsyringe_1.inject)("DatabaseService")),
    __param(6, (0, tsyringe_1.inject)("HandbookHelper")),
    __param(7, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(8, (0, tsyringe_1.inject)("BotWeaponGenerator")),
    __param(9, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(10, (0, tsyringe_1.inject)("BotHelper")),
    __param(11, (0, tsyringe_1.inject)("BotLootCacheService")),
    __param(12, (0, tsyringe_1.inject)("LocalisationService")),
    __param(13, (0, tsyringe_1.inject)("ConfigServer")),
    __param(14, (0, tsyringe_1.inject)("PrimaryCloner")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _e : Object, typeof (_f = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _f : Object, typeof (_g = typeof HandbookHelper_1.HandbookHelper !== "undefined" && HandbookHelper_1.HandbookHelper) === "function" ? _g : Object, typeof (_h = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _h : Object, typeof (_j = typeof BotWeaponGenerator_1.BotWeaponGenerator !== "undefined" && BotWeaponGenerator_1.BotWeaponGenerator) === "function" ? _j : Object, typeof (_k = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _k : Object, typeof (_l = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _l : Object, typeof (_m = typeof BotLootCacheService_1.BotLootCacheService !== "undefined" && BotLootCacheService_1.BotLootCacheService) === "function" ? _m : Object, typeof (_o = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _o : Object, typeof (_p = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _p : Object, typeof (_q = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _q : Object])
], LootGenerator);
//# sourceMappingURL=lootGenerator.js.map