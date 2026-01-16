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

export function SignupForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

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
            await signUp({ name: data.name, email: data.email, password: data.password });
            toast.success("Akun berhasil dibuat!");
            router.push("/dashboard");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Pendaftaran gagal. Silakan coba lagi."
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
                    Buat Akun Baru
                </h1>
                <p className="text-base text-muted-foreground">
                    Isi formulir di bawah ini untuk membuat akun Anda.
                </p>
            </div>

            {/* Social Login */}
            <div className="space-y-2">
                <Button className="w-full" size="lg" type="button">
                    <GoogleIcon />
                    Daftar dengan Google
                </Button>
            </div>

            {/* Divider */}
            <div className="flex w-full items-center justify-center">
                <div className="h-px w-full bg-border" />
                <span className="px-2 text-muted-foreground text-xs">ATAU</span>
                <div className="h-px w-full bg-border" />
            </div>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className="text-start text-muted-foreground text-xs">
                    Masukkan detail Anda untuk membuat akun
                </p>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                placeholder="Nama Lengkap"
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
                                placeholder="your.email@example.com"
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
                                placeholder="Kata Sandi (min. 8 karakter)"
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
                                placeholder="Konfirmasi Kata Sandi"
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
                    Buat Akun
                </Button>
            </form>

            {/* Footer Links */}
            <p className="mt-4 text-muted-foreground text-sm text-center">
                Sudah punya akun?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Masuk
                </Link>
            </p>
            <p className="mt-4 text-muted-foreground text-xs text-center">
                Dengan mendaftar, Anda menyetujui{" "}
                <a
                    className="underline underline-offset-4 hover:text-primary"
                    href="#"
                >
                    Ketentuan Layanan
                </a>{" "}
                dan{" "}
                <a
                    className="underline underline-offset-4 hover:text-primary"
                    href="#"
                >
                    Kebijakan Privasi
                </a>
                .
            </p>
        </>
    );
}
