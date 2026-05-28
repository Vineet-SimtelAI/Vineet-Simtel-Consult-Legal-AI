export declare class PurchaseCreditsDto {
    package: string;
}
export declare class CreatePaymentOrderDto {
    amount: number;
    purpose: string;
    purposeId?: string;
    creditsToAdd?: number;
    packageName?: string;
}
