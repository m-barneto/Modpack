"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerWavesGenerator(container) {
    const logger = container.resolve("WinstonLogger");
    const staticRouterModService = container.resolve("StaticRouterModService");
    const wavesGenerator = container.resolve("UndaWavesGenerator");
    staticRouterModService.registerStaticRouter("UndaWavesGeneratorUpdate", [
        {
            url: "/client/match/offline/end",
            action: (_url, _info, _sessionId, output) => {
                return new Promise((resolve) => {
                    wavesGenerator.generateWaves();
                    resolve(output);
                });
            },
        },
    ], "spt");
    logger.info("[Unda] Waves generator registered");
}
exports.default = registerWavesGenerator;
//# sourceMappingURL=registerWavesGenerator.js.map