"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUser = exports.suspendUser = exports.listUsers = void 0;
const userService_1 = require("../services/userService");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const response_1 = require("../utils/response");
const pagination_1 = require("../utils/pagination");
exports.listUsers = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { skip, take } = (0, pagination_1.getPaginationOptions)(req);
    const { users, pagination } = await userService_1.userService.listUsers(skip, take);
    res.json((0, response_1.formatResponse)(true, 'Users fetched successfully', users, null, pagination));
});
exports.suspendUser = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await userService_1.userService.suspendUser(id);
    res.json((0, response_1.formatResponse)(true, 'User suspended successfully'));
});
exports.activateUser = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    await userService_1.userService.activateUser(id);
    res.json((0, response_1.formatResponse)(true, 'User activated successfully'));
});
