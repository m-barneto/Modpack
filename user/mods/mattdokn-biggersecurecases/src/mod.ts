import { DependencyContainer } from "tsyringe";

import { jsonc } from "jsonc";
import path from "path";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { VFS } from "@spt/utils/VFS";
import { ItemHelper } from "@spt/helpers/ItemHelper";

class BiggerSecureCases implements IPostDBLoadMod {
    private modConfig;
    private logger: ILogger;

    public postDBLoad(container: DependencyContainer): void {
        const vfs = container.resolve<VFS>("VFS");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const itemHelper = container.resolve<ItemHelper>("ItemHelper");

        this.logger = container.resolve<ILogger>("WinstonLogger");
        
        this.modConfig = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

        const items = databaseServer.getTables().templates.items;

        for (const containerId in this.modConfig.Containers) {
            const containerInfo = this.modConfig.Containers[containerId];
            const containerItem = items[containerId];
            containerItem._props.Grids = containerItem._props.Grids.slice(0, 1);
            containerItem._props.Grids[0]._props.cellsH = containerInfo.width;
            containerItem._props.Grids[0]._props.cellsV = containerInfo.height;
        }
    }
}

module.exports = { mod: new BiggerSecureCases() };
