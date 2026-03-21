export declare class CreateVendorDto {
    name: string;
    slug: string;
    description: string;
    category: string;
    logoUrl?: string;
    bannerUrl?: string;
    isActive?: boolean;
    isOpen?: boolean;
    deliveryFee?: number;
    minOrder?: number;
    deliveryRadius?: number;
    latitude?: number;
    longitude?: number;
}
declare const UpdateVendorDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateVendorDto>>;
export declare class UpdateVendorDto extends UpdateVendorDto_base {
}
export {};
