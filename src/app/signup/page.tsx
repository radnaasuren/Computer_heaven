"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/contexts/auth-context";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const next = searchParams.get("next") || "/basket";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#7f8695]">
        Ачаалж байна…
      </div>
    );
  }

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  if (user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#7f8695]">
        Нэвтэрсэн…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#2c2f38]">Бүртгүүлэх</h1>
        <p className="mt-2 text-sm text-[#7f8695]">
          Шинэ бүртгэл үүсгээд PC угсралт хадгалж, захиална.
        </p>
      </div>

      <div className="rounded-[18px] border border-[#ececf2] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <AuthForm mode="register" onSuccess={() => router.push(next)} />
      </div>

      <p className="mt-6 text-center text-sm text-[#9aa1af]">
        <Link href="/" className="hover:text-[#2f7df6] hover:underline">
          ← Нүүр хуудас
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-[#7f8695]">Ачаалж байна…</div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
