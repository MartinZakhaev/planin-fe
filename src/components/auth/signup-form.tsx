"use client";

import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { FieldError } from "@/components/ui/field";
import { AtSignIcon, Loader2, LockIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { GoogleIcon } from "./social-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { ApiError } from "@/lib/api";
import { sendVerificationOtp } from "@/lib/email-verification";
import { useLanguage } from "@/context/language-context";

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);

        try {
            await signUp({ name: data.name, email: data.email, password: data.password, language });
            toast.success("Account created. We sent a verification code to your email.");
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            const isExistingAccount = /already|exist|duplicate/i.test(message);

            if (isExistingAccount) {
                try {
                    const response = await sendVerificationOtp({ email: data.email, language });

                    if (response.status === "already_verified") {
                        toast.info("An account with this email already exists. Please log in.");
                        router.push("/login");
                        return;
                    }

                    toast.success("We sent a new verification code to your email.");
                    router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
                    return;
                } catch (resendError) {
                    if (resendError instanceof ApiError && resendError.status === 429) {
                        toast.info("A verification code was already sent. Please check your email.");
                        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
                        return;
                    }
                }
            }

            toast.error(
                message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col space-y-1">
                <h1 className="font-bold text-2xl tracking-wide">
                    Create a new account
                </h1>
                <p className="text-base text-muted-foreground">
                    Fill out the form below to create your account.
                </p>
            </div>

            {/* Social Login */}
            <div className="space-y-2">
                <Button className="w-full" size="lg" type="button">
                    <GoogleIcon />
                    Sign up with Google
                </Button>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center justify-center">
                <div className="h-px w-full bg-border" />
                <span className="px-2 text-muted-foreground text-xs">OR</span>
                <div className="h-px w-full bg-border" />
            </div>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className="text-start text-muted-foreground text-xs">
                    Enter your details to create an account
                </p>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Full name"
                                type="text"
                                {...register("name")}
                                aria-invalid={!!errors.name}
                                disabled={isLoading}
                            />
                            <InputGroupAddon>
                                <UserIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.name?.message}</FieldError>
                    </div>
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="you@example.com"
                                type="email"
                                {...register("email")}
                                aria-invalid={!!errors.email}
                                disabled={isLoading}
                            />
                            <InputGroupAddon>
                                <AtSignIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.email?.message}</FieldError>
                    </div>
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Password (min. 8 characters)"
                                type="password"
                                {...register("password")}
                                aria-invalid={!!errors.password}
                                disabled={isLoading}
                            />
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.password?.message}</FieldError>
                    </div>
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Confirm password"
                                type="password"
                                {...register("confirmPassword")}
                                aria-invalid={!!errors.confirmPassword}
                                disabled={isLoading}
                            />
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.confirmPassword?.message}</FieldError>
                    </div>
                </div>

                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Create account
                </Button>
            </form>

            {/* Footer Links */}
            <p className="mt-4 text-muted-foreground text-sm text-center">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Log in
                </Link>
            </p>
            <p className="mt-4 text-muted-foreground text-xs text-center">
                By signing up, you agree to our{" "}
                <a
                    className="underline underline-offset-4 hover:text-primary"
                    href="#"
                >
                    Terms of Service
                </a>{" "}
                and{" "}
                <a
                    className="underline underline-offset-4 hover:text-primary"
                    href="#"
                >
                    Privacy Policy
                </a>
                .
            </p>
        </>
    );
}
