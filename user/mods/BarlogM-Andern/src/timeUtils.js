"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNight = exports.getCurrentHour = exports.getCurrentTime = void 0;
function getCurrentTime(weatherGenerator) {
    let result = {
        winterEventEnabled: false,
        acceleration: 0,
        time: "",
        date: "",
        weather: null
    };
    result = weatherGenerator.calculateGameTime(result);
    return result.time;
}
exports.getCurrentTime = getCurrentTime;
function getCurrentHour(currentTime, timeVariant) {
    const [hourStr, minStr, secStr] = currentTime.split(":");
    const hour = parseInt(hourStr);
    if (timeVariant === "PAST") {
        return Math.abs(hour - 12);
    }
    return hour;
}
exports.getCurrentHour = getCurrentHour;
function isNight(currentTime, timeVariant, location) {
    if (location === "factory4_night") {
        return true;
    }
    else if (location === "factory4_day") {
        return false;
    }
    else if (location === "laboratory") {
        return false;
    }
    else {
        const currentHour = getCurrentHour(currentTime, timeVariant);
        if (currentHour >= 22 || currentHour <= 5)
            return true;
        return false;
    }
}
exports.isNight = isNight;
//# sourceMappingURL=timeUtils.js.map