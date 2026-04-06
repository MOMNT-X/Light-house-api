import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

  // Redis
  REDIS_URL: Joi.string().required(),

  // Paystack
  PAYSTACK_SECRET_KEY: Joi.string().required(),
  PAYSTACK_PUBLIC_KEY: Joi.string().required(),
  PAYSTACK_WEBHOOK_SECRET: Joi.string().optional().allow(''),

  // OPay Cashier (optional — leave blank to disable OPay as a payment option)
  OPAY_MERCHANT_ID: Joi.string().optional().allow(''),
  OPAY_PRIVATE_KEY: Joi.string().optional().allow(''),
  OPAY_PUBLIC_KEY: Joi.string().optional().allow(''),

  // Discord
  DISCORD_WEBHOOK_URL: Joi.string().uri().required(),

  // Email
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(465),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),

  // Supabase Storage
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),

  // Frontend
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),

  // Rate limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(60),
  AUTH_THROTTLE_LIMIT: Joi.number().default(5),

  // Feature flags
  ENABLE_DELIVERY_ZONE_CHECK: Joi.boolean().default(true),
  SERVICE_CHARGE_PERCENT: Joi.number().default(2.5),
});
