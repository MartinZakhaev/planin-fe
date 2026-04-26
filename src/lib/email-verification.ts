import { fetcher } from "@/lib/api";
import type { Language } from "@/lib/i18n";

interface SendVerificationOtpInput {
    email: string;
    language?: Language;
}

interface VerifyEmailOtpInput {
    email: string;
    otp: string;
}

interface SendVerificationOtpResponse {
    ok: boolean;
    status: "sent" | "already_verified";
    expiresInSeconds?: number;
}

interface VerifyEmailOtpResponse {
    ok: boolean;
    emailVerified: boolean;
}

export function sendVerificationOtp(input: SendVerificationOtpInput) {
    return fetcher<SendVerificationOtpResponse>("/api/email-verification/send", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export function verifyEmailOtp(input: VerifyEmailOtpInput) {
    return fetcher<VerifyEmailOtpResponse>("/api/email-verification/verify", {
        method: "POST",
        body: JSON.stringify(input),
    });
}
