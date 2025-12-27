import { AuthPage } from "@/components/auth-page";
import { GuestRoute } from "@/components/guest-route";

export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthPage />
    </GuestRoute>
  );
}
