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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Andern = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const MemberCategory_1 = require("C:/snapshot/project/obj/models/enums/MemberCategory");
const DoeTraderArmorGenerator_1 = require("./DoeTraderArmorGenerator");
const ModConfig_1 = require("./ModConfig");
const DoeTrader_1 = require("./DoeTrader");
const Data_1 = require("./Data");
const lootGenerator_1 = require("./lootGenerator");
const WeaponGenerator_1 = require("./WeaponGenerator");
const GearGenerator_1 = require("./GearGenerator");
const GearGeneratorHelper_1 = require("./GearGeneratorHelper");
const HelmetGenerator_1 = require("./HelmetGenerator");
const registerInfoUpdater_1 = __importDefault(require("./registerInfoUpdater"));
const registerBotLootGenerator_1 = __importDefault(require("./registerBotLootGenerator"));
const registerBotLevelGenerator_1 = __importDefault(require("./registerBotLevelGenerator"));
const registerBotInventoryGenerator_1 = __importDefault(require("./registerBotInventoryGenerator"));
const registerBotWeaponGenerator_1 = __importDefault(require("./registerBotWeaponGenerator"));
const RaidInfo_1 = require("./RaidInfo");
const lootUtils_1 = require("./lootUtils");
const mapBotTuning_1 = require("./mapBotTuning");
const questUtils_1 = __importDefault(require("./questUtils"));
const weaponUtils_1 = __importDefault(require("./weaponUtils"));
const seasonUtils_1 = require("./seasonUtils");
const config = __importStar(require("../config/config.json"));
const registerRandomSeason_1 = __importDefault(require("./registerRandomSeason"));
class Andern {
    fullModName;
    modPath;
    logger;
    doeTrader;
    constructor() {
        this.fullModName = `${ModConfig_1.ModConfig.authorName}-${ModConfig_1.ModConfig.modName}`;
    }
    preSptLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const preSptModLoader = container.resolve("PreSptModLoader");
        this.modPath = `./${preSptModLoader.getModPath(this.fullModName)}`;
        container.register("AndernModPath", { useValue: this.modPath });
        container.register("AndernRaidInfo", RaidInfo_1.RaidInfo, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernData", Data_1.Data, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernLootGenerator", lootGenerator_1.LootGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernWeaponGenerator", WeaponGenerator_1.WeaponGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernGearGeneratorHelper", GearGeneratorHelper_1.GearGeneratorHelper, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernHelmetGenerator", HelmetGenerator_1.HelmetGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernGearGenerator", GearGenerator_1.GearGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernDoeTraderArmorGenerator", DoeTraderArmorGenerator_1.DoeTraderArmorGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        container.register("AndernDoeTrader", DoeTrader_1.DoeTrader, {
            lifecycle: tsyringe_1.Lifecycle.Singleton
        });
        this.doeTrader = container.resolve("AndernDoeTrader");
        (0, registerInfoUpdater_1.default)(container);
        if (config.seasonRandom) {
            (0, registerRandomSeason_1.default)(container);
        }
        if (config.pmcBackpackLoot || config.disableBotBackpackLoot) {
            (0, registerBotLootGenerator_1.default)(container);
        }
        if (config.pmcLevels) {
            (0, registerBotLevelGenerator_1.default)(container);
        }
        if (config.pmcGear) {
            (0, registerBotInventoryGenerator_1.default)(container);
        }
        else if (config.pmcWeapon) {
            (0, registerBotWeaponGenerator_1.default)(container);
        }
        this.doeTrader.prepareTrader(preSptModLoader, this.fullModName);
    }
    postDBLoad(container) {
        (0, lootUtils_1.lootConfig)(container);
        this.doeTrader.registerTrader();
        if (config.fleaBlacklistDisable) {
            this.disableFleaBlacklist(container);
        }
        container.resolve("AndernData").fillArmorPlatesData();
    }
    postSptLoad(container) {
        this.setMinFleaLevel(container);
        if (config.trader && config.traderInsurance) {
            this.doeTrader.traderInsurance();
        }
        if (config.trader && config.traderRepair) {
            this.doeTrader.traderRepair();
        }
        if (config.insuranceOnLab) {
            this.enableInsuranceOnLab(container);
        }
        if (config.mapBotSettings) {
            (0, mapBotTuning_1.mapBotTuning)(container, this.modPath, this.logger);
        }
        (0, mapBotTuning_1.setPmcForceHealingItems)(container, this.logger);
        if (config.disablePmcBackpackWeapon ||
            config.lootingBotsCompatibility) {
            this.disablePmcBackpackWeapon(container);
        }
        if (config.disableEmissaryPmcBots) {
            this.disableEmissaryPmcBots(container);
        }
        if (config.disableSeasonalEvents) {
            this.disableSeasonalEvents(container);
        }
        if (config.insuranceIncreaseStorageTime || config.insuranceDecreaseReturnTime) {
            this.insuranceTune(container);
        }
        if (config.cheeseQuests) {
            (0, questUtils_1.default)(container);
        }
        (0, weaponUtils_1.default)(container);
        if (config.seasonRandom) {
            (0, seasonUtils_1.setSeasonRandom)(container);
        }
        else {
            (0, seasonUtils_1.setSeasonFromConfig)(container);
        }
        if (config.disableBtr) {
            this.disableBtr(container);
        }
        if (config.playerScavAlwaysHasBackpack) {
            this.playerScavAlwaysHasBackpack(container);
        }
    }
    setMinFleaLevel(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const fleaMarket = tables.globals.config.RagFair;
        if (config.fleaMinUserLevel) {
            fleaMarket.minUserLevel = config.fleaMinUserLevel;
            this.logger.info(`[Andern] Flea Market minimal user level set to ${config.fleaMinUserLevel}`);
        }
    }
    enableInsuranceOnLab(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const mapLab = databaseServer.getTables().locations["laboratory"].base;
        mapLab.Insurance = true;
    }
    disableEmissaryPmcBots(container) {
        const configServer = container.resolve("ConfigServer");
        const pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        for (const memberCategoryKey of Object.keys(MemberCategory_1.MemberCategory).filter((key) => !isNaN(Number(key)))) {
            pmcConfig.accountTypeWeight[memberCategoryKey] = 0;
        }
        pmcConfig.accountTypeWeight[MemberCategory_1.MemberCategory.DEFAULT] = 25;
    }
    disablePmcBackpackWeapon(container) {
        const configServer = container.resolve("ConfigServer");
        const pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        pmcConfig.looseWeaponInBackpackChancePercent = 0;
        pmcConfig.looseWeaponInBackpackLootMinMax = { min: 0, max: 0 };
    }
    disableSeasonalEvents(container) {
        const configServer = container.resolve("ConfigServer");
        const seasonalEventConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.SEASONAL_EVENT);
        seasonalEventConfig.enableSeasonalEventDetection = false;
    }
    insuranceTune(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const traders = databaseServer.getTables().traders;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const PRAPOR_ID = "54cb50c76803fa8b248b4571";
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const THERAPIST_ID = "54cb57776803fa99248b456e";
        if (config.insuranceDecreaseReturnTime) {
            traders[PRAPOR_ID].base.insurance.min_return_hour = 2;
            traders[PRAPOR_ID].base.insurance.max_return_hour = 3;
            traders[THERAPIST_ID].base.insurance.min_return_hour = 1;
            traders[THERAPIST_ID].base.insurance.max_return_hour = 2;
        }
        if (config.insuranceIncreaseStorageTime) {
            traders[PRAPOR_ID].base.insurance.max_storage_time = 336;
            traders[THERAPIST_ID].base.insurance.max_storage_time = 336;
        }
    }
    disableFleaBlacklist(container) {
        const configServer = container.resolve("ConfigServer");
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        ragfairConfig.dynamic.blacklist.enableBsgList = false;
        ragfairConfig.dynamic.blacklist.traderItems = true;
    }
    disableBtr(container) {
        const databaseServer = container.resolve("DatabaseServer");
        databaseServer.getTables().globals.config.BTRSettings.LocationsWithBTR = [];
    }
    playerScavAlwaysHasBackpack(container) {
        const configServer = container.resolve("ConfigServer");
        const playerScavConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PLAYERSCAV);
        Object.entries(playerScavConfig.karmaLevel).forEach(([karmaLevel, karmaValues]) => {
            karmaValues.modifiers.equipment["Backpack"] = 100;
        });
    }
}
exports.Andern = Andern;
module.exports = { mod: new Andern() };
//# sourceMappingURL=mod.js.map