"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationData = exports.getPaginationOptions = void 0;
const getPaginationOptions = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return { skip, take: limit, page, limit };
};
exports.getPaginationOptions = getPaginationOptions;
const getPaginationData = (totalItems, page, limit) => {
    return {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
    };
};
exports.getPaginationData = getPaginationData;
