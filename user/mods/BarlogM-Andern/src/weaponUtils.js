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
const config = __importStar(require("../config/config.json"));
function vssOverheatFix(container) {
    const VSS_TPL = "57838ad32459774a17445cd2";
    const VAL_TPL = "57c44b372459772d2b39b8ce";
    const databaseServer = container.resolve("DatabaseServer");
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    items[VSS_TPL]._props.HeatFactorGun *= config.vssValOverheatMultiplier;
    items[VSS_TPL]._props.HeatFactorByShot *= config.vssValOverheatMultiplier;
    items[VAL_TPL]._props.HeatFactorGun *= config.vssValOverheatMultiplier;
    items[VAL_TPL]._props.HeatFactorByShot *= config.vssValOverheatMultiplier;
    Object.entries(items)
        .filter(([tpl, itemTemplate]) => itemTemplate._props.Caliber === "Caliber9x39")
        .forEach(([tpl, itemTemplate]) => itemTemplate._props.HeatFactor *= config.vssValOverheatMultiplier);
}
exports.default = vssOverheatFix;
//# sourceMappingURL=weaponUtils.js.map