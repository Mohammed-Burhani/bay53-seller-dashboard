"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/seller/ui/Input";
import { Button } from "@/components/seller/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Min 8 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = () => {
    document.cookie = "seller_session=mock; path=/";
    window.location.href = "/seller/dashboard";
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Fast Tools</h1>
            <p className="text-sm text-text-secondary">Sign in to your seller account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded border-border" /> Remember me
            </label>
            <Button type="submit" className="w-full">Sign in to your seller account</Button>
          </form>
          <p className="text-sm text-text-secondary">
            New seller? <Link href="/seller/auth/register" className="text-primary hover:underline">Start selling →</Link>
          </p>
        </div>
      </div>
      <div className="hidden w-1/3 bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <h2 className="text-xl font-semibold">Sell on Fast Tools</h2>
        <ul className="mt-4 space-y-2 text-sm opacity-90">
          <li>8% commission on most categories</li>
          <li>Weekly payouts</li>
          <li>9 product categories</li>
        </ul>
      </div>
    </div>
  );
}
