"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = void 0;
const formatResponse = (success, message, data = null, errors = null, pagination) => {
    const response = {
        success,
        message,
        data,
    };
    if (errors) {
        response.errors = errors;
    }
    if (pagination) {
        response.pagination = pagination;
    }
    return response;
};
exports.formatResponse = formatResponse;
