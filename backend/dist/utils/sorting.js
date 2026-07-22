"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortingOptions = void 0;
const getSortingOptions = (req, defaultSortField = 'createdAt', defaultSortOrder = 'desc') => {
    const sortBy = req.query.sortBy || defaultSortField;
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : defaultSortOrder;
    return {
        [sortBy]: sortOrder,
    };
};
exports.getSortingOptions = getSortingOptions;
