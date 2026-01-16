import { AuthLayout, SignupForm } from "@/components/auth";
import { GuestRoute } from "@/components/guest-route";

export default function SignupPage() {
  return (
    <GuestRoute>
      <AuthLayout>
        <SignupForm />
      </AuthLayout>
    </GuestRoute>
  );
}
