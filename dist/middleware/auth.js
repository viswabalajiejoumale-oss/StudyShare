"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Missing Authorization header" });
            return;
        }
        if (!authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Invalid Authorization format" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (!decoded || typeof decoded.sub !== "string") {
            res.status(401).json({ error: "Invalid token payload" });
            return;
        }
        req.userId = decoded.sub;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.requireAuth = requireAuth;
