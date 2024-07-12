"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const InraidControllerExtension_1 = require("./InraidControllerExtension");
class Mod {
    preSptLoad(container) {
        const logger = container.resolve("WinstonLogger");
        container.register("InraidControllerExtension", InraidControllerExtension_1.InraidControllerExtension);
        container.register("InraidController", { useToken: "InraidControllerExtension" });
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map