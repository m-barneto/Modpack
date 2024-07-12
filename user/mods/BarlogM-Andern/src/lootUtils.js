"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lootConfig = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const config_json_1 = __importDefault(require("../config/config.json"));
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_KEYS_RELATIVE_PROBABILITY_THRESHOLD = 4;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_KEYS_RELATIVE_PROBABILITY_MULTIPLIER = 8;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_KEYS_SPAWN_POINT_PROBABILITY = 0.1;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_CARDS_RELATIVE_PROBABILITY_THRESHOLD = 4;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_CARDS_RELATIVE_PROBABILITY_MULTIPLIER = 8;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_CARDS_SPAWN_POINT_PROBABILITY = 0.1;
// eslint-disable-next-line @typescript-eslint/naming-convention
const STATIC_LOOT_KEYS_RELATIVE_PROBABILITY = 1500;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_RARE_ITEMS_RELATIVE_PROBABILITY_THRESHOLD = 4;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_RARE_ITEMS_RELATIVE_PROBABILITY_MULTIPLIER = 8;
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOOSE_LOOT_RARE_ITEMS_SPAWN_POINT_PROBABILITY = 0.8;
// eslint-disable-next-line @typescript-eslint/naming-convention
const RARE_ITEMS = [
    "6389c7f115805221fb410466",
    "6389c85357baa773a825b356",
    "5d0378d486f77420421a5ff4",
    "5c052f6886f7746b1e3db148",
    "6389c7750ef44505c87f5996",
    "6389c92d52123d5dd17f8876",
    "6389c8fb46b54c634724d847",
    "5c0530ee86f774697952d952",
    "5c052fb986f7746b2101e909",
    "5c05308086f7746b2101e90b",
];
// eslint-disable-next-line @typescript-eslint/naming-convention
const LOCATIONS = [
    "laboratory",
    "lighthouse"
];
// eslint-disable-next-line @typescript-eslint/naming-convention
const IGNORE_LOCATIONS = [
    "base",
    "develop",
    "hideout",
    "privatearea",
    "suburbs",
    "terminal",
    "town",
];
function lootConfig(container) {
    const databaseServer = container.resolve("DatabaseServer");
    setLootMultiplier(container);
    setScavCaseLootValueMultiplier(container);
    if (config_json_1.default.increaseStaticLootKeysSpawn) {
        increaseStaticLootKeysSpawn(container, databaseServer);
    }
    if (config_json_1.default.increaseLooseLootKeysSpawn) {
        increaseLooseLootKeysSpawn(container, databaseServer);
    }
    if (config_json_1.default.increaseLooseLootCardsSpawn) {
        increaseLooseLootCardsSpawn(container, databaseServer);
    }
    if (config_json_1.default.increaseRareLootSpawn) {
        increaseRareLooseLootSpawn(container, databaseServer);
    }
}
exports.lootConfig = lootConfig;
function setLootMultiplier(container) {
    const configServer = container.resolve("ConfigServer");
    const locationConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
    for (const map in locationConfig.looseLootMultiplier) {
        locationConfig.looseLootMultiplier[map] *= config_json_1.default.looseLootMultiplier;
    }
    for (const map in locationConfig.staticLootMultiplier) {
        locationConfig.staticLootMultiplier[map] *= config_json_1.default.staticLootMultiplier;
    }
}
function setScavCaseLootValueMultiplier(container) {
    const configServer = container.resolve("ConfigServer");
    const scavCaseConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.SCAVCASE);
    scavCaseConfig.allowBossItemsAsRewards = true;
    for (const valueRange in scavCaseConfig.rewardItemValueRangeRub) {
        scavCaseConfig.rewardItemValueRangeRub[valueRange].min *=
            config_json_1.default.scavCaseLootValueMultiplier;
        scavCaseConfig.rewardItemValueRangeRub[valueRange].max *=
            config_json_1.default.scavCaseLootValueMultiplier;
    }
}
function increaseStaticLootKeysSpawn(container, databaseServer) {
    const drawers = ["578f87b7245977356274f2cd"];
    const jackets = [
        "578f8778245977358849a9b5",
        "5914944186f774189e5e76c2",
        "59387ac686f77401442ddd61",
        "5937ef2b86f77408a47244b3"
    ];
    const containers = [...drawers, ...jackets];
    const itemHelper = container.resolve("ItemHelper");
    const database = databaseServer.getTables();
    for (const [locationName, locationObj] of Object.entries(database.locations)) {
        if (IGNORE_LOCATIONS.includes(locationName)) {
            continue;
        }
        const staticLootDistribution = locationObj.staticLoot;
        const drawersAndJackets = Object.fromEntries(Object.entries(staticLootDistribution).filter(([staticLootTpl, staticLootDetails]) => {
            return (staticLootDetails.itemDistribution &&
                containers.includes(staticLootTpl));
        }));
        Object.entries(drawersAndJackets).forEach(([staticLootTpl, staticLootDetails]) => {
            staticLootDetails.itemDistribution.forEach((itemDistribution) => {
                if (itemHelper.isOfBaseclass(itemDistribution.tpl, BaseClasses_1.BaseClasses.KEY_MECHANICAL)) {
                    if (itemDistribution.relativeProbability <
                        STATIC_LOOT_KEYS_RELATIVE_PROBABILITY) {
                        if (config_json_1.default.debug) {
                            console.log(`[Andern] ${itemDistribution.tpl} relative probability ${itemDistribution.relativeProbability} -> ${STATIC_LOOT_KEYS_RELATIVE_PROBABILITY}`);
                        }
                        itemDistribution.relativeProbability =
                            STATIC_LOOT_KEYS_RELATIVE_PROBABILITY;
                    }
                }
            });
        });
    }
}
function increaseLooseLootProbabilityForKeysAndCards(itemHelper, spawnPoint, itemClass, targetProbability, probabilityThreshold, probabilityMultiplier) {
    const items = spawnPoint.template.Items.filter((item) => itemHelper.isOfBaseclass(item._tpl, itemClass));
    items.forEach((item) => {
        const itemDistribution = spawnPoint.itemDistribution.find((i) => i.composedKey.key === item._id);
        if (itemDistribution) {
            if (spawnPoint.probability < targetProbability) {
                spawnPoint.probability = targetProbability;
            }
            if (itemDistribution.relativeProbability <
                probabilityThreshold) {
                itemDistribution.relativeProbability *=
                    probabilityMultiplier;
            }
        }
    });
}
function increaseLooseLootKeysSpawn(container, databaseServer) {
    const itemHelper = container.resolve("ItemHelper");
    const database = databaseServer.getTables();
    const locations = database.locations;
    Object.entries(locations).forEach(([locationName, location]) => {
        if (location.looseLoot) {
            location.looseLoot?.spawnpoints.forEach((spawnPoint) => {
                increaseLooseLootProbabilityForKeysAndCards(itemHelper, spawnPoint, BaseClasses_1.BaseClasses.KEY_MECHANICAL, LOOSE_LOOT_KEYS_SPAWN_POINT_PROBABILITY, LOOSE_LOOT_KEYS_RELATIVE_PROBABILITY_THRESHOLD, LOOSE_LOOT_KEYS_RELATIVE_PROBABILITY_MULTIPLIER);
            });
        }
    });
}
function increaseLooseLootCardsSpawn(container, databaseServer) {
    const itemHelper = container.resolve("ItemHelper");
    const database = databaseServer.getTables();
    const locations = database.locations;
    Object.entries(locations).forEach(([locationName, location]) => {
        if (location.looseLoot) {
            location.looseLoot?.spawnpoints.forEach((spawnPoint) => {
                increaseLooseLootProbabilityForKeysAndCards(itemHelper, spawnPoint, BaseClasses_1.BaseClasses.KEYCARD, LOOSE_LOOT_CARDS_SPAWN_POINT_PROBABILITY, LOOSE_LOOT_CARDS_RELATIVE_PROBABILITY_THRESHOLD, LOOSE_LOOT_CARDS_RELATIVE_PROBABILITY_MULTIPLIER);
            });
        }
    });
}
function increaseRareLooseLootSpawn(container, databaseServer) {
    const database = databaseServer.getTables();
    const locations = Object.entries(database.locations)
        .filter(([locationName, locationData]) => LOCATIONS.includes(locationName))
        .map(([locationName, locationData]) => locationData);
    const configServer = container.resolve("ConfigServer");
    const locationConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
    LOCATIONS.forEach((locationName) => increaseLocationLooseLootMultiplier(locationName, locationConfig));
    increaseLooseLootRareItemsSpawnChance(locations);
}
function increaseLooseLootRareItemsSpawnChance(locations) {
    locations.forEach((location) => {
        if (location.looseLoot) {
            location.looseLoot?.spawnpoints.forEach((spawnPoint) => {
                increaseLooseLootProbability(spawnPoint, RARE_ITEMS, LOOSE_LOOT_RARE_ITEMS_SPAWN_POINT_PROBABILITY, LOOSE_LOOT_RARE_ITEMS_RELATIVE_PROBABILITY_THRESHOLD, LOOSE_LOOT_RARE_ITEMS_RELATIVE_PROBABILITY_MULTIPLIER);
            });
        }
    });
}
function increaseLooseLootProbability(spawnPoint, itemFilter, targetProbability, probabilityThreshold, probabilityMultiplier) {
    const itemsToIncreaseSpawn = spawnPoint.template.Items.filter((item) => itemFilter.includes(item._tpl));
    const itemsToDecreaseSpawn = spawnPoint.template.Items.filter((item) => !itemFilter.includes(item._tpl));
    itemsToIncreaseSpawn.forEach((item) => {
        const itemDistribution = spawnPoint.itemDistribution.find((i) => i.composedKey.key === item._id);
        if (itemDistribution) {
            if (spawnPoint.probability < targetProbability) {
                spawnPoint.probability = targetProbability;
            }
            if (itemDistribution.relativeProbability < probabilityThreshold) {
                itemDistribution.relativeProbability *=
                    probabilityMultiplier;
            }
        }
    });
    itemsToDecreaseSpawn.forEach((item) => {
        const itemDistribution = spawnPoint.itemDistribution.find((i) => i.composedKey.key === item._id);
        if (itemDistribution) {
            if (itemDistribution.relativeProbability > probabilityThreshold) {
                itemDistribution.relativeProbability = Math.ceil(itemDistribution.relativeProbability /
                    probabilityMultiplier);
            }
        }
    });
}
function increaseLocationLooseLootMultiplier(locationName, locationConfig) {
    locationConfig.looseLootMultiplier[locationName] *= 1.1;
}
//# sourceMappingURL=lootUtils.js.map