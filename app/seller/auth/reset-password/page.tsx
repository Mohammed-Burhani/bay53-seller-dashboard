"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/seller/ui/Input";
import { Button } from "@/components/seller/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-gray-900">Fast Tools</h1>
          </Link>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="space-y-1 pb-6">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
            <p className="text-sm text-gray-600">Enter your new password</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  error={form.formState.errors.password?.message}
                  className="h-11 bg-blue-50 border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("password")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  error={form.formState.errors.confirmPassword?.message}
                  className="h-11 bg-blue-50 border-blue-100 focus:border-blue-500 focus:ring-blue-500"
                  {...form.register("confirmPassword")}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/seller/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
