export declare class CreateMenuItemDto {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isActive?: boolean;
}
declare const UpdateMenuItemDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateMenuItemDto>>;
export declare class UpdateMenuItemDto extends UpdateMenuItemDto_base {
}
export {};
