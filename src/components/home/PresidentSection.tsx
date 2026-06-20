"use client";

import Image from "next/image";
import akram from "../../../assets/akram.png";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote, Signature } from "lucide-react";
import { cn } from "@/lib/utils";

export function PresidentSection() {
  const t = useTranslations("president");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[#f3fbf6] py-20 text-foreground md:py-24",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-primary-dark rtl:left-0 rtl:right-auto lg:block" />

      <div className="container-content relative z-10">
        <div className="scroll-reveal grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 border-b-2 border-turquoise pb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <Quote className="h-4 w-4" />
              {t("message")}
            </div>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight text-[#10241d] md:text-5xl">
              {t("name")}
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary md:text-xl">
              {t("title")}
            </p>

            <div className="relative mt-8 max-w-2xl border-s-4 border-turquoise bg-white px-6 py-7 shadow-[0_18px_45px_rgba(13,107,79,0.10)] md:px-8">
              <Quote className="absolute top-6 h-10 w-10 text-turquoise/15 ltr:right-6 rtl:left-6" />
              <p className="relative text-base leading-8 text-[#385047] md:text-lg">
                {t("shortBio")}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="rounded-full bg-primary px-7 text-white hover:bg-primary-dark group"
                asChild
              >
                <Link href="/president">
                  {t("readMore")}
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </Button>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white text-primary">
                  <Signature className="h-5 w-5" />
                </span>
                <span className="font-medium text-[#10241d]">{t("name")}</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[460px] lg:me-0">
              <div className="absolute -inset-5 translate-x-4 translate-y-5 bg-primary-dark shadow-2xl rtl:-translate-x-4" />
              <div className="absolute -bottom-5 -start-5 h-28 w-28 border-s-4 border-t-4 border-turquoise" />
              <div className="relative aspect-[4/5] overflow-hidden bg-primary-dark shadow-2xl">
                <Image
                  src={akram}
                  alt={t("name")}
                  fill
                  sizes="(min-width: 1024px) 460px, 86vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 bg-primary-dark/88 p-5 text-white backdrop-blur-sm">
                  <p className="text-lg font-bold">{t("name")}</p>
                  <p className="mt-1 text-sm text-turquoise-light">{t("title")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
