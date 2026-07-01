"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SellerRegistrationForm } from "@/components/seller/auth/SellerRegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Fast Tools</h1>
            <p className="text-sm text-text-secondary">Seller Registration</p>
          </div>
          <Link
            href="/seller/auth/login"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Start Selling on Fast Tools</h2>
          <p className="mt-1 text-text-secondary">
            Join thousands of sellers across India. Complete the registration process to get started.
          </p>
        </div>

        <SellerRegistrationForm />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Low Commission</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Pay only 8% commission on most categories
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Weekly Payouts</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Get paid directly to your bank account every week
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Seller Support</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Dedicated support team to help you succeed
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-6 text-xs text-text-muted">
            <p>© 2024 Fast Tools. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
