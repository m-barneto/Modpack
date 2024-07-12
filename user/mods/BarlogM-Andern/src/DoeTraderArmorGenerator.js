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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoeTraderArmorGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
let DoeTraderArmorGenerator = class DoeTraderArmorGenerator {
    logger;
    hashUtil;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    KIRASA_N = "5b44d22286f774172b0c9de8";
    allArmor = [this.KIRASA_N];
    constructor(logger, hashUtil) {
        this.logger = logger;
        this.hashUtil = hashUtil;
    }
    getArmor(tpl) {
        switch (tpl) {
            case this.KIRASA_N: {
                return this.kirasaN();
            }
            default: {
                return this.anyOtherArmor(tpl);
            }
        }
    }
    isArmor(tpl) {
        return this.allArmor.includes(tpl);
    }
    anyOtherArmor(tpl) {
        const item = {
            _id: this.hashUtil.generate(),
            _tpl: tpl
        };
        return [item];
    }
    kirasaN() {
        const id = this.hashUtil.generate();
        const armor = [];
        armor.push({
            _id: id,
            _tpl: this.KIRASA_N
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "65704de13e7bba58ea0285c8",
            parentId: id,
            slotId: "Soft_armor_front"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "65705c3c14f2ed6d7d0b7738",
            parentId: id,
            slotId: "Soft_armor_back"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "65705c777260e1139e091408",
            parentId: id,
            "slotId": "Soft_armor_left"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "65705cb314f2ed6d7d0b773c",
            parentId: id,
            "slotId": "soft_armor_right"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "65705cea4916448ae1050897",
            parentId: id,
            "slotId": "Collar"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "656f9d5900d62bcd2e02407c",
            parentId: id,
            slotId: "Front_plate"
        });
        armor.push({
            _id: this.hashUtil.generate(),
            _tpl: "656f9d5900d62bcd2e02407c",
            parentId: id,
            slotId: "Back_plate"
        });
        return armor;
    }
};
exports.DoeTraderArmorGenerator = DoeTraderArmorGenerator;
exports.DoeTraderArmorGenerator = DoeTraderArmorGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object])
], DoeTraderArmorGenerator);
//# sourceMappingURL=DoeTraderArmorGenerator.js.map