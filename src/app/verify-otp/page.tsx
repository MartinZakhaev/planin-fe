import { AuthLayout, OtpVerificationForm } from "@/components/auth";
import { GuestRoute } from "@/components/guest-route";

export default function VerifyOtpPage() {
  return (
    <GuestRoute>
      <AuthLayout>
        <OtpVerificationForm />
      </AuthLayout>
    </GuestRoute>
  );
}
