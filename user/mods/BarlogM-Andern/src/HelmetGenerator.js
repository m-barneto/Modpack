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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelmetGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const GearGeneratorHelper_1 = require("./GearGeneratorHelper");
let HelmetGenerator = class HelmetGenerator {
    logger;
    hashUtil;
    randomUtil;
    gearGeneratorHelper;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ALTYN_HELMET = "5aa7e276e5b5b000171d0647";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RYS_HELMET = "5f60c74e3b85f6263c145586";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MASKA_OLIVE_HELMET = "5c091a4e0db834001d5addc8";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MASKA_KILLA_HELMET = "5c0e874186f7745dc7616606";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    VULKAN_HELMET = "5ca20ee186f774799474abc2";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LSHZ_2DTM_HELMET = "5d6d3716a4b9361bc8618872";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AIRFRAME_HELMET = "5c17a7ed2e2216152142459c";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CAIMAN_HYBRID_HELMET = "5f60b34a41e30a4ab12a6947";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _6B47_RATNIK_BSH_HELMET = "5a7c4850e899ef00150be885";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _6B47_RATNIK_BSH_HELMET_DIGITAL = "5aa7cfc0e5b5b00015693143";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LSHZ_LIGHT_HELMET = "5b432d215acfc4771e1c6624";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TC_2001_HELMET = "5d5e7d28a4b936645d161203";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TC_2002_HELMET = "5d5e9c74a4b9364855191c40";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_BLACK_HELMET = "5e00c1ad86f774747333222c";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_EAR_COVERS_BLACK = "5e00cfa786f77469dc6e5685";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_FACE_SHIELD_BLACK = "5e00cdd986f7747473332240";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_BROWN_HELMET = "5e01ef6886f77445f643baa4";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_EAR_COVERS_BROWN = "5e01f31d86f77465cf261343";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EXFIL_FACE_SHIELD_BROWN = "5e01f37686f774773c6f6c15";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    HJELM_HELMET = "61bca7cda0eae612383adf57";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TC800_HELMET = "5e4bfc1586f774264f7582d3";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BASTION_HELMET = "5ea17ca01412a1425304d1c0";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BASTION_ARMOR_PLATE = "5ea18c84ecf1982c7712d9a2";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_TAN_HELMET = "5ac8d6885acfc400180ae7b0";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_BLACK_HELMET = "5a154d5cfcdbcb001a3b00da";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_BALLISTIC_FACE_SHIELD = "5a16b7e1fcdbcb00165aa6c9";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_SIDE_ARMOR = "5a16badafcdbcb001865f72d";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_SLAAP_HELMET_PLATE = "5c0e66e2d174af02a96252f4";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FAST_GUNSIGHT_MANDIBLE = "5a16ba61fcdbcb098008728a";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    HEAVY_TROOPER_MASK = "5ea058e01dbce517f324b3e2";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NVG_SLOT_ID = "mod_nvg";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GPNVG_18_NIGHT_VISION_GOGGLES = "5c0558060db834001b735271";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PNV_10T_NIGHT_VISION_GOGGLES = "5c0696830db834001d23f5da";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NOROTOS_TITANIUM_ADVANCED_TACTICAL_MOUNT = "5a16b8a9fcdbcb00165aa6ca";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PNV_10T_DOVETAIL_ADAPTER = "5c0695860db834001b735461";
    headphonesIncompatibleHelmets = [
        this.ALTYN_HELMET,
        this.RYS_HELMET,
        this.MASKA_OLIVE_HELMET,
        this.MASKA_KILLA_HELMET,
        this.VULKAN_HELMET,
        this.LSHZ_2DTM_HELMET,
    ];
    headphonesNotFullyCompatableHelmets = [
        this.AIRFRAME_HELMET,
        this.LSHZ_LIGHT_HELMET,
        this.EXFIL_BLACK_HELMET,
        this.EXFIL_BROWN_HELMET,
        this.FAST_BLACK_HELMET,
        this.FAST_TAN_HELMET,
    ];
    constructor(logger, hashUtil, randomUtil, gearGeneratorHelper) {
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.gearGeneratorHelper = gearGeneratorHelper;
    }
    generateHelmet(botLevel, botRole, botInventory, tpl, isNightVision, isKittedHelmet) {
        if (isNightVision) {
            tpl = this.selectNightHelmet(botLevel);
        }
        switch (tpl) {
            case this.ALTYN_HELMET: {
                this.altynHelmet(botLevel, botRole, botInventory);
                break;
            }
            case this.RYS_HELMET: {
                this.rysHelmet(botLevel, botRole, botInventory);
                break;
            }
            case this.MASKA_OLIVE_HELMET: {
                this.maskaHelmet(this.MASKA_OLIVE_HELMET, botLevel, botRole, botInventory);
                break;
            }
            case this.MASKA_KILLA_HELMET: {
                this.maskaHelmet(this.MASKA_KILLA_HELMET, botLevel, botRole, botInventory);
                break;
            }
            case this.VULKAN_HELMET: {
                this.vulkanHelmet(botLevel, botRole, botInventory);
                break;
            }
            case this.LSHZ_2DTM_HELMET: {
                this.lshz2dtmHelmet(botLevel, botRole, botInventory, isKittedHelmet);
                break;
            }
            case this.AIRFRAME_HELMET: {
                this.airFrameHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.CAIMAN_HYBRID_HELMET: {
                this.caimanHybridHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this._6B47_RATNIK_BSH_HELMET: {
                this.ratnikBshHelmet(this._6B47_RATNIK_BSH_HELMET, botLevel, botRole, botInventory, isNightVision);
                break;
            }
            case this._6B47_RATNIK_BSH_HELMET_DIGITAL: {
                this.ratnikBshHelmet(this._6B47_RATNIK_BSH_HELMET_DIGITAL, botLevel, botRole, botInventory, isNightVision);
                break;
            }
            case this.LSHZ_LIGHT_HELMET: {
                this.lshzLightHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.TC_2001_HELMET: {
                this.tc200xHelmet(this.TC_2001_HELMET, botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.TC_2002_HELMET: {
                this.tc200xHelmet(this.TC_2002_HELMET, botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.EXFIL_BLACK_HELMET: {
                this.exfilBlackHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.EXFIL_BROWN_HELMET: {
                this.exfilBrownHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.HJELM_HELMET: {
                this.hjelmHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.TC800_HELMET: {
                this.tc800Helmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.BASTION_HELMET: {
                this.bastionHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.FAST_TAN_HELMET: {
                this.fastHelmet(this.FAST_TAN_HELMET, botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            case this.FAST_BLACK_HELMET: {
                this.fastHelmet(this.FAST_BLACK_HELMET, botLevel, botRole, botInventory, isNightVision, isKittedHelmet);
                break;
            }
            default: {
                this.anyOtherHelmet(tpl, botLevel, botRole, botInventory);
                break;
            }
        }
    }
    anyOtherHelmet(tpl, botLevel, botRole, botInventory) {
        this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, tpl, false, botLevel);
    }
    altynHelmet(botLevel, botRole, botInventory) {
        const ALTYN_FACE_SHIELD = "5aa7e373e5b5b000137b76f0";
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.ALTYN_HELMET, false, botLevel);
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, ALTYN_FACE_SHIELD, "mod_equipment", helmetItemId);
    }
    rysHelmet(botLevel, botRole, botInventory) {
        const RYS_FACE_SHIELD = "5f60c85b58eff926626a60f7";
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.RYS_HELMET, false, botLevel);
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, RYS_FACE_SHIELD, "mod_equipment", helmetItemId);
    }
    maskaHelmet(helmetTpl, botLevel, botRole, botInventory) {
        const MASKA_OLIVE_FACE_SHIELD = "5c0919b50db834001b7ce3b9";
        const MASKA_KILLA_FACE_SHIELD = "5c0e842486f77443a74d2976";
        const faceShieldTpl = helmetTpl === this.MASKA_OLIVE_HELMET
            ? MASKA_OLIVE_FACE_SHIELD
            : MASKA_KILLA_FACE_SHIELD;
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, helmetTpl, false, botLevel);
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, faceShieldTpl, "mod_equipment", helmetItemId);
    }
    vulkanHelmet(botLevel, botRole, botInventory) {
        const VULKAN_FACE_SHIELD = "5ca2113f86f7740b2547e1d2";
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.VULKAN_HELMET, false, botLevel);
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, VULKAN_FACE_SHIELD, "mod_equipment", helmetItemId);
    }
    lshz2dtmHelmet(botLevel, botRole, botInventory, isKittedHelmet) {
        const LSHZ_2DTM_FACE_SHIELD = "5d6d3829a4b9361bc8618943";
        const LSHZ_2DTM_AVENTAIL = "5d6d3be5a4b9361bc73bc763";
        const LSHZ_2DTM_COVER = "5d6d3943a4b9360dbc46d0cc";
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.LSHZ_2DTM_HELMET, false, botLevel);
        if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, LSHZ_2DTM_FACE_SHIELD, "mod_equipment_000", helmetItemId);
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, LSHZ_2DTM_AVENTAIL, "mod_equipment_001", helmetItemId);
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, LSHZ_2DTM_COVER, "mod_equipment_002", helmetItemId);
        }
    }
    airFrameHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.AIRFRAME_HELMET, false, botLevel);
        if (isKittedHelmet) {
            const AIRFRAME_CHOPS = "5c178a942e22164bef5ceca3";
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, AIRFRAME_CHOPS, "mod_equipment_001", helmetItemId);
        }
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
        else if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_BALLISTIC_FACE_SHIELD, "mod_equipment_000", helmetItemId);
        }
    }
    caimanHybridHelmet(botLevel, botRole, botInventory, isNighVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.CAIMAN_HYBRID_HELMET, false, botLevel);
        if (isKittedHelmet) {
            const CAIMAN_BALLISTIC_MANDIBLE_GUARD = "5f60c076f2bcbb675b00dac2";
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, CAIMAN_BALLISTIC_MANDIBLE_GUARD, "mod_equipment_000", helmetItemId);
            const CAIMAN_BALLISTIC_APPLIQUE = "5f60b85bbdb8e27dee3dc985";
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, CAIMAN_BALLISTIC_APPLIQUE, "mod_equipment_002", helmetItemId);
        }
        if (isNighVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
        else if (isKittedHelmet) {
            const CAIMAN_FIXED_ARM_VISOR = "5f60bf4558eff926626a60f2";
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, CAIMAN_FIXED_ARM_VISOR, this.NVG_SLOT_ID, helmetItemId);
        }
    }
    ratnikBshHelmet(helmetTpl, botLevel, botRole, botInventory, isNightVision) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, helmetTpl, false, botLevel);
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
    }
    lshzLightHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.LSHZ_LIGHT_HELMET, false, botLevel);
        if (!isNightVision && isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_BALLISTIC_FACE_SHIELD, this.NVG_SLOT_ID, helmetItemId);
            return;
        }
        if (isKittedHelmet) {
            const sideArmorId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_SIDE_ARMOR, "mod_equipment_000", helmetItemId);
            if (this.randomUtil.getBool()) {
                const maskId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.HEAVY_TROOPER_MASK, this.NVG_SLOT_ID, helmetItemId);
                if (isNightVision) {
                    this.generateNvg(botLevel, botRole, botInventory, maskId);
                }
            }
            else {
                this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_GUNSIGHT_MANDIBLE, "mod_equipment", sideArmorId);
                if (isNightVision) {
                    this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
                }
            }
        }
        else if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
    }
    tc200xHelmet(helmetTpl, botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, helmetTpl, false, botLevel);
        if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_SLAAP_HELMET_PLATE, "mod_equipment_002", helmetItemId);
        }
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
    }
    exfilBlackHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.EXFIL_BLACK_HELMET, false, botLevel);
        if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.EXFIL_EAR_COVERS_BLACK, "mod_equipment_000", helmetItemId);
        }
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
        else if (isKittedHelmet) {
            const faceShieldId = this.randomUtil.getBool()
                ? this.EXFIL_FACE_SHIELD_BLACK
                : this.EXFIL_FACE_SHIELD_BROWN;
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, faceShieldId, "mod_equipment_001", helmetItemId);
        }
    }
    exfilBrownHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.EXFIL_BROWN_HELMET, false, botLevel);
        if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.EXFIL_EAR_COVERS_BROWN, "mod_equipment_000", helmetItemId);
        }
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
    }
    hjelmHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.HJELM_HELMET, false, botLevel);
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
        else if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_BALLISTIC_FACE_SHIELD, "mod_equipment_000", helmetItemId);
        }
    }
    tc800Helmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.TC800_HELMET, false, botLevel);
        if (isNightVision) {
            this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
        }
        else if (isKittedHelmet) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_BALLISTIC_FACE_SHIELD, "mod_equipment_000", helmetItemId);
        }
    }
    bastionHelmet(botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, this.BASTION_HELMET, false, botLevel);
        if (isKittedHelmet) {
            const plateId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.BASTION_ARMOR_PLATE, this.NVG_SLOT_ID, helmetItemId);
            if (isNightVision) {
                this.generateNvg(botLevel, botRole, botInventory, plateId);
            }
        }
        else {
            if (isNightVision) {
                this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
            }
        }
    }
    fastHelmet(helmetTpl, botLevel, botRole, botInventory, isNightVision, isKittedHelmet) {
        const helmetItemId = this.gearGeneratorHelper.putGearItemToInventory(EquipmentSlots_1.EquipmentSlots.HEADWEAR, botRole, botInventory, helmetTpl, false, botLevel);
        if (!isNightVision && isKittedHelmet && this.randomUtil.getBool()) {
            this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_BALLISTIC_FACE_SHIELD, "mod_equipment_000", helmetItemId);
            return;
        }
        if (isKittedHelmet) {
            const sideArmorId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_SIDE_ARMOR, "mod_equipment_000", helmetItemId);
            if (this.randomUtil.getBool()) {
                const maskId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.HEAVY_TROOPER_MASK, this.NVG_SLOT_ID, helmetItemId);
                if (isNightVision) {
                    this.generateNvg(botLevel, botRole, botInventory, maskId);
                }
            }
            else {
                this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_GUNSIGHT_MANDIBLE, "mod_equipment", sideArmorId);
                this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.FAST_SLAAP_HELMET_PLATE, "mod_equipment_002", helmetItemId);
                if (isNightVision) {
                    this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
                }
            }
        }
        else {
            if (isNightVision) {
                this.generateNvg(botLevel, botRole, botInventory, helmetItemId);
            }
        }
    }
    generateNvg(botLevel, botRole, botInventory, helmetItemId) {
        if (botLevel <= 28) {
            this.generatePnvNvg(botRole, botInventory, helmetItemId);
        }
        else {
            this.generateGpNvg(botRole, botInventory, helmetItemId);
        }
    }
    generatePnvNvg(botRole, botInventory, parentId) {
        const mountId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.NOROTOS_TITANIUM_ADVANCED_TACTICAL_MOUNT, this.NVG_SLOT_ID, parentId);
        const adapterId = this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.PNV_10T_DOVETAIL_ADAPTER, this.NVG_SLOT_ID, mountId);
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.PNV_10T_NIGHT_VISION_GOGGLES, this.NVG_SLOT_ID, adapterId);
    }
    generateGpNvg(botRole, botInventory, parentId) {
        this.gearGeneratorHelper.putModItemToInventory(botRole, botInventory, this.GPNVG_18_NIGHT_VISION_GOGGLES, this.NVG_SLOT_ID, parentId);
    }
    tierOneNightHelmet() {
        return this._6B47_RATNIK_BSH_HELMET_DIGITAL;
    }
    tierTwoNightHelmet() {
        const helmets = [
            this._6B47_RATNIK_BSH_HELMET,
            this.TC_2001_HELMET,
            this.TC_2002_HELMET,
            this.TC800_HELMET,
            this.CAIMAN_HYBRID_HELMET,
            this.LSHZ_LIGHT_HELMET,
            this.HJELM_HELMET
        ];
        return this.randomUtil.getArrayValue(helmets);
    }
    tierThreeNightHelmet() {
        const helmets = [
            this.CAIMAN_HYBRID_HELMET,
            this.TC800_HELMET,
            this.BASTION_HELMET,
            this.TC_2001_HELMET,
            this.TC_2002_HELMET,
        ];
        return this.randomUtil.getArrayValue(helmets);
    }
    tierFourNightHelmet() {
        const helmets = [
            this.AIRFRAME_HELMET,
            this.EXFIL_BLACK_HELMET,
            this.EXFIL_BROWN_HELMET,
            this.FAST_TAN_HELMET,
            this.FAST_BLACK_HELMET,
        ];
        return this.randomUtil.getArrayValue(helmets);
    }
    selectNightHelmet(botLevel) {
        if (botLevel < 15) {
            return this.tierOneNightHelmet();
        }
        else if (botLevel >= 15 && botLevel < 32) {
            return this.tierTwoNightHelmet();
        }
        else if (botLevel >= 32 && botLevel < 42) {
            return this.tierThreeNightHelmet();
        }
        else {
            return this.tierFourNightHelmet();
        }
    }
    isEarpieceIncompatible(helmetTpl) {
        return this.headphonesIncompatibleHelmets.includes(helmetTpl);
    }
    isEarpieceNotFullyCompatible(helmetTpl) {
        return this.headphonesNotFullyCompatableHelmets.includes(helmetTpl);
    }
};
exports.HelmetGenerator = HelmetGenerator;
exports.HelmetGenerator = HelmetGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("AndernGearGeneratorHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof GearGeneratorHelper_1.GearGeneratorHelper !== "undefined" && GearGeneratorHelper_1.GearGeneratorHelper) === "function" ? _d : Object])
], HelmetGenerator);
//# sourceMappingURL=HelmetGenerator.js.map