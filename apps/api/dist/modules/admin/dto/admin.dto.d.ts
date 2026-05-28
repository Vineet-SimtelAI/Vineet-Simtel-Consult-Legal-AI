export declare class AdminUpdateUserDto {
    role?: string;
    banReason?: string;
}
export declare class AdminLawyerActionDto {
    action: 'approve' | 'reject';
    reason?: string;
}
