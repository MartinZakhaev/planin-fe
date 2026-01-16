import { AuthLayout, LoginForm } from "@/components/auth";
import { GuestRoute } from "@/components/guest-route";

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </GuestRoute>
  );
}
