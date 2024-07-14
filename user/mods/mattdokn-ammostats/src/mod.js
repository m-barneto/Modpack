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
    itemDatabase;
    handbookDatabase;
    localeDatabase;
    postDBLoad(container) {
        const vfs = container.resolve("VFS");
        this.modConfig = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const localeService = container.resolve("LocaleService");
        this.itemDatabase = databaseServer.getTables().templates.items;
        this.handbookDatabase = databaseServer.getTables().templates.handbook;
        this.localeDatabase = localeService.getLocaleDb();
        for (const itemId in this.itemDatabase) {
            const item = this.itemDatabase[itemId];
            if (item._type != ITemplateItem_1.ItemType.ITEM)
                continue;
            const handbookItem = this.handbookDatabase.Items.find((i) => i.Id === item._id);
            if (handbookItem == undefined)
                continue;
            if (item._parent == "5485a8684bdc2da71d8b4567") {
                if (!("ammoType" in item._props) || item._props.ammoType != "bullet" && item._props.ammoType != "grenade") {
                    continue;
                }
                this.addInfoToName(item, item);
            }
            else if (item._parent == "543be5cb4bdc2deb348b4568") {
                // Get the bullet for our ammo pack
                if (!("StackSlots" in item._props)) {
                    continue;
                }
                const stackSlots = item._props.StackSlots;
                if (stackSlots.length != 1) {
                    continue;
                }
                // Get first slot
                if (stackSlots[0]._parent != item._id) {
                    logger.error(`Problem handling ammo box with ID ${item._id}`);
                    continue;
                }
                if (!("filters" in stackSlots[0]._props)) {
                    logger.error(`Problem with filters in ammo box with ID ${item._id}`);
                    continue;
                }
                const filters = stackSlots[0]._props.filters;
                if (filters.length != 1) {
                    logger.error(`Problem with filters length in ammo box with ID ${item._id}`);
                }
                const filter = filters[0].Filter[0];
                const bulletId = filter;
                this.addInfoToName(item, this.itemDatabase[bulletId]);
            }
        }
    }
    addInfoToName(item, bullet) {
        if (bullet._name.toLowerCase().indexOf("shrapnel") != -1 || bullet._name.toLowerCase().indexOf("patron_rsp") != -1 || bullet._name.toLowerCase().indexOf("patron_26x75") != -1) {
            return;
        }
        const itemName = item._id + " Name";
        const hasDamageProp = "Damage" in bullet._props;
        const hasPenProp = "PenetrationPower" in bullet._props;
        if (!hasPenProp || !hasDamageProp)
            return;
        let bulletInfo;
        if (this.modConfig.InfoInParenthesis) {
            bulletInfo = "(";
        }
        if (this.modConfig.ShowPenBeforeDmg) {
            bulletInfo += `${bullet._props.PenetrationPower}/${bullet._props.Damage}`;
        }
        else {
            bulletInfo += `${bullet._props.Damage}/${bullet._props.PenetrationPower}`;
        }
        if (this.modConfig.InfoInParenthesis) {
            bulletInfo += ")";
        }
        const itemLocaleName = this.localeDatabase[itemName];
        if (this.modConfig.InfoBeforeName) {
            this.localeDatabase[itemName] = bulletInfo + " " + itemLocaleName;
        }
        else {
            this.localeDatabase[itemName] = itemLocaleName + " " + bulletInfo;
        }
    }
}
module.exports = { mod: new AmmoStats() };
//# sourceMappingURL=mod.js.map