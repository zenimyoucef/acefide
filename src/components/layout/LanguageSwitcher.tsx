"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Locale = "ar" | "en" | "fr";

const languages = [
  { code: "ar", name: "العربية", dir: "rtl" as const },
  { code: "en", name: "English", dir: "ltr" as const },
  { code: "fr", name: "Français", dir: "ltr" as const },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }

    setOpen(false);

    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;

    router.replace(target, {
      locale: newLocale,
      scroll: false,
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-w-[4.5rem] rounded-full px-3"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-bold tracking-wide">{locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 p-1.5">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} asChild className="cursor-pointer">
            <button
              type="button"
              dir={language.dir}
              aria-current={locale === language.code ? "true" : undefined}
              className="flex w-full items-center justify-between gap-4"
              onClick={() => switchLanguage(language.code)}
            >
              <span>{language.name}</span>
              <span className="text-xs font-bold text-muted-foreground">
                {language.code.toUpperCase()}
              </span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
