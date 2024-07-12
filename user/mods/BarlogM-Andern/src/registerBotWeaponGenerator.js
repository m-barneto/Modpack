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
const config = __importStar(require("../config/config.json"));
function registerBotWeaponGenerator(container) {
    const logger = container.resolve("WinstonLogger");
    const botWeaponGenerator = container.resolve("BotWeaponGenerator");
    const pmcWeaponGenerator = container.resolve("AndernWeaponGenerator");
    container.afterResolution("BotWeaponGenerator", (_t, result) => {
        result.generateRandomWeapon = (sessionId, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel) => {
            if (isPmc) {
                const modPool = botTemplateInventory.mods;
                const weapon = pmcWeaponGenerator.generateWeapon("", botLevel, weaponParentId, false);
                const res = {
                    weapon: weapon.weaponWithMods,
                    chosenAmmoTpl: weapon.ammoTpl,
                    chosenUbglAmmoTpl: undefined,
                    weaponMods: modPool,
                    weaponTemplate: weapon.weaponTemplate,
                };
                if (config.debug)
                    logger.info(`[Andern] weapon generated: ${JSON.stringify(res)}`);
                return res;
            }
            return botWeaponGenerator.generateRandomWeapon(sessionId, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel);
        };
    }, { frequency: "Always" });
    logger.info("[Andern] PMC Bot Weapon Generator registered");
}
exports.default = registerBotWeaponGenerator;
//# sourceMappingURL=registerBotWeaponGenerator.js.map