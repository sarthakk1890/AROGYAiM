"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteringOptions = void 0;
const getFilteringOptions = (req, allowedFields) => {
    const filter = {};
    Object.keys(req.query).forEach((key) => {
        if (allowedFields.includes(key)) {
            // Basic support for exact match, can be extended for complex operators
            filter[key] = req.query[key];
        }
    });
    return filter;
};
exports.getFilteringOptions = getFilteringOptions;
