"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AuthForm, type AuthFormMode } from "@/components/auth/auth-form";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: AuthFormMode;
};

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "login",
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialMode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </DialogTitle>
        </DialogHeader>
        <AuthForm
          mode={initialMode}
          compact
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
