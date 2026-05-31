import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomerAuthForm } from "@/components/auth/customer-auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign In",
  description: "Sign in to your Sundari account to manage your cart, wishlist, and checkout.",
  path: "/signin",
});

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <CustomerAuthForm mode="signin" />
    </Suspense>
  );
}
