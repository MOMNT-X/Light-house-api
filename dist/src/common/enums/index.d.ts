export declare enum Role {
    CUSTOMER = "CUSTOMER",
    VENDOR = "VENDOR",
    ADMIN = "ADMIN"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PAYMENT_PENDING = "PAYMENT_PENDING",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    READY_FOR_DISPATCH = "READY_FOR_DISPATCH",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare enum NotificationChannel {
    IN_APP = "IN_APP",
    EMAIL = "EMAIL",
    DISCORD = "DISCORD"
}
export declare enum NotificationTargetType {
    USER = "USER",
    VENDOR = "VENDOR",
    ADMIN = "ADMIN"
}
export declare enum AvailabilityState {
    AVAILABLE = "AVAILABLE",
    SOLD_OUT = "SOLD_OUT",
    SCHEDULED = "SCHEDULED"
}
export declare const CANCELLATION_WINDOW_SECONDS = 120;
export declare const DEFAULT_CURRENCY = "NGN";
export declare const STORAGE_BUCKETS: {
    readonly VENDOR_LOGOS: "vendor-logos";
    readonly VENDOR_BANNERS: "vendor-banners";
    readonly MENU_IMAGES: "menu-images";
    readonly RECEIPTS: "receipts";
};
