"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByVendor(vendorId) {
        return this.prisma.menuItem.findMany({
            where: { category: { vendorId }, deletedAt: null },
            orderBy: { categoryId: 'asc' },
            include: { category: true },
        });
    }
    async getCategoriesWithItems(vendorId) {
        const items = await this.findAllByVendor(vendorId);
        const grouped = items.reduce((acc, item) => {
            const catName = item.category?.name || 'Uncategorized';
            if (!acc[catName])
                acc[catName] = [];
            acc[catName].push(item);
            return acc;
        }, {});
        return Object.keys(grouped).map(category => ({
            name: category,
            items: grouped[category],
        }));
    }
    async findOne(id) {
        const item = await this.prisma.menuItem.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException(`Menu item not found`);
        }
        return item;
    }
    async create(data) {
        return this.prisma.menuItem.create({ data });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.menuItem.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.menuItem.update({
            where: { id },
            data: { deletedAt: new Date(), availability: 'SOLD_OUT' },
        });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map