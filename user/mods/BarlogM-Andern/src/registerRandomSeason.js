"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seasonUtils_1 = require("./seasonUtils");
function registerRandomSeason(container) {
    const logger = container.resolve("WinstonLogger");
    const staticRouterModService = container.resolve("StaticRouterModService");
    staticRouterModService.registerStaticRouter("AndernSeasonUpdate", [
        {
            url: "/client/match/offline/end",
            action: (_url, _info, _sessionId, output) => {
                return new Promise((resolve) => {
                    (0, seasonUtils_1.setSeasonRandom)(container);
                    resolve(output);
                });
            },
        },
    ], "spt");
    logger.info("[Andern] Season randomizer registered");
}
exports.default = registerRandomSeason;
//# sourceMappingURL=registerRandomSeason.js.map