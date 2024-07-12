"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerBotInventoryGenerator(container) {
    const logger = container.resolve("WinstonLogger");
    const botInventoryGenerator = container.resolve("BotInventoryGenerator");
    const raidInfo = container.resolve("AndernRaidInfo");
    const gearGenerator = container.resolve("AndernGearGenerator");
    container.afterResolution("BotInventoryGenerator", (_t, result) => {
        result.generateInventory = (sessionId, botJsonTemplate, botRole, isPmc, botLevel) => {
            if (isPmc) {
                const inventory = gearGenerator.generateInventory(sessionId, botJsonTemplate, botRole, isPmc, botLevel, raidInfo);
                return inventory;
            }
            return botInventoryGenerator.generateInventory(sessionId, botJsonTemplate, botRole, isPmc, botLevel);
        };
    }, { frequency: "Always" });
    logger.info("[Andern] PMC Bot Inventory Generator registered");
}
exports.default = registerBotInventoryGenerator;
//# sourceMappingURL=registerBotInventoryGenerator.js.map