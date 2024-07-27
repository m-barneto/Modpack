import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor";


import { readFileSync } from "fs";
import { join } from "path";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        const profileName = "FIWM Zero To Hero"
        
        const tables = databaseServer.getTables();
        
        const zthProfile = tables.templates.profiles["SPT Zero to hero"]
        
        const bearInventoryData = JSON.parse(readFileSync(join(__dirname, "./bear_inventory.json"), "utf-8"))
        const usecInventoryData = JSON.parse(readFileSync(join(__dirname, "./usec_inventory.json"), "utf-8"))
        
        zthProfile.bear.character.Inventory = bearInventoryData;
        zthProfile.usec.character.Inventory = usecInventoryData;

        tables.templates.profiles[profileName] = zthProfile;

        logger.log('FIWM Zero To Hero работает!', "green");
    }
}

module.exports = { mod: new Mod() }