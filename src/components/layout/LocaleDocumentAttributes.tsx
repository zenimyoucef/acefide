"use client";

import { useLayoutEffect } from "react";

export function LocaleDocumentAttributes({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return null;
}
