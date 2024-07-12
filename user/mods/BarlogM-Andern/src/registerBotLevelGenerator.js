"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../config/config.json"));
function registerBotLevelGenerator(container) {
    const logger = container.resolve("WinstonLogger");
    const botLevelGenerator = container.resolve("BotLevelGenerator");
    const profileHelper = container.resolve("ProfileHelper");
    const randomUtil = container.resolve("RandomUtil");
    container.afterResolution("BotLevelGenerator", (_t, result) => {
        result.generateBotLevel = (levelDetails, botGenerationDetails, bot) => {
            if (!botGenerationDetails.isPmc)
                return botLevelGenerator.generateBotLevel(levelDetails, botGenerationDetails, bot);
            const { playerLevel } = botGenerationDetails;
            let level = 1;
            if (config.useFixedPmcBotLevelRange) {
                const min = config.pmcBotMinLevel <= 0 ? 1 : config.pmcBotMinLevel;
                const max = config.pmcBotMaxLevel >= 71
                    ? 71
                    : config.pmcBotMaxLevel;
                level = randomUtil.getInt(min, max);
            }
            else {
                const downDelta = config.pmcBotLevelDownDelta;
                const upDelta = config.pmcBotLevelUpDelta;
                const min = playerLevel - downDelta <= 0
                    ? 1
                    : playerLevel - downDelta;
                const max = playerLevel + upDelta >= 71
                    ? 71
                    : playerLevel + upDelta;
                level = randomUtil.getInt(min, max);
            }
            const res = {
                level,
                exp: profileHelper.getExperience(level),
            };
            if (config.debug)
                logger.info(`[Andern] generated pmc ${JSON.stringify(res)}`);
            return res;
        };
    }, { frequency: "Always" });
    logger.info("[Andern] PMC Bot Level Generator registered");
}
exports.default = registerBotLevelGenerator;
//# sourceMappingURL=registerBotLevelGenerator.js.map