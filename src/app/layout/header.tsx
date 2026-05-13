"use client";

import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const itemCount = 9;
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Нүүр" },
    { href: "/survey", label: "Судалгаа" },
    { href: "/build", label: "PC угсралт" },
    { href: "/prebuilt", label: "Бэлэн компьютер" },
    { href: "/benchmark", label: "Бенчмарк" },
  ];

  return (
    <header className="relative mb-[18px] flex items-center justify-center rounded-[18px] border border-[#ececf2] bg-[#f7f7fb] px-7 py-[22px]">
      <nav className="flex flex-wrap justify-center gap-8 text-lg md:gap-8">
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
      <div className="absolute right-7 flex items-center gap-[18px] text-[22px] text-[#495160]">
        <button
          type="button"
          className="rounded-md p-1 hover:bg-black/5"
          aria-label="Хайх"
        >
          <Search className="size-[22px]" strokeWidth={2} />
        </button>
        <div className="relative text-[#495160]">
          <ShoppingCart className="size-[22px]" strokeWidth={2} />
          <span className="absolute -right-2.5 -top-2 flex size-4 items-center justify-center rounded-full bg-[#2bc66a] text-[11px] font-medium text-white">
            {itemCount}
          </span>
        </div>
        <button
          type="button"
          className="rounded-md p-1 hover:bg-black/5"
          aria-label="Хэрэглэгч"
        >
          <User className="size-[22px]" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
};

export default Header;