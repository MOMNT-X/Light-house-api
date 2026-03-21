export declare class CreateAddressDto {
    label: string;
    street: string;
    city: string;
    state: string;
    landmark?: string;
    deliveryInstructions?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
}
declare const UpdateAddressDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAddressDto>>;
export declare class UpdateAddressDto extends UpdateAddressDto_base {
}
export {};
