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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoeTrader = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const ImageRouter_1 = require("C:/snapshot/project/obj/routers/ImageRouter");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const TraderHelpers_1 = require("./TraderHelpers");
const FluentTraderAssortCreator_1 = require("./FluentTraderAssortCreator");
const DoeTraderArmorGenerator_1 = require("./DoeTraderArmorGenerator");
const ModConfig_1 = require("./ModConfig");
const baseJson = __importStar(require("../trader/base.json"));
const config = __importStar(require("../config/config.json"));
const fs = __importStar(require("fs"));
const json5_1 = __importDefault(require("C:/snapshot/project/node_modules/json5"));
class TraderItems {
    one;
    two;
    three;
    four;
}
let DoeTrader = class DoeTrader {
    logger;
    hashUtil;
    imageRouter;
    databaseServer;
    configServer;
    jsonUtil;
    itemHelper;
    traderArmorGenerator;
    modPath;
    items;
    traderHelper;
    fluentTraderAssortHelper;
    constructor(logger, hashUtil, imageRouter, databaseServer, configServer, jsonUtil, itemHelper, traderArmorGenerator, modPath) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.imageRouter = imageRouter;
        this.databaseServer = databaseServer;
        this.configServer = configServer;
        this.jsonUtil = jsonUtil;
        this.itemHelper = itemHelper;
        this.traderArmorGenerator = traderArmorGenerator;
        this.modPath = modPath;
        if (config.trader) {
            this.loadData();
        }
    }
    loadData() {
        const fullFileName = `${this.modPath}/trader/items.json5`;
        const jsonData = fs.readFileSync(fullFileName, "utf-8");
        this.items = new TraderItems();
        Object.assign(this.items, json5_1.default.parse(jsonData));
    }
    addAllItems(fluentTraderAssortHeper, tables) {
        this.addTierItems(fluentTraderAssortHeper, tables, this.items.one, 1);
        this.addTierItems(fluentTraderAssortHeper, tables, this.items.two, 2);
        this.addTierItems(fluentTraderAssortHeper, tables, this.items.three, 3);
        this.addTierItems(fluentTraderAssortHeper, tables, this.items.four, 4);
    }
    addTierItems(fluentTraderAssortHeper, tables, items, loyaltyLevel) {
        items.forEach((itemTpl) => {
            if (this.traderArmorGenerator.isArmor(itemTpl)) {
                const items = this.traderArmorGenerator.getArmor(itemTpl);
                const itemTpls = items.map(i => i._tpl);
                fluentTraderAssortHeper.createComplexAssortItem(items)
                    .addMoneyCost(Money_1.Money.ROUBLES, this.itemHelper.getItemAndChildrenPrice(itemTpls))
                    .addLoyaltyLevel(loyaltyLevel)
                    .export(tables.traders[baseJson._id]);
            }
            else {
                fluentTraderAssortHeper
                    .createSingleAssortItem(itemTpl)
                    .addMoneyCost(Money_1.Money.ROUBLES, this.itemHelper.getItemPrice(itemTpl))
                    .addLoyaltyLevel(loyaltyLevel)
                    .export(tables.traders[baseJson._id]);
            }
        });
    }
    prepareTrader(preSptModLoader, fullModName) {
        if (config.trader) {
            this.prepareTraderImpl(preSptModLoader, fullModName);
        }
    }
    prepareTraderImpl(preSptModLoader, fullModName) {
        const traderConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.traderHelper = new TraderHelpers_1.TraderHelper();
        this.fluentTraderAssortHelper = new FluentTraderAssortCreator_1.FluentAssortConstructor(this.hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, fullModName, preSptModLoader, this.imageRouter, "doetrader.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 2400, 3600);
        Traders_1.Traders[baseJson._id] = baseJson._id;
    }
    registerTrader() {
        if (config.trader) {
            this.registerTraderImpl();
        }
    }
    registerTraderImpl() {
        const tables = this.databaseServer.getTables();
        this.traderHelper.addTraderToDb(baseJson, tables, this.jsonUtil);
        this.addAllItems(this.fluentTraderAssortHelper, tables);
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, ModConfig_1.ModConfig.traderName, baseJson.nickname, baseJson.location, ModConfig_1.ModConfig.traderDescription);
        const ragfairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        ragfairConfig.traders[baseJson._id] = true;
        this.logger.info("[Andern] Doe trader registered");
    }
    traderInsurance() {
        const praporId = "54cb50c76803fa8b248b4571";
        const traders = this.databaseServer.getTables().traders;
        const doeTraderId = baseJson._id;
        const praporDialogs = JSON.parse(JSON.stringify(traders[praporId].dialogue));
        const trader = traders[doeTraderId];
        trader.dialogue = praporDialogs;
        trader.base.insurance.availability = true;
        const insuranceConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.INSURANCE);
        insuranceConfig.returnChancePercent[doeTraderId] = 100;
        insuranceConfig.runIntervalSeconds = 60;
    }
    traderRepair() {
        const doeTraderId = baseJson._id;
        const trader = this.databaseServer.getTables().traders[doeTraderId];
        trader.base.repair.availability = true;
    }
};
exports.DoeTrader = DoeTrader;
exports.DoeTrader = DoeTrader = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("ImageRouter")),
    __param(3, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(4, (0, tsyringe_1.inject)("ConfigServer")),
    __param(5, (0, tsyringe_1.inject)("JsonUtil")),
    __param(6, (0, tsyringe_1.inject)("ItemHelper")),
    __param(7, (0, tsyringe_1.inject)("AndernDoeTraderArmorGenerator")),
    __param(8, (0, tsyringe_1.inject)("AndernModPath")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof ImageRouter_1.ImageRouter !== "undefined" && ImageRouter_1.ImageRouter) === "function" ? _c : Object, typeof (_d = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _d : Object, typeof (_e = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _e : Object, typeof (_f = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _f : Object, typeof (_g = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _g : Object, typeof (_h = typeof DoeTraderArmorGenerator_1.DoeTraderArmorGenerator !== "undefined" && DoeTraderArmorGenerator_1.DoeTraderArmorGenerator) === "function" ? _h : Object, String])
], DoeTrader);
//# sourceMappingURL=DoeTrader.js.map