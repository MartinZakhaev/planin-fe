import { Suspense } from "react";
import { AuthLayout, OtpVerificationForm } from "@/components/auth";
import { Loader2 } from "lucide-react";

function VerifyOtpFallback() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<VerifyOtpFallback />}>
        <OtpVerificationForm />
      </Suspense>
    </AuthLayout>
  );
}
