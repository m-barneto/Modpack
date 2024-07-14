"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = exports.PerfectRepair = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
const RepairServiceExtension_1 = require("./RepairServiceExtension");
class PerfectRepair {
    static modConfig;
    preSptLoad(container) {
        const vfs = container.resolve("VFS");
        PerfectRepair.modConfig = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
        if (PerfectRepair.modConfig.ModifyBuffChance) {
            container.register("RepairServiceExtension", RepairServiceExtension_1.RepairServiceExtension);
            container.register("RepairService", { useToken: "RepairServiceExtension" });
        }
    }
    postSptLoad(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        configServer.getConfig(ConfigTypes_1.ConfigTypes.REPAIR)["applyRandomizeDurabilityLoss"] = false;
        if (PerfectRepair.modConfig.Armor) {
            const armorMaterials = databaseServer.getTables().globals.config.ArmorMaterials;
            for (const materialId in armorMaterials) {
                if (!PerfectRepair.modConfig.RestrictPerfectRepairToKits) {
                    armorMaterials[materialId].MinRepairDegradation = 0.0;
                    armorMaterials[materialId].MaxRepairDegradation = 0.0;
                }
                armorMaterials[materialId].MinRepairKitDegradation = 0.0;
                armorMaterials[materialId].MaxRepairKitDegradation = 0.0;
            }
        }
        if (PerfectRepair.modConfig.Weapon) {
            const itemDatabase = databaseServer.getTables().templates.items;
            for (const itemId in itemDatabase) {
                const item = itemDatabase[itemId];
                if (item._props.MaxRepairDegradation !== undefined && item._props.MaxRepairKitDegradation !== undefined) {
                    if (!PerfectRepair.modConfig.RestrictPerfectRepairToKits) {
                        item._props.MinRepairDegradation = 0.0;
                        item._props.MaxRepairDegradation = 0.0;
                    }
                    item._props.MinRepairKitDegradation = 0.0;
                    item._props.MaxRepairKitDegradation = 0.0;
                }
            }
        }
    }
}
exports.PerfectRepair = PerfectRepair;
exports.mod = new PerfectRepair();
//# sourceMappingURL=mod.js.map