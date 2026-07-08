import Link from "next/link";
import { Button } from "@/components/seller/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/seller/ui/Card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
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
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-semibold">Authentication Error</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              We encountered an error during authentication. This could be due to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>An expired or invalid link</li>
              <li>An incorrect email confirmation code</li>
              <li>A network connectivity issue</li>
            </ul>
            <div className="pt-4 space-y-2">
              <Link href="/seller/auth/login" className="block">
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                  Back to Login
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="secondary" className="w-full h-11">
                  Go to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
