import { LoginForm } from "@/components/auth/login-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-background font-body flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center flex flex-col items-center gap-2">
            <img
              src="/AssetLogix-logo.png"
              alt="AssetLogix Logo"
              className="w-20 h-20 rounded-full shadow-lg border-2 border-primary object-cover mb-2"
              draggable="false"
            />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
