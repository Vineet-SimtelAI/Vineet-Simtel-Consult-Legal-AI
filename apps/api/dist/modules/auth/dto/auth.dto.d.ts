export declare class SendOtpDto {
    phone: string;
    purpose?: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
    name?: string;
    email?: string;
}
