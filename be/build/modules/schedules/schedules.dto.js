"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchedulePayloadSchema = exports.CreateSchedulePayloadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateSchedulePayloadSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    start: joi_1.default.date().required(),
    end: joi_1.default.date().allow('').default(null),
    desc: joi_1.default.string().allow('').default(null)
});
exports.UpdateSchedulePayloadSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    _id: joi_1.default.string(),
    name: joi_1.default.string(),
    start: joi_1.default.date(),
    end: joi_1.default.date().allow('').default(null),
    desc: joi_1.default.string().allow('').default(null)
});
//# sourceMappingURL=schedules.dto.js.map