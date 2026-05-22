"use client";

import { LogOut, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import { useBasket } from "@/contexts/basket-context";

const Header = () => {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { itemCount: basketCount } = useBasket();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Нүүр" },
    { href: "/survey", label: "Судалгаа" },
    { href: "/build", label: "PC угсралт" },
    { href: "/prebuilt", label: "Бэлэн компьютер" },
    { href: "/benchmark", label: "Бенчмарк" },
    { href: "/basket", label: "Сагс" },
    { href: "/orders", label: "Захиалга" },
  ];

  return (
    <header className="relative mb-[18px] flex items-center justify-center rounded-[18px] border border-[#ececf2] bg-[#f7f7fb] px-7 py-[22px]">
      <nav className="flex flex-wrap justify-center gap-6 text-base md:gap-8 md:text-lg">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname === href
                ? "font-semibold text-[#2d3445]"
                : "text-[#707684] transition-colors hover:text-[#2d3445]"
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="absolute right-7 flex items-center gap-[18px] text-[#495160]">
        <button
          type="button"
          className="rounded-md p-1 hover:bg-black/5"
          aria-label="Хайх"
        >
          <Search className="size-[22px]" strokeWidth={2} />
        </button>

        <Link
          href="/basket"
          className="relative rounded-md p-1 hover:bg-black/5"
          aria-label="Сагс"
        >
          <ShoppingCart className="size-[22px]" strokeWidth={2} />
          {basketCount > 0 ? (
            <span className="absolute -right-2.5 -top-2 flex size-4 min-w-4 items-center justify-center rounded-full bg-[#2bc66a] px-0.5 text-[11px] font-medium text-white">
              {basketCount > 99 ? "99+" : basketCount}
            </span>
          ) : null}
        </Link>

        {loading ? (
          <span className="text-sm text-[#9aa1af]">…</span>
        ) : user ? (
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium hover:bg-black/5"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-label="Хэрэглэгчийн цэс"
            >
              <User className="size-[22px]" strokeWidth={1.75} />
              <span className="hidden max-w-[100px] truncate sm:inline">
                {user.displayName || user.username}
              </span>
            </button>
            {userMenuOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-label="Цэс хаах"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-[#ececf2] bg-white py-1 shadow-lg">
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-[#2c2f38] hover:bg-[#f5f6fa]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Миний захиалга
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <LogOut className="size-4" />
                    Гарах
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="hidden rounded-md px-2 py-1 font-medium text-[#495160] hover:bg-black/5 sm:inline"
            >
              Нэвтрэх
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-[#2f7df6] px-2.5 py-1 font-medium text-white hover:bg-[#2568d4]"
            >
              Бүртгүүлэх
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
