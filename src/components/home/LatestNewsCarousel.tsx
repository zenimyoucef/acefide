"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@/lib/navigation";
import { CalendarDays, ArrowLeft, ArrowRight } from "lucide-react";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  date: string;
};

type Props = {
  items: NewsItem[];
  locale: string;
};

const categoryLabels: Record<string, string> = {
  NEWS: "أخبار",
  REPORTS: "تقارير",
  STUDIES: "دراسات",
  ANALYSIS: "تحليل",
};

const INTERVAL_MS = 5000;

export function LatestNewsCarousel({ items, locale }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRtl = locale === "ar";
  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [total, isTransitioning]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    intervalRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next, total]);

  // Touch/swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (isRtl ? diff < 0 : diff > 0) next();
      else prev();
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") isRtl ? next() : prev();
      if (e.key === "ArrowRight") isRtl ? prev() : next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isRtl]);

  const item = items[current];
  const date = new Date(item.date);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main card */}
      <Link
        href={`/news/${item.slug}`}
        className="group block rounded-2xl border border-border/50 bg-white shadow-[0_1px_3px_rgba(11,31,51,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_16px_45px_rgba(11,31,51,0.1)]"
      >
        <div key={current} className="grid gap-0 lg:grid-cols-[1.1fr_1fr]" style={{ animation: "newsCardIn 0.5s ease-out" }}>
          {/* Image */}
          {item.coverImage && (
            <div className="flex w-full items-center justify-center overflow-hidden rounded-t-2xl bg-muted p-6 transition-all duration-500 group-hover:bg-muted/80 lg:rounded-t-none lg:rounded-s-2xl">
              <img
                src={item.coverImage}
                alt={item.title}
                className="max-h-[22rem] w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="flex flex-wrap items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary">
              <span>{categoryLabels[item.category] || item.category}</span>
              <span className="text-border">/</span>
              <time dateTime={item.date} className="inline-flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" })}
              </time>
            </p>

            <h3 className="mt-4 text-xl font-black leading-tight tracking-[-0.02em] text-[#0b1f33] transition-colors duration-300 group-hover:text-primary sm:text-2xl lg:text-3xl">
              {item.title}
            </h3>

            {item.excerpt && (
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base line-clamp-3">
                {item.excerpt}
              </p>
            )}

            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3">
              اقرأ الخبر
              {isRtl ? (
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Controls */}
      {total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Previous */}
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="hidden h-9 w-9 rounded-full border border-border/60 bg-white text-muted-foreground items-center justify-center transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5 lg:flex"
            aria-label="السابق"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "h-2.5 w-2.5 bg-primary scale-110"
                    : "h-2 w-2 bg-border hover:bg-primary/40"
                }`}
                aria-label={`الخبر ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="hidden h-9 w-9 rounded-full border border-border/60 bg-white text-muted-foreground items-center justify-center transition-all hover:border-primary/30 hover:text-primary hover:bg-primary/5 lg:flex"
            aria-label="التالي"
          >
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      )}


    </div>
  );
}
