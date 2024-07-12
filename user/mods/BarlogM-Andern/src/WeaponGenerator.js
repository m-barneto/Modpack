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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaponGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const RepairService_1 = require("C:/snapshot/project/obj/services/RepairService");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const Data_1 = require("./Data");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
// eslint-disable-next-line @typescript-eslint/naming-convention
const MUZZLE_PAIRS = {
    //7.62x51 Tier 4
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "6130c43c67085e45ef1405a1": "5dfa3d2b0dee1b22f862eade",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "618178aa1cb55961fa0fdc80": "5a34fe59c4a282000b1521a2",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5a34fd2bc4a282329a73b4c5": "5a34fe59c4a282000b1521a2",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5cf78496d7f00c065703d6ca": "5cf78720d7f00c06595bc93e",
    //7.62x51 Tier 3
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5fbc22ccf24b94483f726483": "5fbe760793164a5b6278efc8",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "612e0d3767085e45ef14057f": "63877c99e785640d436458ea",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5d1f819086f7744b355c219b": "5cff9e84d7ad1a049e54ed55",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5dfa3cd1b33c0951220c079b": "5dfa3d2b0dee1b22f862eade",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5d443f8fa4b93678dd4a01aa": "5d44064fa4b9361e4f6eb8b5",
    //5.56x45 Tier 4
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "609269c3b0e443224b421cc1": "60926df0132d4d12c81fd9df",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "6386120cd6baa055ad1e201c": "638612b607dfed1ccb7206ba",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "626667e87379c44d557b7550": "626673016f1edc06f30cf6d5",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5f6372e2865db925d54f3869": "5f6339d53ada5942720e2dc3",
    //5.56x45 Tier 3
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "612e0cfc8004cc50514c2d9e": "63877c99e785640d436458ea",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5c7fb51d2e2216001219ce11": "5ea17bbc09aa976f2e7a51cd",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "5d440625a4b9361eec4ae6c5": "5d44064fa4b9361e4f6eb8b5",
    //Tier 2 SilencerCo Hybrid 46
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "59bffc1f86f77435b128b872": "59bffbb386f77435b379b9c2",
    //AK Hexagon Reactor 5.45x39 muzzle brake
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "615d8f5dd92c473c770212ef": "615d8f8567085e45ef1409ca"
};
let WeaponGenerator = class WeaponGenerator {
    logger;
    hashUtil;
    randomUtil;
    databaseServer;
    configServer;
    itemHelper;
    botWeaponGeneratorHelper;
    repairService;
    botGeneratorHelper;
    inventoryMagGenComponents;
    data;
    magazineSlotId = "mod_magazine";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MK47 = "606587252535c57a13424cfd";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    X_47_DRUM = "5cfe8010d7ad1a59283b14c6";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MAGPUL_MOE_CARBINE_RUBBER_BUTTPAD = "58d2912286f7744e27117493";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SIG_SAUER_TAPER_LOK_762X51_300_BLK_MUZZLE_ADAPTER = "5fbc22ccf24b94483f726483";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SIG_SAUER_TWO_PORT_BRAKE_762X51_MUZZLE_BRAKE = "5fbcbd10ab884124df0cd563";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SIG_SAUER_SRD762_QD_762X51_SOUND_SUPPRESSOR = "5fbe760793164a5b6278efc8";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LANTAC_BMD_BLAST_MITIGATION_DEVICE_A3_DIRECT_THREAD_ADAPTER = "5cf78496d7f00c065703d6ca";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AR_10_LANTAC_DRAGON_762X51_MUZZLE_BRAKE_COMPENSATOR = "5c878e9d2e2216000f201903";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LANTAC_BMD_762X51_BLAST_MITIGATION_DEVICE = "5cf78720d7f00c06595bc93e";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ZENIT_KLESCH_2IKS = "5a5f1ce64f39f90b401987bc";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TACTICAL_DEVICE_LIGHT_AND_LASER_MODE = 1;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TACTICAL_DEVICE_LASER_ONLY_MODE = 2;
    pmcConfig;
    repairConfig;
    constructor(logger, hashUtil, randomUtil, databaseServer, configServer, itemHelper, botWeaponGeneratorHelper, repairService, botGeneratorHelper, inventoryMagGenComponents, data) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.databaseServer = databaseServer;
        this.configServer = configServer;
        this.itemHelper = itemHelper;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.repairService = repairService;
        this.botGeneratorHelper = botGeneratorHelper;
        this.inventoryMagGenComponents = inventoryMagGenComponents;
        this.data = data;
        this.pmcConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        this.repairConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.REPAIR);
    }
    templatesTable() {
        return this.databaseServer.getTables().templates.items;
    }
    getTemplateIdFromWeaponItems(weaponWithMods) {
        return weaponWithMods[0]._tpl;
    }
    getCaliberByTemplateId(tpl) {
        return this.getTemplateById(tpl)._props.ammoCaliber;
    }
    getWeaponClassByTemplateId(tpl) {
        return this.getTemplateById(tpl)._props.weapClass;
    }
    getWeaponSlotByWeaponClass(weaponClass) {
        switch (weaponClass) {
            case "pistol":
                return EquipmentSlots_1.EquipmentSlots.HOLSTER;
            default:
                return EquipmentSlots_1.EquipmentSlots.FIRST_PRIMARY_WEAPON;
        }
    }
    getWeaponMagazine(weaponWithMods) {
        return weaponWithMods.find((item) => item.slotId === "mod_magazine");
    }
    addCartridgeToChamber(weaponWithMods, ammoTpl, weaponTemplate) {
        const chambersAmount = this.getChambersAmountFromWeaponTemplate(weaponTemplate);
        const chamberName = this.getChamberNameFromWeaponTemplate(weaponTemplate);
        const existingItemWithSlot = weaponWithMods.filter((item) => item.slotId.startsWith(chamberName));
        if (existingItemWithSlot.length > 0) {
            existingItemWithSlot.forEach((chamber) => {
                chamber.upd = {
                    StackObjectsCount: 1,
                };
                chamber._tpl = ammoTpl;
            });
        }
        else {
            if (chambersAmount === 1) {
                weaponWithMods.push({
                    _id: this.hashUtil.generate(),
                    _tpl: ammoTpl,
                    parentId: weaponWithMods[0]._id,
                    slotId: chamberName,
                    upd: { StackObjectsCount: 1 },
                });
            }
            else {
                for (let chamberNum = 0; chamberNum < chambersAmount; chamberNum++) {
                    const slotIdName = `${chamberName}_00${chamberNum}`;
                    weaponWithMods.push({
                        _id: this.hashUtil.generate(),
                        _tpl: ammoTpl,
                        parentId: weaponWithMods[0]._id,
                        slotId: slotIdName,
                        upd: { StackObjectsCount: 1 },
                    });
                }
            }
        }
    }
    getChamberNameFromWeaponTemplate(weaponTemplate) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const WEAPON_CHIAPPA_RHINO_50DS_9X33R = "61a4c8884f95bc3b2c5dc96f";
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const WEAPON_CHIAPPA_RHINO_200DS_9X19 = "624c2e8614da335f1e034d8c";
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const WEAPON_KBP_RSH_12_127X55 = "633ec7c2a6918cb895019c6c";
        let chamberName = "patron_in_weapon";
        if (weaponTemplate._id === WEAPON_CHIAPPA_RHINO_50DS_9X33R ||
            weaponTemplate._id === WEAPON_CHIAPPA_RHINO_200DS_9X19 ||
            weaponTemplate._id === WEAPON_KBP_RSH_12_127X55) {
            chamberName = "camora";
        }
        return chamberName;
    }
    fillMagazine(weaponWithMods, ammoTpl) {
        weaponWithMods.filter((x) => x.slotId === this.magazineSlotId).map((magazine) => {
            const magazineTemplate = this.getTemplateById(magazine._tpl);
            const magazineWithCartridges = [magazine];
            this.itemHelper.fillMagazineWithCartridge(magazineWithCartridges, magazineTemplate, ammoTpl, 1);
            weaponWithMods.splice(weaponWithMods.indexOf(magazine), 1, ...magazineWithCartridges);
            return magazine._tpl;
        });
        return undefined;
    }
    getTemplateById(tpl) {
        return this.templatesTable()[tpl];
    }
    updateWeaponInfo(weaponWithMods, weaponParentId, weaponTpl, isNight) {
        weaponWithMods[0].slotId = this.getWeaponSlotByWeaponClass(this.getWeaponClassByTemplateId(weaponTpl));
        weaponWithMods[0].parentId = weaponParentId;
        weaponWithMods[0] = {
            ...weaponWithMods[0],
            ...this.botGeneratorHelper.generateExtraPropertiesForItem(this.getTemplateById(weaponTpl), "pmc"),
        };
        this.replaceId(weaponWithMods, 0);
        if (isNight) {
            this.replaceTacticalDevice(weaponWithMods);
        }
        this.setTacticalDeviceMode(weaponWithMods);
    }
    replaceId(weaponWithMods, i) {
        const oldId = weaponWithMods[i]._id;
        const newId = this.hashUtil.generate();
        weaponWithMods[i]._id = newId;
        for (const item of weaponWithMods) {
            if (item.parentId && item.parentId === oldId) {
                item.parentId = newId;
            }
        }
        i++;
        if (i < weaponWithMods.length) {
            this.replaceId(weaponWithMods, i);
        }
    }
    replaceTacticalDevice(weaponWithMods) {
        for (const item of weaponWithMods) {
            if (item.slotId.startsWith("mod_tactical") &&
                this.itemHelper.isOfBaseclass(item._tpl, BaseClasses_1.BaseClasses.TACTICAL_COMBO)) {
                item._tpl = this.ZENIT_KLESCH_2IKS;
            }
        }
    }
    setTacticalDeviceMode(weaponWithMods) {
        for (const item of weaponWithMods) {
            if (item.slotId.startsWith("mod_tactical")) {
                if (item.upd?.Light) {
                    item.upd.Light.IsActive = false;
                    item.upd.Light.SelectedMode = this.TACTICAL_DEVICE_LASER_ONLY_MODE;
                }
            }
        }
    }
    alternateModules(presetName, botLevel, weapon, weaponTpl) {
        let deleteMagpulRubberButtpad = false;
        let deleteSigSauerMuzzleParts = false;
        let deleteLantacBmdPart = false;
        weapon.forEach((item) => {
            const alternativeTpl = this.data.getAlternativeModule(presetName, botLevel, item._tpl);
            if (alternativeTpl != item._tpl) {
                if (weaponTpl !== this.MK47 &&
                    alternativeTpl !== this.X_47_DRUM) {
                    if ((item.slotId === "mod_muzzle") &&
                        (item._tpl === this.SIG_SAUER_TAPER_LOK_762X51_300_BLK_MUZZLE_ADAPTER)) {
                        deleteSigSauerMuzzleParts = true;
                    }
                    if ((item.slotId === "mod_muzzle") &&
                        (item._tpl === this.LANTAC_BMD_BLAST_MITIGATION_DEVICE_A3_DIRECT_THREAD_ADAPTER)) {
                        deleteLantacBmdPart = true;
                    }
                    if (item._tpl === this.MAGPUL_MOE_CARBINE_RUBBER_BUTTPAD) {
                        deleteMagpulRubberButtpad = true;
                    }
                    item._tpl = alternativeTpl;
                    if (item.slotId === "mod_muzzle") {
                        this.alternateOrAddSuppressor(weapon, item);
                    }
                }
            }
        });
        if (deleteMagpulRubberButtpad) {
            this.deleteModule(weapon, this.MAGPUL_MOE_CARBINE_RUBBER_BUTTPAD);
        }
        if (deleteSigSauerMuzzleParts) {
            this.deleteModule(weapon, this.SIG_SAUER_TWO_PORT_BRAKE_762X51_MUZZLE_BRAKE);
            this.deleteModule(weapon, this.SIG_SAUER_SRD762_QD_762X51_SOUND_SUPPRESSOR);
        }
        if (deleteLantacBmdPart) {
            this.deleteModule(weapon, this.AR_10_LANTAC_DRAGON_762X51_MUZZLE_BRAKE_COMPENSATOR);
            this.deleteModule(weapon, this.LANTAC_BMD_762X51_BLAST_MITIGATION_DEVICE);
        }
    }
    alternateOrAddSuppressor(weapon, muzzleItem) {
        const suppressor = weapon.find((i) => (i.parentId === muzzleItem._id) && (i.slotId === "mod_muzzle"));
        if (suppressor !== undefined) {
            const alternativeSuppressorTpl = MUZZLE_PAIRS[muzzleItem._tpl];
            if (alternativeSuppressorTpl !== undefined) {
                if (alternativeSuppressorTpl === this.SIG_SAUER_SRD762_QD_762X51_SOUND_SUPPRESSOR) {
                    suppressor.slotId = "mod_muzzle_001";
                    weapon.push({
                        _id: this.hashUtil.generate(),
                        _tpl: this.SIG_SAUER_TWO_PORT_BRAKE_762X51_MUZZLE_BRAKE,
                        parentId: muzzleItem._id,
                        slotId: "mod_muzzle_000"
                    });
                }
                else if (alternativeSuppressorTpl === this.LANTAC_BMD_762X51_BLAST_MITIGATION_DEVICE) {
                    suppressor.slotId = "mod_muzzle_001";
                    weapon.push({
                        _id: this.hashUtil.generate(),
                        _tpl: this.AR_10_LANTAC_DRAGON_762X51_MUZZLE_BRAKE_COMPENSATOR,
                        parentId: muzzleItem._id,
                        slotId: "mod_muzzle_000"
                    });
                }
                suppressor._tpl = MUZZLE_PAIRS[muzzleItem._tpl];
            }
        }
        else {
            const alternativeSuppressorTpl = MUZZLE_PAIRS[muzzleItem._tpl];
            if (alternativeSuppressorTpl !== undefined) {
                if (alternativeSuppressorTpl === this.SIG_SAUER_SRD762_QD_762X51_SOUND_SUPPRESSOR) {
                    this.constructSigSauerSuppressor(weapon, muzzleItem);
                }
                else if (alternativeSuppressorTpl === this.LANTAC_BMD_762X51_BLAST_MITIGATION_DEVICE) {
                    this.constructLantacBmd(weapon, muzzleItem);
                }
                else {
                    const suppressorItem = {
                        _id: this.hashUtil.generate(),
                        _tpl: alternativeSuppressorTpl,
                        parentId: muzzleItem._id,
                        slotId: "mod_muzzle"
                    };
                    weapon.push(suppressorItem);
                }
            }
        }
    }
    deleteModule(weapon, tpl) {
        const i = weapon.findIndex((item) => item._tpl === tpl);
        if (i > -1) {
            weapon.splice(i, 1);
        }
    }
    constructSigSauerSuppressor(weapon, muzzleItem) {
        const muzzleBrakeItem = {
            _id: this.hashUtil.generate(),
            _tpl: this.SIG_SAUER_TWO_PORT_BRAKE_762X51_MUZZLE_BRAKE,
            parentId: muzzleItem._id,
            slotId: "mod_muzzle_000"
        };
        weapon.push(muzzleBrakeItem);
        const suppressorItem = {
            _id: this.hashUtil.generate(),
            _tpl: this.SIG_SAUER_SRD762_QD_762X51_SOUND_SUPPRESSOR,
            parentId: muzzleItem._id,
            slotId: "mod_muzzle_001"
        };
        weapon.push(suppressorItem);
    }
    constructLantacBmd(weapon, muzzleItem) {
        const muzzleBrakeItem = {
            _id: this.hashUtil.generate(),
            _tpl: this.AR_10_LANTAC_DRAGON_762X51_MUZZLE_BRAKE_COMPENSATOR,
            parentId: muzzleItem._id,
            slotId: "mod_muzzle_000"
        };
        weapon.push(muzzleBrakeItem);
        const suppressorItem = {
            _id: this.hashUtil.generate(),
            _tpl: this.LANTAC_BMD_762X51_BLAST_MITIGATION_DEVICE,
            parentId: muzzleItem._id,
            slotId: "mod_muzzle_001"
        };
        weapon.push(suppressorItem);
    }
    addRandomEnhancement(weapon) {
        if (this.randomUtil.getChance100(this.pmcConfig.weaponHasEnhancementChancePercent)) {
            const weaponConfig = this.repairConfig.repairKit.weapon;
            this.repairService.addBuff(weaponConfig, weapon[0]);
        }
    }
    getChambersAmountFromWeaponTemplate(weaponTemplate) {
        return weaponTemplate._props.Chambers.length;
    }
    generateWeapon(presetName = "", botLevel, weaponParentId, isNightVision) {
        if (presetName.length == 0) {
            presetName = this.data.getPresetName();
        }
        const weaponWithMods = this.data.getRandomWeapon(presetName, botLevel);
        const weaponTpl = this.getTemplateIdFromWeaponItems(weaponWithMods);
        this.updateWeaponInfo(weaponWithMods, weaponParentId, weaponTpl, isNightVision);
        this.alternateModules(presetName, botLevel, weaponWithMods, weaponTpl);
        this.addRandomEnhancement(weaponWithMods);
        const weaponTemplate = this.getTemplateById(weaponTpl);
        const caliber = this.getCaliberByTemplateId(weaponTpl);
        const ammoTpl = this.data.getRandomAmmoByCaliber(presetName, botLevel, caliber);
        this.addCartridgeToChamber(weaponWithMods, ammoTpl, weaponTemplate);
        const magazineTpl = this.fillMagazine(weaponWithMods, ammoTpl);
        return {
            weaponWithMods: weaponWithMods,
            weaponTemplate: weaponTemplate,
            ammoTpl: ammoTpl,
            magazineTpl: magazineTpl,
        };
    }
};
exports.WeaponGenerator = WeaponGenerator;
exports.WeaponGenerator = WeaponGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(4, (0, tsyringe_1.inject)("ConfigServer")),
    __param(5, (0, tsyringe_1.inject)("ItemHelper")),
    __param(6, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(7, (0, tsyringe_1.inject)("RepairService")),
    __param(8, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(9, (0, tsyringe_1.injectAll)("InventoryMagGen")),
    __param(10, (0, tsyringe_1.inject)("AndernData")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _d : Object, typeof (_e = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _e : Object, typeof (_f = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _f : Object, typeof (_g = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _g : Object, typeof (_h = typeof RepairService_1.RepairService !== "undefined" && RepairService_1.RepairService) === "function" ? _h : Object, typeof (_j = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _j : Object, Array, typeof (_k = typeof Data_1.Data !== "undefined" && Data_1.Data) === "function" ? _k : Object])
], WeaponGenerator);
//# sourceMappingURL=WeaponGenerator.js.map