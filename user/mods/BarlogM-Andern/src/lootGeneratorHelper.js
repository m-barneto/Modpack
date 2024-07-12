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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineGlobalItemListIntoArray = exports.combineMapItemListIntoArray = void 0;
const models_1 = require("./models");
const backpackLootConfig = __importStar(require("../config/backpack.json"));
function combineMapItemListIntoArray(selectedMapLootData) {
    const mapPmcBackpackLootTables = [
        [...backpackLootConfig.loot_tables.extremely_rare],
        [...backpackLootConfig.loot_tables.rare],
        [...backpackLootConfig.loot_tables.valuable],
        [...backpackLootConfig.loot_tables.common]
    ];
    if (selectedMapLootData.include_normal_keys) {
        mapPmcBackpackLootTables[models_1.LootTableIndexs.COMMON].push(...backpackLootConfig.loot_tables.common_keys);
    }
    const weightArrayLength = selectedMapLootData.weights.length;
    return mapPmcBackpackLootTables.slice(0, weightArrayLength);
}
exports.combineMapItemListIntoArray = combineMapItemListIntoArray;
function combineGlobalItemListIntoArray() {
    const mapPmcBackpackLootTables = [
        [...backpackLootConfig.loot_tables.extremely_rare],
        [...backpackLootConfig.loot_tables.rare],
        [...backpackLootConfig.loot_tables.valuable],
        [...backpackLootConfig.loot_tables.common]
    ];
    if (backpackLootConfig.global.include_normal_keys) {
        mapPmcBackpackLootTables[models_1.LootTableIndexs.COMMON].push(...backpackLootConfig.loot_tables.common_keys);
    }
    const weightArrayLength = backpackLootConfig.global.weights.length;
    return mapPmcBackpackLootTables.slice(0, weightArrayLength);
}
exports.combineGlobalItemListIntoArray = combineGlobalItemListIntoArray;
//# sourceMappingURL=lootGeneratorHelper.js.map