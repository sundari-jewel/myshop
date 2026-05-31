import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerAuthForm } from "@/components/auth/customer-auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Create Account",
  description: "Create a Sundari account to save wishlist pieces, cart items, and checkout details.",
  path: "/signup",
});

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <CustomerAuthForm mode="signup" />
    </Suspense>
  );
}
