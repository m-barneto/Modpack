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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WavesGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ILocationBase_1 = require("C:/snapshot/project/obj/models/eft/common/ILocationBase");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config = __importStar(require("../config/config.json"));
let WavesGenerator = class WavesGenerator {
    logger;
    hashUtil;
    randomUtil;
    databaseServer;
    configServer;
    locationsToIgnore = [
        "base",
        "develop",
        "hideout",
        "privatearea",
        "suburbs",
        "terminal",
        "town",
    ];
    streetsAllZones = [
        "ZoneCarShowroom",
        "ZoneCard1",
        "ZoneCinema",
        "ZoneColumn",
        "ZoneConcordiaParking",
        "ZoneConcordia_1",
        "ZoneConcordia_2",
        "ZoneConstruction",
        "ZoneFactory",
        "ZoneHotel_1",
        "ZoneHotel_2",
        "ZoneSW00",
        "ZoneSW01",
        "ZoneStilo",
        "ZoneSnipeBuilding",
        "ZoneSnipeCinema",
        "ZoneSnipeSW01",
        "ZoneSnipeStilo"
    ];
    databaseTables;
    botConfig;
    pmcConfig;
    locationConfig;
    locations;
    generalLocationInfo = {};
    constructor(logger, hashUtil, randomUtil, databaseServer, configServer) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.databaseServer = databaseServer;
        this.configServer = configServer;
    }
    generateWaves() {
        this.deleteAllCustomWaves();
        this.replacePmcBossWaves();
        this.replaceScavWaves();
        this.logger.info("[Unda] Bot waves generated");
    }
    disableAllConversionToPmc() {
        for (const botType of Object.keys(this.pmcConfig.convertIntoPmcChance)) {
            this.pmcConfig.convertIntoPmcChance[botType] = { min: 0, max: 0 };
        }
        if (config.debug) {
            this.logger.info(`[Unda] pmcConfig.convertIntoPmcChance: ${JSON.stringify(this.pmcConfig.convertIntoPmcChance)}`);
        }
    }
    deleteAllCustomWaves() {
        for (const locationName of Object.keys(this.locations)) {
            if (this.locationsToIgnore.includes(locationName)) {
                continue;
            }
            this.locationConfig.customWaves.boss[locationName] = [];
            this.locationConfig.customWaves.normal[locationName] = [];
        }
        if (config.debug) {
            this.logger.info(`[Unda] locationConfig.customWaves.boss: ${JSON.stringify(this.locationConfig.customWaves.boss)}`);
        }
    }
    fillInitialData() {
        this.databaseTables = this.databaseServer.getTables();
        this.botConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        this.pmcConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        this.locationConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        this.locations = this.databaseTables.locations;
        this.disableAllConversionToPmc();
        for (const [locationName, locationObj] of Object.entries(this.locations)) {
            if (this.locationsToIgnore.includes(locationName)) {
                continue;
            }
            const locationData = locationObj;
            if (locationName === "tarkovstreets") {
                this.makeAllZonesOpenForStreets(locationData);
            }
            const marksmanZones = (locationName === "tarkovstreets") ?
                this.getLocationMarksmanZonesNew(locationData.base) :
                this.getLocationMarksmanZones(locationData.base);
            const zones = (locationName === "tarkovstreets") ?
                this.getLocationZonesNew(locationData.base) :
                this.getLocationZones(locationName, locationData.base);
            const minPlayers = this.getLocationMinPlayers(locationData.base);
            const maxPlayers = ((locationName === "tarkovstreets") && (config.streetsQuietRaids)) ? minPlayers :
                this.getLocationMaxPlayers(locationData.base);
            const maxMarksmans = this.getLocationMaxMarksmans(locationName, marksmanZones.length);
            const maxBots = this.getLocationMaxBots(locationName, locationData.base);
            const maxScavs = maxBots - maxMarksmans;
            this.generalLocationInfo[locationName] = {
                marksmanZones,
                zones,
                maxBots,
                minPlayers,
                maxPlayers,
                maxMarksmans,
                maxScavs,
            };
        }
        if (config.debug) {
            this.logger.info(`[Unda] generalLocationInfo: ${JSON.stringify(this.generalLocationInfo)}`);
        }
        if (config.streetsQuietRaids) {
            this.setMaxBotPerZoneForStreets();
        }
    }
    getLocationMinPlayers(locationBase) {
        return locationBase.MinPlayers;
    }
    getLocationMaxPlayers(locationBase) {
        return locationBase.MaxPlayers;
    }
    getLocationMaxBots(locationName, locationBase) {
        const botMax = locationBase.BotMax;
        if (botMax <= 0) {
            return this.botConfig.maxBotCap[locationName];
        }
        else {
            return botMax;
        }
    }
    getLocationMaxMarksmans(locationName, marksmanLocationsAmount) {
        if (locationName === "shoreline") {
            return marksmanLocationsAmount * 2;
        }
        else {
            return marksmanLocationsAmount;
        }
    }
    getLocationMarksmanZones(locationBase) {
        return this.getBotTypeZones("marksman", locationBase);
    }
    getLocationZones(locationName, locationBase) {
        if (locationName === "laboratory") {
            return [
                ...new Set(locationBase.BossLocationSpawn.map((bz) => {
                    if (bz.BossZone.trim().length == 0) {
                        return "BotZone";
                    }
                    else {
                        return bz.BossZone;
                    }
                })),
            ];
        }
        return this.getBotTypeZones("assault", locationBase);
    }
    getBotTypeZones(type, locationBase) {
        const zones = [
            ...new Set(locationBase.waves
                .filter((wave) => {
                return wave.WildSpawnType === type;
            })
                .map((wave) => {
                if (wave.SpawnPoints.trim().length == 0) {
                    return "BotZone";
                }
                else {
                    return wave.SpawnPoints;
                }
            })),
        ];
        if (type !== "marksman" && zones.length <= 1) {
            const randomZonesAmount = this.randomUtil.getInt(6, 10);
            for (let i = 0; i <= randomZonesAmount; i++) {
                zones.push("BotZone");
            }
        }
        return zones;
    }
    getLocationMarksmanZonesNew(base) {
        return base.OpenZones.split(",").filter((zone) => zone.includes("Snipe"));
    }
    getLocationZonesNew(base) {
        return base.OpenZones.split(",").filter((zone) => !zone.includes("Snipe"));
    }
    replaceScavWaves() {
        for (const [locationName, locationObj] of Object.entries(this.locations)) {
            if (this.locationsToIgnore.includes(locationName)) {
                continue;
            }
            if (locationName === "laboratory") {
                continue;
            }
            const location = locationObj;
            if (location.base) {
                const locationBase = location.base;
                const marksmanZones = this.generalLocationInfo[locationName].marksmanZones;
                const assaultZones = [
                    ...this.generalLocationInfo[locationName].zones,
                ];
                this.cleanWaves(locationBase);
                let maxMarksmanGroupSize = 1;
                if (locationName === "shoreline") {
                    maxMarksmanGroupSize = 2;
                }
                const currentWaveNumber = this.generateMarksmanWaves(locationBase, marksmanZones, maxMarksmanGroupSize);
                const maxAssaultScavAmount = this.generalLocationInfo[locationName].maxScavs;
                if (maxAssaultScavAmount <= 0) {
                    this.logger.error(`[Unda] ${locationName}.BotMax: ${maxAssaultScavAmount}`);
                }
                const maxScavGroupSize = ((locationName === "tarkovstreets") && (config.streetsQuietRaids)) ? 3 :
                    config.maxScavGroupSize;
                this.generateAssaultWaves(locationBase, assaultZones, locationBase.EscapeTimeLimit, maxAssaultScavAmount, maxScavGroupSize, currentWaveNumber);
                if (config.debug) {
                    this.logger.info(`[Unda] ${locationName}.waves: ${JSON.stringify(locationBase.waves)}`);
                }
            }
        }
    }
    cleanWaves(locationBase) {
        locationBase.waves = [];
    }
    generateMarksmanWaves(locationBase, zones, maxGroupSize) {
        let num = 0;
        const minGroupSize = maxGroupSize > 1 ? 1 : 0;
        zones.forEach((zone) => {
            locationBase.waves.push(this.generateWave(ILocationBase_1.WildSpawnType.MARKSMAN, zone, "hard", num++, minGroupSize, maxGroupSize, 60, 90));
        });
        return num;
    }
    generateAssaultWaves(locationBase, zones, escapeTimeLimit, maxAssaultScavAmount, maxScavGroupSize, currentWaveNumber) {
        const groups = this.splitMaxAmountIntoGroups(maxAssaultScavAmount, maxScavGroupSize);
        const groupsByZones = this.separateGroupsByZones(zones, groups);
        if (config.debug) {
            this.logger.info(`[Unda] '${locationBase.Name}' scav groups ${JSON.stringify(groupsByZones)}`);
        }
        const firstWaveTimeMin = 60;
        const lastWaveTimeMin = Math.ceil((escapeTimeLimit * 60) / 2);
        const middleWaveTimeMin = Math.ceil(lastWaveTimeMin / 2);
        this.createAssaultWaves(groupsByZones, locationBase, "normal", firstWaveTimeMin, currentWaveNumber);
        this.createAssaultWaves(groupsByZones, locationBase, "normal", middleWaveTimeMin, currentWaveNumber);
        this.createAssaultWaves(groupsByZones, locationBase, "hard", lastWaveTimeMin, currentWaveNumber);
    }
    createAssaultWaves(groupsByZones, locationBase, difficulty, timeMin, currentWaveNumber) {
        const timeMax = timeMin + 120;
        for (const zoneByBroup of groupsByZones) {
            const wave = this.generateWave(ILocationBase_1.WildSpawnType.ASSAULT, zoneByBroup.zoneName, difficulty, currentWaveNumber++, 0, zoneByBroup.groupSize, timeMin, timeMax);
            locationBase.waves.push(wave);
        }
    }
    generateWave(botType, zoneName, difficulty, number, slotsMin, slotsMax, timeMin, timeMax) {
        const spawnPoint = zoneName.trim().length == 0 ? "BotZone" : zoneName;
        return {
            BotPreset: difficulty,
            BotSide: "Savage",
            SpawnPoints: spawnPoint,
            WildSpawnType: botType,
            isPlayers: false,
            number: number,
            slots_min: slotsMin,
            slots_max: slotsMax,
            time_min: timeMin,
            time_max: timeMax,
        };
    }
    replacePmcBossWaves() {
        for (const locationName of Object.keys(this.locations)) {
            if (this.locationsToIgnore.includes(locationName)) {
                continue;
            }
            const minPlayers = this.generalLocationInfo[locationName].minPlayers;
            const maxPlayers = this.generalLocationInfo[locationName].maxPlayers;
            const maxPmcAmount = this.randomUtil.getInt(minPlayers, maxPlayers) - 1;
            if (maxPmcAmount <= 0) {
                this.logger.error(`[Unda] ${locationName}.maxPlayers: ${maxPmcAmount}`);
            }
            const groups = this.splitMaxAmountIntoGroups(maxPmcAmount, config.maxPmcGroupSize);
            const zones = [...this.generalLocationInfo[locationName].zones];
            const groupsByZones = this.separateGroupsByZones(zones, groups);
            if (config.debug) {
                this.logger.info(`[Unda] '${locationName}' PMC groups ${JSON.stringify(groupsByZones)}`);
            }
            for (const groupByZone of groupsByZones) {
                this.locationConfig.customWaves.boss[locationName].push(this.generatePmcAsBoss(groupByZone.groupSize, config.pmcBotDifficulty, groupByZone.zoneName));
            }
            if (config.debug) {
                this.logger.info(`[Unda] locationConfig.customWaves.boss[${locationName}]: ${JSON.stringify(this.locationConfig.customWaves.boss[locationName])}`);
            }
        }
    }
    separateGroupsByZones(zones, groups) {
        const shuffledZones = this.shuffleZonesArray(zones);
        const groupsPool = [...groups];
        const result = [];
        for (const zoneName of shuffledZones) {
            const groupSize = groupsPool.pop();
            if (groupSize === undefined) {
                break;
            }
            result.push({
                zoneName: zoneName,
                groupSize: groupSize,
            });
        }
        return result;
    }
    generatePmcAsBoss(groupSize, difficulty, zone) {
        const supports = [];
        let escortAmount = "0";
        const type = this.randomUtil.getBool() ? "pmcBEAR" : "pmcUSEC";
        if (groupSize > 1) {
            escortAmount = `${groupSize - 1}`;
            supports.push({
                BossEscortType: type,
                BossEscortDifficult: [difficulty],
                BossEscortAmount: escortAmount,
            });
        }
        return {
            BossChance: 100,
            BossDifficult: difficulty,
            BossEscortAmount: escortAmount,
            BossEscortDifficult: difficulty,
            BossEscortType: type,
            BossName: type,
            BossPlayer: true,
            BossZone: zone,
            RandomTimeSpawn: false,
            Time: -1,
            TriggerId: "",
            TriggerName: "",
            ForceSpawn: true,
            IgnoreMaxBots: true,
            Supports: supports,
            sptId: this.hashUtil.generate(),
            spawnMode: ["regular", "pve"]
        };
    }
    splitMaxAmountIntoGroups(maxAmount, maxGroupSize) {
        const result = [];
        let remainingAmount = maxAmount;
        do {
            const generatedGroupSize = this.randomUtil.getInt(1, maxGroupSize);
            if (generatedGroupSize > remainingAmount) {
                result.push(remainingAmount);
                remainingAmount = 0;
            }
            else {
                result.push(generatedGroupSize);
                remainingAmount -= generatedGroupSize;
            }
        } while (remainingAmount > 0);
        return result;
    }
    shuffleZonesArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    setMaxBotPerZoneForStreets() {
        const locationData = this.locations["tarkovstreets"];
        locationData.base.MaxBotPerZone = 3;
    }
    makeAllZonesOpenForStreets(locationData) {
        locationData.base.OpenZones = this.streetsAllZones.join(",");
    }
};
exports.WavesGenerator = WavesGenerator;
exports.WavesGenerator = WavesGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(4, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _d : Object, typeof (_e = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _e : Object])
], WavesGenerator);
//# sourceMappingURL=WavesGenerator.js.map