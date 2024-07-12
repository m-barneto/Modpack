"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearGeneratorHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const Data_1 = require("./Data");
let GearGeneratorHelper = class GearGeneratorHelper {
    logger;
    hashUtil;
    randomUtil;
    itemHelper;
    botGeneratorHelper;
    databaseServer;
    data;
    necessaryModSlots = [
        "helmet_top",
        "helmet_back",
        "helmet_ears",
        "front_plate",
        "back_plate",
        "left_side_plate",
        "right_side_plate",
        "groin",
        "groin_back",
        "collar",
        "shoulder_l",
        "shoulder_r",
        "soft_armor_front",
        "soft_armor_back",
        "soft_armor_left",
        "soft_armor_right"
    ];
    weightedModSlots = [
        "front_plate",
        "back_plate",
        "left_side_plate",
        "right_side_plate"
    ];
    platesWeights = {
        "one": {
            3: 60,
            4: 40,
            5: 0,
            6: 0
        },
        "two": {
            3: 20,
            4: 80,
            5: 0,
            6: 0
        },
        "three": {
            3: 0,
            4: 40,
            5: 50,
            6: 10
        },
        "four": {
            3: 0,
            4: 20,
            5: 50,
            6: 30
        },
    };
    modsData;
    setModsData() {
        const tables = this.databaseServer.getTables();
        this.modsData = tables.bots.types["usec"].inventory.mods;
    }
    constructor(logger, hashUtil, randomUtil, itemHelper, botGeneratorHelper, databaseServer, data) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.itemHelper = itemHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.databaseServer = databaseServer;
        this.data = data;
    }
    putGearItemToInventory(equipmentSlot, botRole, botInventory, equipmentItemTpl, useWeights, botLevel) {
        const id = this.hashUtil.generate();
        const [isItemExists, itemTemplate] = this.itemHelper.getItem(equipmentItemTpl);
        if (!isItemExists) {
            this.logger.error(`[Andern] wrong template id ${equipmentItemTpl} for slot ${equipmentSlot}`);
        }
        let extraProps;
        try {
            extraProps = this.botGeneratorHelper.generateExtraPropertiesForItem(itemTemplate, botRole);
        }
        catch (e) {
            this.logger.error(`[Andern] wrong template id ${equipmentItemTpl} for slot ${equipmentSlot}`);
        }
        const item = {
            _id: id,
            _tpl: equipmentItemTpl,
            parentId: botInventory.equipment,
            slotId: equipmentSlot,
            ...extraProps,
        };
        if (equipmentSlot === EquipmentSlots_1.EquipmentSlots.HEADWEAR ||
            equipmentSlot === EquipmentSlots_1.EquipmentSlots.ARMOR_VEST ||
            equipmentSlot === EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST) {
            this.addNecessaryMods(botRole, botInventory, equipmentItemTpl, id, useWeights, botLevel);
        }
        botInventory.items.push(item);
        return id;
    }
    putModItemToInventory(botRole, botInventory, equipmentItemTpl, slotId, parentId) {
        const id = this.hashUtil.generate();
        const [isItemExists, itemTemplate] = this.itemHelper.getItem(equipmentItemTpl);
        if (!isItemExists) {
            this.logger.error(`[Andern] wrong template id ${equipmentItemTpl} for slot ${slotId}`);
        }
        const item = {
            _id: id,
            _tpl: equipmentItemTpl,
            parentId,
            slotId,
            ...this.botGeneratorHelper.generateExtraPropertiesForItem(itemTemplate, botRole),
        };
        if (item.upd?.Togglable?.On !== undefined) {
            item.upd.Togglable.On = true;
        }
        botInventory.items.push(item);
        return id;
    }
    replaceEarpiece(tpl) {
        // "GSSh-01 active headset" -> "OPSMEN Earmor M32 headset"
        if (tpl === "5b432b965acfc47a8774094e") {
            return "6033fa48ffd42c541047f728";
        }
        // "Peltor ComTac 2 headset" -> "OPSMEN Earmor M32 headset"
        if (tpl === "5645bcc04bdc2d363b8b4572") {
            return "6033fa48ffd42c541047f728";
        }
        // "Peltor Tactical Sport headset" -> "OPSMEN Earmor M32 headset"
        if (tpl === "5c165d832e2216398b5a7e36") {
            return "6033fa48ffd42c541047f728";
        }
        // "MSA Sordin Supreme PRO-X/L active headset" -> "Walker's XCEL 500BT Digital headset"
        if (tpl === "5aa2ba71e5b5b000137b758f") {
            return "5f60cd6cf2bcbb675b00dac6";
        }
        // "Walkers Razor Digital headset" -> "Walker's XCEL 500BT Digital headset"
        if (tpl === "5e4d34ca86f774264f758330") {
            return "5f60cd6cf2bcbb675b00dac6";
        }
        return tpl;
    }
    addNecessaryMods(botRole, botInventory, tpl, id, useWeights, botLevel) {
        if (this.modsData === undefined) {
            this.setModsData();
        }
        const mods = this.modsData[tpl];
        if (mods === undefined) {
            return;
        }
        Object.entries(mods).forEach(([modSlot, modsArray]) => {
            const modSlotName = modSlot.toLowerCase();
            let selectedModTpl;
            if (this.necessaryModSlots.includes(modSlotName)) {
                if (useWeights && this.weightedModSlots.includes(modSlotName)) {
                    const plateWeights = this.plateWeightsByLevel(botLevel);
                    const plateItems = modsArray
                        .map((tpl) => [tpl, this.data.getPlateArmorClassByPlateTpl(tpl)])
                        .map(([tpl, armorClass]) => {
                        return {
                            weight: plateWeights[armorClass],
                            id: tpl,
                            name: ""
                        };
                    });
                    selectedModTpl = this.weightedRandomGearItem(plateItems).id;
                }
                else {
                    const keys = Object.keys(modsArray);
                    const randomKey = this.randomUtil.getArrayValue(keys);
                    selectedModTpl = modsArray[randomKey];
                }
                this.putModItemToInventory(botRole, botInventory, selectedModTpl, modSlot, id);
            }
        });
    }
    plateWeightsByLevel(level) {
        if (level < 15) {
            return this.platesWeights.one;
        }
        else if (level >= 15 && level < 32) {
            return this.platesWeights.two;
        }
        else if (level >= 32 && level < 42) {
            return this.platesWeights.three;
        }
        else {
            return this.platesWeights.four;
        }
    }
    weightedRandomGearItem(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.weight;
            if (random <= 0) {
                return item;
            }
        }
        return items[0];
    }
};
exports.GearGeneratorHelper = GearGeneratorHelper;
exports.GearGeneratorHelper = GearGeneratorHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(5, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(6, (0, tsyringe_1.inject)("AndernData")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _e : Object, typeof (_f = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _f : Object, typeof (_g = typeof Data_1.Data !== "undefined" && Data_1.Data) === "function" ? _g : Object])
], GearGeneratorHelper);
//# sourceMappingURL=GearGeneratorHelper.js.map