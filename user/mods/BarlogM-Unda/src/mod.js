"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unda = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const WavesGenerator_1 = require("./WavesGenerator");
const registerWavesGenerator_1 = __importDefault(require("./registerWavesGenerator"));
class Unda {
    constructor() {
    }
    preSptLoad(container) {
        container.register("UndaWavesGenerator", WavesGenerator_1.WavesGenerator, {
            lifecycle: tsyringe_1.Lifecycle.Singleton,
        });
        (0, registerWavesGenerator_1.default)(container);
    }
    postSptLoad(container) {
        const wavesGenerator = container.resolve("UndaWavesGenerator");
        wavesGenerator.fillInitialData();
        wavesGenerator.generateWaves();
    }
}
exports.Unda = Unda;
module.exports = { mod: new Unda() };
//# sourceMappingURL=mod.js.map