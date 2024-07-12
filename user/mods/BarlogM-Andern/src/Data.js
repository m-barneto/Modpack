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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const models_1 = require("./models");
const fs = __importStar(require("fs"));
const json5_1 = __importDefault(require("C:/snapshot/project/node_modules/json5"));
const config = __importStar(require("../config/config.json"));
let Data = class Data {
    logger;
    hashUtil;
    randomUtil;
    databaseServer;
    modPath;
    presets = config.presets;
    data = {};
    armorPlatesData;
    constructor(logger, hashUtil, randomUtil, databaseServer, modPath) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.databaseServer = databaseServer;
        this.modPath = modPath;
        this.load();
    }
    getRandomAmmoByCaliber(presetName, botLevel, caliber) {
        const tier = this.tierByLevel(presetName, botLevel);
        const ammo = this.data[presetName].ammo[tier][caliber];
        if (ammo === undefined) {
            this.logger.error(`[Andern] no ammo record for tier '${tier}' with caliber '${caliber}'`);
            return undefined;
        }
        if (ammo.length == 1) {
            return ammo[0];
        }
        else {
            const keys = Object.keys(ammo);
            const randomKey = this.randomUtil.getArrayValue(keys);
            return ammo[randomKey];
        }
    }
    getRandomWeapon(presetName, botLevel) {
        const tier = this.tierByLevel(presetName, botLevel);
        const presets = this.data[presetName].weapon[tier];
        const keys = Object.keys(presets);
        const randomKey = this.randomUtil.getArrayValue(keys);
        const preset = presets[randomKey];
        if (config.debug) {
            this.logger.info(`[Andern] for bot level ${botLevel} selected tier '${tier}' weapon '${preset.Name}'`);
        }
        return JSON.parse(JSON.stringify(preset.Items));
    }
    getGear(presetName, level) {
        const tier = this.tierByLevel(presetName, level);
        return this.data[presetName].gear[tier];
    }
    getAlternativeModule(presetName, botLevel, moduleTpl) {
        const tier = this.tierByLevel(presetName, botLevel);
        const alternativesData = this.data[presetName].modules[tier];
        if (!alternativesData) {
            return moduleTpl;
        }
        if (moduleTpl in alternativesData) {
            const alternatives = alternativesData[moduleTpl];
            if (this.randomUtil.getBool()) {
                const keys = Object.keys(alternatives);
                const randomKey = this.randomUtil.getArrayValue(keys);
                return alternatives[randomKey];
            }
        }
        return moduleTpl;
    }
    getConfig(presetName, level) {
        const tier = this.tierByLevel(presetName, level);
        return this.data[presetName].config[tier];
    }
    getPresetsDir() {
        return `${this.modPath}presets`;
    }
    load() {
        for (const [presetName, presetWeight] of this.readAllPresetsList()) {
            const presetData = this.loadData(presetName);
            this.data[presetName] = presetData;
            this.logger.info(`[Andern] Loaded preset '${presetName}'`);
        }
    }
    readAllPresetsList() {
        return Object.entries(this.presets).filter(([name, weight]) => {
            return weight > 0;
        });
    }
    loadData(presetName) {
        const presetDir = `${this.getPresetsDir()}/${presetName}`;
        const presetData = {
            config: {},
            gear: {},
            weapon: {},
            ammo: {},
            modules: {}
        };
        try {
            const files = fs.readdirSync(presetDir, { withFileTypes: true });
            files.forEach((dir) => {
                if (dir.isDirectory()) {
                    const tierDirName = `${presetDir}/${dir.name}`;
                    const tierName = dir.name;
                    presetData.config[tierName] = this.loadTierConfig(tierDirName);
                    presetData.gear[tierName] = this.loadTierGear(tierDirName);
                    presetData.ammo[tierName] = this.loadTierAmmo(tierDirName);
                    presetData.modules[tierName] =
                        this.loadTierModules(tierDirName);
                    presetData.weapon[tierName] =
                        this.loadTierWeapon(tierDirName);
                }
            });
        }
        catch (err) {
            this.logger.error(`[Andern] Error reading directory: ${err.message}`);
        }
        return presetData;
    }
    loadTierGear(tierDir) {
        const gearFileName = `${tierDir}/gear.json5`;
        const gear = new models_1.Gear();
        try {
            const jsonData = fs.readFileSync(gearFileName, "utf-8");
            Object.assign(gear, json5_1.default.parse(jsonData));
        }
        catch (err) {
            this.logger.error(`[Andern] error read file '${gearFileName}'`);
            this.logger.error(err.message);
        }
        return gear;
    }
    loadTierAmmo(tierDir) {
        const ammoFileName = `${tierDir}/ammo.json5`;
        const ammo = {};
        try {
            const jsonData = fs.readFileSync(ammoFileName, "utf-8");
            Object.assign(ammo, json5_1.default.parse(jsonData));
        }
        catch (err) {
            this.logger.error(`[Andern] error read file '${ammoFileName}'`);
            this.logger.error(err.message);
        }
        return ammo;
    }
    loadTierModules(tierDir) {
        const modulesFileName = `${tierDir}/modules.json5`;
        const modules = {};
        if (fs.existsSync(modulesFileName)) {
            try {
                const jsonData = fs.readFileSync(modulesFileName, "utf-8");
                Object.assign(modules, json5_1.default.parse(jsonData));
            }
            catch (err) {
                this.logger.error(`[Andern] error read file '${modulesFileName}'`);
                this.logger.error(err.message);
            }
        }
        return modules;
    }
    loadTierWeapon(tierDir) {
        const weapon = [];
        try {
            const files = fs.readdirSync(tierDir);
            files
                .filter((f) => f.endsWith(".json"))
                .forEach((f) => {
                const fullWeaponPresetName = `${tierDir}/${f}`;
                try {
                    const jsonData = fs.readFileSync(fullWeaponPresetName, "utf-8");
                    const preset = new models_1.WeaponPreset();
                    Object.assign(preset, JSON.parse(jsonData));
                    if (this.isPresetValid(preset, fullWeaponPresetName)) {
                        weapon.push(preset);
                    }
                }
                catch (err) {
                    this.logger.error(`[Andern] error read file '${fullWeaponPresetName}'`);
                    this.logger.error(err.message);
                }
            });
        }
        catch (err) {
            this.logger.error(`[Andern] Error reading directory: ${err.message}`);
        }
        return weapon;
    }
    loadTierConfig(tierDir) {
        const configFileName = `${tierDir}/config.json5`;
        const config = new models_1.Config();
        try {
            const jsonData = fs.readFileSync(configFileName, "utf-8");
            Object.assign(config, json5_1.default.parse(jsonData));
        }
        catch (err) {
            this.logger.error(`[Andern] error read file '${configFileName}'`);
            this.logger.error(err.message);
        }
        return config;
    }
    isPresetValid(weaponPreset, fileName) {
        let hasMagazine = false;
        let hasTacticalDevice = false;
        for (const i of weaponPreset.Items) {
            if (!i.slotId) {
                continue;
            }
            if (i.slotId === "cartridges") {
                this.logger.error(`[Andern] preset's magazine is not empty '${fileName}'`);
                return false;
            }
            if (i.slotId === "mod_magazine") {
                hasMagazine = true;
            }
            if (i.slotId.startsWith("mod_tactical")) {
                hasTacticalDevice = true;
            }
        }
        if (!hasMagazine) {
            this.logger.warning(`[Andern] preset doesn't have magazine '${fileName}'`);
            return true;
        }
        if (!hasTacticalDevice) {
            this.logger.warning(`[Andern] preset doesn't have tactical device '${fileName}'`);
            return true;
        }
        return true;
    }
    tierByLevel(presetName, level) {
        const presetConfig = this.data[presetName].config;
        let result = Object.keys(presetConfig)[0];
        for (const tier in presetConfig) {
            if (level >= presetConfig[tier].minLevel &&
                level <= presetConfig[tier].maxLevel) {
                result = tier;
                break;
            }
        }
        return result;
    }
    getPresetName() {
        const totalWeight = Object.values(this.presets).reduce((sum, item) => sum + item);
        let random = Math.random() * totalWeight;
        for (const [name, weight] of Object.entries(this.presets)) {
            random -= weight;
            if (random <= 0) {
                return name;
            }
        }
        return Object.keys(this.presets)[0];
    }
    fillArmorPlatesData() {
        this.armorPlatesData = Object.entries(this.databaseServer.getTables().templates.items)
            .filter(([tpl, item]) => item._parent === BaseClasses_1.BaseClasses.ARMOR_PLATE && item._id !== BaseClasses_1.BaseClasses.BUILT_IN_INSERTS)
            .map(([tpl, item]) => [tpl, item._props.armorClass])
            .reduce((acc, [tpl, value]) => {
            acc[tpl] = value;
            return acc;
        }, {});
    }
    getPlateArmorClassByPlateTpl(tpl) {
        return this.armorPlatesData[tpl];
    }
};
exports.Data = Data;
exports.Data = Data = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(4, (0, tsyringe_1.inject)("AndernModPath")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _d : Object, String])
], Data);
//# sourceMappingURL=Data.js.map