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
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function main() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const prisma = app.get(prisma_service_1.PrismaService);
    console.log('Clearing existing data...');
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderStatusHistory.deleteMany();
    await prisma.paymentAttempt.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    await prisma.vendorHours.deleteMany();
    await prisma.vendor.deleteMany();
    console.log('Loading seed data...');
    const dataPath = path.join(__dirname, 'seed-data.json');
    const vendorsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Seeding ${vendorsData.length} vendors...`);
    for (const vData of vendorsData) {
        const { categories, ...vendorInfo } = vData;
        await prisma.vendor.create({
            data: {
                ...vendorInfo,
                menuCategories: {
                    create: categories.map((cat) => ({
                        name: cat.name,
                        sortOrder: cat.sortOrder,
                        items: {
                            create: cat.items.map((item) => ({
                                name: item.name,
                                description: item.description || '',
                                price: item.price,
                                imageUrl: item.imageUrl,
                                availability: client_1.AvailabilityState.AVAILABLE
                            }))
                        }
                    }))
                }
            }
        });
    }
    console.log('Seeding complete! Vendors and full menus successfully rebuilt.');
    await app.close();
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map