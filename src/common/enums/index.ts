export enum Role {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_DISPATCH = 'READY_FOR_DISPATCH',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  DISCORD = 'DISCORD',
}

export enum NotificationTargetType {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum AvailabilityState {
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  SCHEDULED = 'SCHEDULED',
}

// Cancellation window in seconds (2 minutes)
export const CANCELLATION_WINDOW_SECONDS = 120;

// OPay currency
export const DEFAULT_CURRENCY = 'NGN';

// Media storage buckets
export const STORAGE_BUCKETS = {
  VENDOR_LOGOS: 'vendor-logos',
  VENDOR_BANNERS: 'vendor-banners',
  MENU_IMAGES: 'menu-images',
  RECEIPTS: 'receipts',
} as const;
