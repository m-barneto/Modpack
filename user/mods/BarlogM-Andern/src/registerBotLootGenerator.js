"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerBotLootGenerator(container) {
    const logger = container.resolve("WinstonLogger");
    const botLootGenerator = container.resolve("BotLootGenerator");
    const lootGenerator = container.resolve("AndernLootGenerator");
    const raidInfo = container.resolve("AndernRaidInfo");
    container.afterResolution("BotLootGenerator", (_t, result) => {
        result.generateLoot = (sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel) => {
            return lootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel, raidInfo);
        };
    }, { frequency: "Always" });
    logger.info("[Andern] PMC Bot Loot Generator registered");
}
exports.default = registerBotLootGenerator;
//# sourceMappingURL=registerBotLootGenerator.js.map