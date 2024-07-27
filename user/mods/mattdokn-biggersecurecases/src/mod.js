"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
class BiggerSecureCases {
    modConfig;
    logger;
    postDBLoad(container) {
        const vfs = container.resolve("VFS");
        const databaseServer = container.resolve("DatabaseServer");
        const itemHelper = container.resolve("ItemHelper");
        this.logger = container.resolve("WinstonLogger");
        this.modConfig = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
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
//# sourceMappingURL=mod.js.map