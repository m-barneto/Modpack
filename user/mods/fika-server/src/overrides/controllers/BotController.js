"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotControllerOverride = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Override_1 = require("../../di/Override");
const BotController_1 = require("C:/snapshot/project/obj/controllers/BotController");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const FikaDedicatedRaidService_1 = require("../../services/dedicated/FikaDedicatedRaidService");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const FikaMatchService_1 = require("../../services/FikaMatchService");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
let BotControllerOverride = class BotControllerOverride extends Override_1.Override {
    profileHelper;
    botController;
    fikaDedicatedRaidService;
    logger;
    fikaMatchService;
    saveServer;
    constructor(profileHelper, botController, fikaDedicatedRaidService, logger, fikaMatchService, saveServer) {
        super();
        this.profileHelper = profileHelper;
        this.botController = botController;
        this.fikaDedicatedRaidService = fikaDedicatedRaidService;
        this.logger = logger;
        this.fikaMatchService = fikaMatchService;
        this.saveServer = saveServer;
    }
    execute(container) {
        container.afterResolution("BotController", (_t, result) => {
            // Override the bot generate function to determine which profile to use whether we're
            // generating bots for a dedicated client or a normal host.
            result.generate = (sessionId, info) => {
                let pmcProfile;
                const dedicatedSessions = this.fikaDedicatedRaidService.requestedSessions;
                const isDedicated = dedicatedSessions.hasOwnProperty(sessionId);
                if (isDedicated) {
                    // Use the dedicated client requester's PMC profile
                    const dedicatedRequesterSessionId = dedicatedSessions[sessionId];
                    pmcProfile = this.profileHelper.getPmcProfile(dedicatedRequesterSessionId);
                }
                else {
                    // Use the host PMC profile
                    pmcProfile = this.profileHelper.getPmcProfile(sessionId);
                }
                // Get the matchId and then match
                const matchId = this.fikaMatchService.getMatchIdByProfile(sessionId);
                const match = this.fikaMatchService.getMatch(matchId);
                const players = match.players.keys();
                // Loop through all the players and get their profiles
                let level = 1;
                for (const playerId of players) {
                    const player = this.saveServer.getProfile(playerId);
                    if (player.info.password === "fika-dedicated")
                        continue;
                    if (player.characters.pmc.Info.Level > level)
                        level = player.characters.pmc.Info.Level;
                }
                const originalLevel = pmcProfile.Info.Level;
                pmcProfile.Info.Level = level;
                // If there's more than 1 condition, this is the first time client has requested bots
                // Client sends every bot type it will need in raid
                // Use this opportunity to create and cache bots for later retreval
                const isFirstGen = info.conditions.length > 1;
                let result;
                if (isFirstGen) {
                    // Temporary cast to remove the error caused by protected method.
                    result = this.botController.generateBotsFirstTime(info, pmcProfile, sessionId);
                }
                // Temporary cast to remove the error caused by protected method.
                result = this.botController.returnSingleBotFromCache(sessionId, info);
                // Set back the original level
                //pmcProfile.Info.Level = originalLevel;
                pmcProfile.Info.Level = originalLevel;
                return result;
            };
        }, { frequency: "Always" });
    }
};
exports.BotControllerOverride = BotControllerOverride;
exports.BotControllerOverride = BotControllerOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(1, (0, tsyringe_1.inject)("BotController")),
    __param(2, (0, tsyringe_1.inject)("FikaDedicatedRaidService")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(4, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(5, (0, tsyringe_1.inject)("SaveServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _a : Object, typeof (_b = typeof BotController_1.BotController !== "undefined" && BotController_1.BotController) === "function" ? _b : Object, typeof (_c = typeof FikaDedicatedRaidService_1.FikaDedicatedRaidService !== "undefined" && FikaDedicatedRaidService_1.FikaDedicatedRaidService) === "function" ? _c : Object, typeof (_d = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _d : Object, typeof (_e = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _e : Object, typeof (_f = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _f : Object])
], BotControllerOverride);
//# sourceMappingURL=BotController.js.map