import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
        retryAfter: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            creditBalance: number;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    googleAuth(body: {
        googleId: string;
        email: string;
        name: string;
        avatarUrl?: string;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            creditBalance: number;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    refreshToken(req: any): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<{
        user: any;
    }>;
}
