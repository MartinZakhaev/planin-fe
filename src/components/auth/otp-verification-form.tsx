"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, MailCheckIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export function OtpVerificationForm() {
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const verificationEmail = "you@example.com";
    const isComplete = otp.every(Boolean);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
        inputRefs.current[index]?.select();
    };

    const updateOtp = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const nextOtp = [...otp];
        nextOtp[index] = digit;
        setOtp(nextOtp);
        setError("");

        if (digit && index < OTP_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (value: string) => {
        const pastedDigits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");

        if (pastedDigits.length === 0) {
            return;
        }

        const nextOtp = Array(OTP_LENGTH)
            .fill("")
            .map((_, index) => pastedDigits[index] ?? "");

        setOtp(nextOtp);
        setError("");
        focusInput(Math.min(pastedDigits.length, OTP_LENGTH) - 1);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            focusInput(index - 1);
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusInput(index - 1);
        }

        if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            event.preventDefault();
            focusInput(index + 1);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isComplete) {
            setError("Enter the 6-digit verification code.");
            focusInput(otp.findIndex((digit) => !digit));
            return;
        }

        setError("");
    };

    return (
        <>
            <div className="flex flex-col space-y-1">
                <div className="mb-2 flex size-11 items-center justify-center rounded-md border bg-background shadow-xs">
                    <MailCheckIcon className="size-5 text-primary" />
                </div>
                <h1 className="font-bold text-2xl tracking-wide">Verify your email</h1>
                <p className="text-base text-muted-foreground">
                    Enter the 6-digit OTP code we sent to{" "}
                    <span className="font-medium text-foreground">{verificationEmail}</span>.
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                    <label className="text-muted-foreground text-xs" htmlFor="otp-0">
                        Verification code
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                aria-label={`OTP digit ${index + 1}`}
                                aria-invalid={!!error}
                                className={cn(
                                    "h-12 w-full rounded-md border border-input bg-background text-center font-mono text-xl shadow-xs outline-none transition-all",
                                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                                    error && "border-destructive ring-[3px] ring-destructive/20"
                                )}
                                onChange={(event) => updateOtp(index, event.target.value)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                                onPaste={(event) => {
                                    event.preventDefault();
                                    handlePaste(event.clipboardData.getData("text"));
                                }}
                            />
                        ))}
                    </div>
                    <FieldError>{error}</FieldError>
                </div>

                <Button className="w-full" type="submit">
                    Verify account
                    <ArrowRightIcon />
                </Button>
            </form>

            <div className="space-y-3 text-center">
                <p className="text-muted-foreground text-sm">
                    Didn&apos;t receive a code?{" "}
                    <button
                        className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                        type="button"
                    >
                        <RotateCcwIcon className="size-3.5" />
                        Resend code
                    </button>
                </p>
                <p className="text-muted-foreground text-xs">
                    Wrong email?{" "}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Back to sign up
                    </Link>
                </p>
            </div>
        </>
    );
}
