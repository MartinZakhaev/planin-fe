import { z } from "zod";

// =============================================================================
// Login Schema
// =============================================================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Email tidak valid"),
    password: z
        .string()
        .min(1, "Kata sandi wajib diisi"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// =============================================================================
// Signup Schema
// =============================================================================

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, "Nama lengkap wajib diisi")
        .min(2, "Nama harus minimal 2 karakter"),
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Email tidak valid"),
    password: z
        .string()
        .min(1, "Kata sandi wajib diisi")
        .min(8, "Kata sandi harus minimal 8 karakter"),
    confirmPassword: z
        .string()
        .min(1, "Konfirmasi kata sandi wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
