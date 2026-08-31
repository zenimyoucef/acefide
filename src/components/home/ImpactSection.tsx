"use client";

import { CalendarDays, Facebook, Handshake, MapPinned } from "lucide-react";

const items = [
  { icon: CalendarDays, value: "2022", label: "الانطلاق الرسمي" },
  { icon: Facebook, value: "19K+", label: "متابع على فيسبوك" },
  { icon: Handshake, value: "4+", label: "علاقات مؤسساتية موثقة" },
  { icon: MapPinned, value: "وطني", label: "نطاق النشاط" },
];

export function ImpactSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0b1f33] py-10 text-white" dir="rtl">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(32,205,181,0.06)_0%,transparent_70%)]" />

      <div className="container-content relative z-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.08] sm:grid-cols-4">
        {items.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group flex min-h-36 flex-col items-center justify-center gap-2.5 bg-[#0b1f33] p-5 text-center transition-all duration-400 hover:bg-[#0e2439]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5c978]/10 transition-all duration-300 group-hover:bg-[#e5c978]/20 group-hover:scale-110">
              <Icon className="h-5 w-5 text-[#e5c978] transition-transform duration-300 group-hover:scale-110" />
            </div>
            <strong className="text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-white">{value}</strong>
            <span className="text-xs font-medium text-white/50 transition-colors duration-300 group-hover:text-white/70 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
