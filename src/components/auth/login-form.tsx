"use client";

import { Button } from "@/components/ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { FieldError } from "@/components/ui/field";
import { AtSignIcon, Loader2, LockIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { GoogleIcon } from "./social-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { EmailNotVerifiedError } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            await signIn({ email: data.email, password: data.password, language });
            toast.success("Logged in successfully!");
            router.push("/dashboard");
        } catch (error) {
            if (error instanceof EmailNotVerifiedError) {
                toast.info("Your email is not verified yet. Please use the code we already sent.");
                router.push(`/verify-otp?email=${encodeURIComponent(error.email)}`);
                return;
            }

            toast.error(
                error instanceof Error ? error.message : "Login failed. Please try again."
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
                    Log in to your account
                </h1>
                <p className="text-base text-muted-foreground">
                    Enter your credentials to continue.
                </p>
            </div>

            {/* Social Login */}
            <div className="space-y-2">
                <Button className="w-full" size="lg" type="button">
                    <GoogleIcon />
                    Continue with Google
                </Button>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center justify-center">
                <div className="h-px w-full bg-border" />
                <span className="px-2 text-muted-foreground text-xs">OR</span>
                <div className="h-px w-full bg-border" />
            </div>

            {/* Email/Password Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className="text-start text-muted-foreground text-xs">
                    Enter your email address and password
                </p>
                <div className="space-y-2">
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
                                placeholder="Password"
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
                </div>

                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Log in
                </Button>
            </form>

            {/* Footer Links */}
            <p className="mt-4 text-muted-foreground text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                    Sign up now
                </Link>
            </p>
            <p className="mt-4 text-muted-foreground text-xs text-center">
                By logging in, you agree to our{" "}
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
