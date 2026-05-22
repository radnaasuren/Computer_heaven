"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export type AuthFormMode = "login" | "register";

type AuthFormProps = {
  mode: AuthFormMode;
  onSuccess?: () => void;
  showModeTabs?: boolean;
  onModeChange?: (mode: AuthFormMode) => void;
  compact?: boolean;
};

export function AuthForm({
  mode,
  onSuccess,
  showModeTabs = false,
  onModeChange,
  compact = false,
}: AuthFormProps) {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(username.trim(), password);
      } else {
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
          displayName: displayName.trim() || undefined,
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn(!compact && "w-full max-w-md")}>
      {showModeTabs && onModeChange ? (
        <div className="mb-6 flex gap-2 rounded-xl bg-[#f4f6fb] p-1.5">
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                onModeChange(tab);
                setError(null);
              }}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
                mode === tab
                  ? "bg-white text-[#2c2f38] shadow-sm"
                  : "text-[#7f8696] hover:text-[#2c2f38]",
              )}
            >
              {tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-username`}>Хэрэглэгчийн нэр</Label>
          <Input
            id={`${mode}-username`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="h-11 rounded-xl border-[#e4e7ef] bg-[#fafbff]"
            required
          />
        </div>

        {mode === "register" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-email`}>И-мэйл</Label>
              <Input
                id={`${mode}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 rounded-xl border-[#e4e7ef] bg-[#fafbff]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-display`}>Нэр (заавал биш)</Label>
              <Input
                id={`${mode}-display`}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 rounded-xl border-[#e4e7ef] bg-[#fafbff]"
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor={`${mode}-password`}>Нууц үг</Label>
          <Input
            id={`${mode}-password`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="h-11 rounded-xl border-[#e4e7ef] bg-[#fafbff]"
            required
            minLength={mode === "register" ? 6 : undefined}
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button
          type="submit"
          disabled={submitting}
          className="h-11 w-full rounded-xl bg-[#2f7df6] text-base hover:bg-[#2568d4]"
        >
          {submitting
            ? "Түр хүлээнэ үү…"
            : mode === "login"
              ? "Нэвтрэх"
              : "Бүртгүүлэх"}
        </Button>
      </form>

      {!showModeTabs ? (
        <p className="mt-4 text-center text-sm text-[#7f8695]">
          {mode === "login" ? (
            <>
              Бүртгэл байхгүй юу?{" "}
              <Link href="/signup" className="font-medium text-[#2f7df6] hover:underline">
                Бүртгүүлэх
              </Link>
            </>
          ) : (
            <>
              Аль хэдийн бүртгэлтэй юу?{" "}
              <Link href="/login" className="font-medium text-[#2f7df6] hover:underline">
                Нэвтрэх
              </Link>
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
