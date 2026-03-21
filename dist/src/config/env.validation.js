"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    PORT: Joi.number().default(3001),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    DATABASE_URL: Joi.string().required(),
    DIRECT_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
    REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
    REDIS_URL: Joi.string().required(),
    OPAY_MERCHANT_ID: Joi.string().required(),
    OPAY_PUBLIC_KEY: Joi.string().required(),
    OPAY_PRIVATE_KEY: Joi.string().required(),
    OPAY_WEBHOOK_SECRET: Joi.string().required(),
    OPAY_BASE_URL: Joi.string().uri().default('https://cashier.opayweb.com/api/v1'),
    DISCORD_WEBHOOK_URL: Joi.string().uri().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().default(465),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    EMAIL_FROM: Joi.string().required(),
    SUPABASE_URL: Joi.string().uri().required(),
    SUPABASE_SERVICE_KEY: Joi.string().required(),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
    ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),
    THROTTLE_TTL: Joi.number().default(60),
    THROTTLE_LIMIT: Joi.number().default(60),
    AUTH_THROTTLE_LIMIT: Joi.number().default(5),
    ENABLE_DELIVERY_ZONE_CHECK: Joi.boolean().default(true),
    SERVICE_CHARGE_PERCENT: Joi.number().default(2.5),
});
//# sourceMappingURL=env.validation.js.map