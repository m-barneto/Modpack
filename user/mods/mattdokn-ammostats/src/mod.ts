import { DependencyContainer } from "tsyringe";

import { jsonc } from "jsonc";
import path from "path";
import { QuestRewardType } from "@spt/models/enums/QuestRewardType";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { VFS } from "@spt/utils/VFS";
import { ItemType } from "@spt/models/eft/common/tables/ITemplateItem";
import { LocaleService } from "@spt/services/LocaleService";


class AmmoStats implements IPostDBLoadMod {
    private modConfig;

    public postDBLoad(container: DependencyContainer): void {
        const vfs = container.resolve<VFS>("VFS");
        this.modConfig = jsonc.parse(vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const localeService = container.resolve<LocaleService>("LocaleService");

        const itemDatabase = databaseServer.getTables().templates.items;
        const handbookDatabase = databaseServer.getTables().templates.handbook;
        const localeDatabase = localeService.getLocaleDb();

        for (const itemId in itemDatabase) {
            const item = itemDatabase[itemId];
            if (item._type != ItemType.ITEM) continue;

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
