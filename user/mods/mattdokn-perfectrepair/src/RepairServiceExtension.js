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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairServiceExtension = void 0;
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const RepairHelper_1 = require("C:/snapshot/project/obj/helpers/RepairHelper");
const TraderHelper_1 = require("C:/snapshot/project/obj/helpers/TraderHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const SkillTypes_1 = require("C:/snapshot/project/obj/models/enums/SkillTypes");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const PaymentService_1 = require("C:/snapshot/project/obj/services/PaymentService");
const RepairService_1 = require("C:/snapshot/project/obj/services/RepairService");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const mod_1 = require("./mod");
let RepairServiceExtension = class RepairServiceExtension extends RepairService_1.RepairService {
    logger;
    databaseService;
    profileHelper;
    randomUtil;
    itemHelper;
    traderHelper;
    weightedRandomHelper;
    paymentService;
    repairHelper;
    localisationService;
    configServer;
    constructor(logger, databaseService, profileHelper, randomUtil, itemHelper, traderHelper, weightedRandomHelper, paymentService, repairHelper, localisationService, configServer) {
        super(logger, databaseService, profileHelper, randomUtil, itemHelper, traderHelper, weightedRandomHelper, paymentService, repairHelper, localisationService, configServer);
        this.logger = logger;
        this.databaseService = databaseService;
        this.profileHelper = profileHelper;
        this.randomUtil = randomUtil;
        this.itemHelper = itemHelper;
        this.traderHelper = traderHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.paymentService = paymentService;
        this.repairHelper = repairHelper;
        this.localisationService = localisationService;
        this.configServer = configServer;
    }
    shouldBuffItem(repairDetails, pmcData) {
        const globals = this.databaseService.getGlobals();
        const hasTemplate = this.itemHelper.getItem(repairDetails.repairedItem._tpl);
        if (!hasTemplate[0]) {
            return false;
        }
        const template = hasTemplate[1];
        // Returns SkillTypes.LIGHT_VESTS/HEAVY_VESTS/WEAPON_TREATMENT
        const itemSkillType = this.getItemSkillType(template);
        if (!itemSkillType) {
            return false;
        }
        // Skill < level 10 + repairing weapon
        if (itemSkillType === SkillTypes_1.SkillTypes.WEAPON_TREATMENT
            && this.profileHelper.getSkillFromProfile(pmcData, SkillTypes_1.SkillTypes.WEAPON_TREATMENT)?.Progress < 1000
            && !mod_1.PerfectRepair.modConfig.ModifyBuffChance) {
            return false;
        }
        // Skill < level 10 + repairing armor
        if ([SkillTypes_1.SkillTypes.LIGHT_VESTS, SkillTypes_1.SkillTypes.HEAVY_VESTS].includes(itemSkillType)
            && this.profileHelper.getSkillFromProfile(pmcData, itemSkillType)?.Progress < 1000
            && !mod_1.PerfectRepair.modConfig.ModifyBuffChance) {
            return false;
        }
        const commonBuffMinChanceValue = globals.config.SkillsSettings[itemSkillType].BuffSettings.CommonBuffMinChanceValue;
        const commonBuffChanceLevelBonus = globals.config.SkillsSettings[itemSkillType].BuffSettings.CommonBuffChanceLevelBonus;
        const receivedDurabilityMaxPercent = globals.config.SkillsSettings[itemSkillType].BuffSettings.ReceivedDurabilityMaxPercent;
        const skillLevel = Math.trunc((this.profileHelper.getSkillFromProfile(pmcData, itemSkillType)?.Progress ?? 0) / 100);
        if (!repairDetails.repairPoints) {
            throw new Error(this.localisationService.getText("repair-item_has_no_repair_points", repairDetails.repairedItem._tpl));
        }
        const durabilityToRestorePercent = repairDetails.repairPoints / template._props.MaxDurability;
        const durabilityMultiplier = this.getDurabilityMultiplier(receivedDurabilityMaxPercent, durabilityToRestorePercent);
        //https://dev.sp-tarkov.com/SPT/Server/src/commit/22e5da9e6160dd43edaddac7713da6d753aa71b9/project/src/services/RepairService.ts#L580
        let doBuff = commonBuffMinChanceValue + commonBuffChanceLevelBonus * skillLevel * durabilityMultiplier;
        if (mod_1.PerfectRepair.modConfig.ModifyBuffChance) {
            doBuff = mod_1.PerfectRepair.modConfig.BuffChance;
        }
        if (Math.random() <= doBuff) {
            return true;
        }
        return false;
    }
};
exports.RepairServiceExtension = RepairServiceExtension;
exports.RepairServiceExtension = RepairServiceExtension = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(3, (0, tsyringe_1.inject)("RandomUtil")),
    __param(4, (0, tsyringe_1.inject)("ItemHelper")),
    __param(5, (0, tsyringe_1.inject)("TraderHelper")),
    __param(6, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(7, (0, tsyringe_1.inject)("PaymentService")),
    __param(8, (0, tsyringe_1.inject)("RepairHelper")),
    __param(9, (0, tsyringe_1.inject)("LocalisationService")),
    __param(10, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _c : Object, typeof (_d = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _d : Object, typeof (_e = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _e : Object, typeof (_f = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _f : Object, typeof (_g = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _g : Object, typeof (_h = typeof PaymentService_1.PaymentService !== "undefined" && PaymentService_1.PaymentService) === "function" ? _h : Object, typeof (_j = typeof RepairHelper_1.RepairHelper !== "undefined" && RepairHelper_1.RepairHelper) === "function" ? _j : Object, typeof (_k = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _k : Object, typeof (_l = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _l : Object])
], RepairServiceExtension);
//# sourceMappingURL=RepairServiceExtension.js.map