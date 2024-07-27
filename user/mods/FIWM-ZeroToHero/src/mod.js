"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class Mod {
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const profileName = "FIWM Zero To Hero";
        const tables = databaseServer.getTables();
        const zthProfile = tables.templates.profiles["SPT Zero to hero"];
        const bearInventoryData = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./bear_inventory.json"), "utf-8"));
        const usecInventoryData = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./usec_inventory.json"), "utf-8"));
        zthProfile.bear.character.Inventory = bearInventoryData;
        zthProfile.usec.character.Inventory = usecInventoryData;
        tables.templates.profiles[profileName] = zthProfile;
        logger.log('FIWM Zero To Hero работает!', "green");
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map