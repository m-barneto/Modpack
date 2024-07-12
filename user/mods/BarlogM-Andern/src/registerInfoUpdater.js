"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeUtils_1 = require("./timeUtils");
function registerInfoUpdater(container) {
    const logger = container.resolve("WinstonLogger");
    const staticRouterModService = container.resolve("StaticRouterModService");
    const weatherGenerator = container.resolve("WeatherGenerator");
    const raidInfo = container.resolve("AndernRaidInfo");
    staticRouterModService.registerStaticRouter("AndernRaidInfoUpdater", [
        {
            url: "/client/raid/configuration",
            action: (_url, info, _sessionId, output) => {
                return new Promise(resolve => {
                    raidInfo.location = info.location.toLowerCase();
                    raidInfo.currentTime = (0, timeUtils_1.getCurrentTime)(weatherGenerator);
                    raidInfo.timeVariant = info.timeVariant;
                    raidInfo.isNight = (0, timeUtils_1.isNight)(raidInfo.currentTime, raidInfo.timeVariant, raidInfo.location);
                    logger.info(`[Andern] raid info ${JSON.stringify(raidInfo)}`);
                    resolve(output);
                });
            },
        },
    ], "spt");
    logger.info("[Andern] Map Info updater registered");
}
exports.default = registerInfoUpdater;
//# sourceMappingURL=registerInfoUpdater.js.map