import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PurchaseCreditsDto, CreatePaymentOrderDto } from './dto/payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    getCreditPacks(): Promise<({
        perCreditPrice: string;
        credits: number;
        amount: number;
        label: string;
        id: string;
    } | {
        perCreditPrice: string;
        credits: number;
        amount: number;
        label: string;
        id: string;
    } | {
        perCreditPrice: string;
        credits: number;
        amount: number;
        label: string;
        id: string;
    } | {
        perCreditPrice: string;
        credits: number;
        amount: number;
        label: string;
        id: string;
    })[]>;
    getCreditBalance(req: any): Promise<{
        balance: number;
    }>;
    getTransactionHistory(req: any, page?: number, limit?: number): Promise<{
        transactions: {
            id: string;
            type: import(".prisma/client").$Enums.CreditTransactionType;
            userId: string;
            createdAt: Date;
            description: string;
            amount: number;
            balance: number;
            referenceId: string | null;
            package: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    purchaseCredits(req: any, dto: PurchaseCreditsDto): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        key: string | undefined;
        receipt: string;
        simulated?: undefined;
    } | {
        orderId: string;
        amount: number;
        currency: string;
        key: string;
        receipt: string;
        simulated: boolean;
    }>;
    createOrder(req: any, dto: CreatePaymentOrderDto): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        key: string | undefined;
        receipt: string;
        simulated?: undefined;
    } | {
        orderId: string;
        amount: number;
        currency: string;
        key: string;
        receipt: string;
        simulated: boolean;
    }>;
    verifyPayment(req: any, body: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }): Promise<{
        message: string;
        creditsAdded: number | null;
        paymentId: string;
        creditsToAdd?: undefined;
    } | {
        message: string;
        creditsToAdd: number;
        paymentId: string;
        creditsAdded?: undefined;
    }>;
    handleWebhook(req: RawBodyRequest<Request>, body: any): Promise<{
        status: string;
    }>;
}
