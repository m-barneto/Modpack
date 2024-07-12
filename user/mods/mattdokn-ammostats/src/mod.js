"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
const ITemplateItem_1 = require("C:/snapshot/project/obj/models/eft/common/tables/ITemplateItem");
class AmmoStats {
    modConfig;
    postDBLoad(container) {
        const vfs = container.resolve("VFS");
        this.modConfig = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const localeService = container.resolve("LocaleService");
        const itemDatabase = databaseServer.getTables().templates.items;
        const handbookDatabase = databaseServer.getTables().templates.handbook;
        const localeDatabase = localeService.getLocaleDb();
        for (const itemId in itemDatabase) {
            const item = itemDatabase[itemId];
            if (item._type != ITemplateItem_1.ItemType.ITEM)
                continue;
            if (item._parent == "5485a8684bdc2da71d8b4567" || item._parent == "543be5cb4bdc2deb348b4568") {
                const handbookItem = handbookDatabase.Items.find((i) => i.Id === item._id);
                if (handbookItem == undefined) {
                    continue;
                }
                if (!("ammoType" in item._props) || item._props.ammoType != "bullet" && item._props.ammoType != "grenade") {
                    continue;
                }
                if (item._name.toLowerCase().indexOf("shrapnel") != -1 || item._name.toLowerCase().indexOf("patron_rsp") != -1 || item._name.toLowerCase().indexOf("patron_26x75") != -1) {
                    continue;
                }
                const itemName = item._id + " Name";
                const hasDamageProp = "Damage" in item._props;
                const hasPenProp = "PenetrationPower" in item._props;
                if (hasPenProp && hasDamageProp) {
                    localeDatabase[itemName] = localeDatabase[itemName] + ` ${item._props.Damage}/${item._props.PenetrationPower}`;
                }
            }
        }
    }
}
module.exports = { mod: new AmmoStats() };
//# sourceMappingURL=mod.js.map