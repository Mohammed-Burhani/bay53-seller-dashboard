
"use client";

import Link from "next/link";
import { SellerLoginForm } from "@/components/seller/auth/SellerLoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-gray-900">Fast Tools</h1>
            </Link>
          </div>
          <SellerLoginForm />
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-linear-to-br from-blue-600 to-blue-700 p-12 text-white flex-col justify-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">Sell on Fast Tools</h2>
          <ul className="space-y-4 text-base">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>8% commission on most categories</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Weekly payouts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>9 product categories</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

