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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaRaidController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaMatchEndSessionMessages_1 = require("../models/enums/FikaMatchEndSessionMessages");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaDedicatedRaidService_1 = require("../services/dedicated/FikaDedicatedRaidService");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const FikaDedicatedRaidWebSocket_1 = require("../websockets/FikaDedicatedRaidWebSocket");
let FikaRaidController = class FikaRaidController {
    fikaMatchService;
    fikaDedicatedRaidService;
    fikaDedicatedRaidWebSocket;
    logger;
    constructor(fikaMatchService, fikaDedicatedRaidService, fikaDedicatedRaidWebSocket, logger) {
        this.fikaMatchService = fikaMatchService;
        this.fikaDedicatedRaidService = fikaDedicatedRaidService;
        this.fikaDedicatedRaidWebSocket = fikaDedicatedRaidWebSocket;
        this.logger = logger;
        // empty
    }
    /**
     * Handle /fika/raid/create
     * @param request
     */
    handleRaidCreate(request) {
        return {
            success: this.fikaMatchService.createMatch(request),
        };
    }
    /**
     * Handle /fika/raid/join
     * @param request
     */
    handleRaidJoin(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            expectedNumberOfPlayers: match.expectedNumberOfPlayers,
            gameVersion: match.gameVersion,
            fikaVersion: match.fikaVersion,
            raidCode: match.raidCode,
        };
    }
    /**
     * Handle /fika/raid/leave
     * @param request
     */
    handleRaidLeave(request) {
        if (request.serverId === request.profileId) {
            this.fikaMatchService.endMatch(request.serverId, FikaMatchEndSessionMessages_1.FikaMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }
        this.fikaMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }
    /**
     * Handle /fika/raid/gethost
     * @param request
     */
    handleRaidGetHost(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            ips: match.ips,
            port: match.port,
            natPunch: match.natPunch,
            isDedicated: match.isDedicated,
        };
    }
    /**
     * Handle /fika/raid/getsettings
     * @param request
     */
    handleRaidGetSettings(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            metabolismDisabled: match.raidConfig.metabolismDisabled,
            playersSpawnPlace: match.raidConfig.playersSpawnPlace,
        };
    }
    /** Handle /fika/raid/dedicated/start */
    handleRaidStartDedicated(sessionID, info) {
        if (!this.fikaDedicatedRaidService.isDedicatedClientAvailable()) {
            return {
                matchId: null,
                error: "No dedicated clients available.",
            };
        }
        if (sessionID in this.fikaDedicatedRaidService.dedicatedClients) {
            return {
                matchId: null,
                error: "A dedicated client is trying to use a dedicated client?",
            };
        }
        let dedicatedClient = undefined;
        let dedicatedClientWs = undefined;
        for (const dedicatedSessionId in this.fikaDedicatedRaidService.dedicatedClients) {
            const dedicatedClientInfo = this.fikaDedicatedRaidService.dedicatedClients[dedicatedSessionId];
            if (dedicatedClientInfo.state != "ready") {
                continue;
            }
            dedicatedClientWs = this.fikaDedicatedRaidWebSocket.clientWebSockets[dedicatedSessionId];
            if (!dedicatedClientWs) {
                continue;
            }
            dedicatedClient = dedicatedSessionId;
            break;
        }
        if (!dedicatedClient) {
            return {
                matchId: null,
                error: "No dedicated clients available at this time",
            };
        }
        this.fikaDedicatedRaidService.requestedSessions[dedicatedClient] = sessionID;
        dedicatedClientWs.send(JSON.stringify({
            type: "fikaDedicatedStartRaid",
            ...info,
        }));
        this.logger.info(`Sent WS to ${dedicatedClient}`);
        return {
            // This really isn't required, I just want to make sure on the client
            matchId: dedicatedClient,
            error: null,
        };
    }
    /** Handle /fika/raid/dedicated/status */
    handleRaidStatusDedicated(sessionId, info) {
        if (info.status == "ready" && !this.fikaDedicatedRaidService.isDedicatedClientAvailable()) {
            if (this.fikaDedicatedRaidService.onDedicatedClientAvailable) {
                this.fikaDedicatedRaidService.onDedicatedClientAvailable();
            }
        }
        this.fikaDedicatedRaidService.dedicatedClients[sessionId] = {
            state: info.status,
            lastPing: Date.now(),
        };
        return {
            sessionId: info.sessionId,
            status: info.status,
        };
    }
    /** Handle /fika/raid/dedicated/getstatus */
    handleRaidGetStatusDedicated() {
        if (!this.fikaDedicatedRaidService.isDedicatedClientAvailable()) {
            return {
                available: false
            };
        }
        else {
            return {
                available: true
            };
        }
    }
};
exports.FikaRaidController = FikaRaidController;
exports.FikaRaidController = FikaRaidController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(1, (0, tsyringe_1.inject)("FikaDedicatedRaidService")),
    __param(2, (0, tsyringe_1.inject)("FikaDedicatedRaidWebSocket")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object, typeof (_b = typeof FikaDedicatedRaidService_1.FikaDedicatedRaidService !== "undefined" && FikaDedicatedRaidService_1.FikaDedicatedRaidService) === "function" ? _b : Object, typeof (_c = typeof FikaDedicatedRaidWebSocket_1.FikaDedicatedRaidWebSocket !== "undefined" && FikaDedicatedRaidWebSocket_1.FikaDedicatedRaidWebSocket) === "function" ? _c : Object, typeof (_d = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _d : Object])
], FikaRaidController);
//# sourceMappingURL=FikaRaidController.js.map