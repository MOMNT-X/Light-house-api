"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_BUCKETS = exports.DEFAULT_CURRENCY = exports.CANCELLATION_WINDOW_SECONDS = exports.AvailabilityState = exports.NotificationTargetType = exports.NotificationChannel = exports.PaymentStatus = exports.OrderStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["CUSTOMER"] = "CUSTOMER";
    Role["VENDOR"] = "VENDOR";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY_FOR_DISPATCH"] = "READY_FOR_DISPATCH";
    OrderStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["DISCORD"] = "DISCORD";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationTargetType;
(function (NotificationTargetType) {
    NotificationTargetType["USER"] = "USER";
    NotificationTargetType["VENDOR"] = "VENDOR";
    NotificationTargetType["ADMIN"] = "ADMIN";
})(NotificationTargetType || (exports.NotificationTargetType = NotificationTargetType = {}));
var AvailabilityState;
(function (AvailabilityState) {
    AvailabilityState["AVAILABLE"] = "AVAILABLE";
    AvailabilityState["SOLD_OUT"] = "SOLD_OUT";
    AvailabilityState["SCHEDULED"] = "SCHEDULED";
})(AvailabilityState || (exports.AvailabilityState = AvailabilityState = {}));
exports.CANCELLATION_WINDOW_SECONDS = 120;
exports.DEFAULT_CURRENCY = 'NGN';
exports.STORAGE_BUCKETS = {
    VENDOR_LOGOS: 'vendor-logos',
    VENDOR_BANNERS: 'vendor-banners',
    MENU_IMAGES: 'menu-images',
    RECEIPTS: 'receipts',
};
//# sourceMappingURL=index.js.map