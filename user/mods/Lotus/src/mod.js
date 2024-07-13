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
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const ItemGenerator_1 = require("./CustomItems/ItemGenerator");
const References_1 = require("./Refs/References");
const Lotus_1 = require("./Trader/Lotus");
const Utils_1 = require("./Refs/Utils");
const baseJson = __importStar(require("../db/base.json"));
const questAssort = __importStar(require("../db/questassort.json"));
class Lotus {
    mod;
    logger;
    ref = new References_1.References();
    utils = new Utils_1.Utils();
    constructor() {
        this.mod = "Lotus";
    }
    preSptLoad(container) {
        this.ref.preSptLoad(container);
        const ragfair = this.ref.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const traderConfig = this.ref.configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const traderUtils = new Utils_1.TraderUtils();
        const traderData = new Lotus_1.TraderData(traderConfig, this.ref, traderUtils, this.ref.jsonUtil);
        traderData.registerProfileImage();
        traderData.setupTraderUpdateTime();
        Traders_1.Traders[baseJson._id] = baseJson._id;
        ragfair.traders[baseJson._id] = true;
    }
    postDBLoad(container) {
        this.ref.postDBLoad(container);
        const traderConfig = this.ref.configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfair = this.ref.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const locations = this.ref.tables.locations;
        const itemGenerator = new ItemGenerator_1.ItemGenerator();
        const traderUtils = new Utils_1.TraderUtils();
        const traderData = new Lotus_1.TraderData(traderConfig, this.ref, traderUtils, this.ref.jsonUtil);
        traderData.pushTrader();
        this.ref.tables.traders[baseJson._id].questassort = questAssort;
        traderData.addTraderToLocales(this.ref.tables, baseJson.name, "Lotus", baseJson.nickname, baseJson.location, "A businesswoman who travels around conflict zones around the world.");
        itemGenerator.createLotusKeycard(this.ref.customItem, this.utils, this.ref.tables);
        ragfair.dynamic.blacklist.custom.push(...["LotusKeycard"]);
        locations["laboratory"].base.AccessKeys.push(...["LotusKeycard"]);
        this.ref.logger.log("Lotus arrived in Tarkov.", LogTextColor_1.LogTextColor.GREEN);
        this.ref.logger.log("Thanks for using my trader!", LogTextColor_1.LogTextColor.GREEN);
    }
}
module.exports = { mod: new Lotus() };
//# sourceMappingURL=mod.js.map