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
exports.setSeasonRandom = exports.setSeasonFromConfig = exports.getSeasonByName = void 0;
const Season_1 = require("C:/snapshot/project/obj/models/enums/Season");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config = __importStar(require("../config/config.json"));
function getSeasonByName(seasonName) {
    const seasonNameUpperCase = seasonName.toUpperCase();
    if (seasonNameUpperCase === "SUMMER") {
        return Season_1.Season.SUMMER;
    }
    else if (seasonNameUpperCase === "AUTUMN") {
        return Season_1.Season.AUTUMN;
    }
    else if (seasonNameUpperCase === "WINTER") {
        return Season_1.Season.WINTER;
    }
    else if (seasonNameUpperCase === "SPRING") {
        return Season_1.Season.SPRING;
    }
    else if (seasonNameUpperCase === "STORM") {
        return Season_1.Season.STORM;
    }
    else {
        return undefined;
    }
}
exports.getSeasonByName = getSeasonByName;
function setSeasonFromConfig(container) {
    const season = getSeasonByName(config.season);
    if (season != undefined) {
        setSeason(container, season);
    }
}
exports.setSeasonFromConfig = setSeasonFromConfig;
function setSeasonRandom(container) {
    const season = getRandomSeason(container);
    setSeason(container, season);
}
exports.setSeasonRandom = setSeasonRandom;
function setSeason(container, season) {
    const configServer = container.resolve("ConfigServer");
    const weatherConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.WEATHER);
    weatherConfig.overrideSeason = season;
}
function getRandomSeason(container) {
    const randomUtil = container.resolve("RandomUtil");
    const seasons = [Season_1.Season.WINTER, Season_1.Season.SPRING, Season_1.Season.SUMMER, Season_1.Season.AUTUMN, Season_1.Season.STORM];
    return randomUtil.getArrayValue(seasons);
}
//# sourceMappingURL=seasonUtils.js.map