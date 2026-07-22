"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = exports.getEndOfDay = exports.getStartOfDay = void 0;
const getStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
exports.getStartOfDay = getStartOfDay;
const getEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
};
exports.getEndOfDay = getEndOfDay;
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
