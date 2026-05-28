import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/database/prisma/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { QueueService } from '../../core/queue/queue.service';
import { CreatePaymentOrderDto } from './dto/payment.dto';
export declare class PaymentsService {
    private prisma;
    private redisService;
    private configService;
    private queueService;
    private readonly logger;
    private razorpay;
    constructor(prisma: PrismaService, redisService: RedisService, configService: ConfigService, queueService: QueueService);
    getCreditPackages(): ({
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
    })[];
    createOrder(userId: string, dto: CreatePaymentOrderDto): Promise<{
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
    verifyPayment(userId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
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
    handleWebhook(body: any, signature: string): Promise<{
        status: string;
    }>;
    purchaseCredits(userId: string, packageName: string): Promise<{
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
    getCreditBalance(userId: string): Promise<{
        balance: number;
    }>;
    getTransactionHistory(userId: string, page?: number, limit?: number): Promise<{
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
    private addCredits;
}
