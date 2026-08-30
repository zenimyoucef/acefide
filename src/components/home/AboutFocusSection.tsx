"use client";
import { Link } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";

const copy = {
  eyebrow: "مساهمتنا في تطوير الإقتصاد",
  title: "منصة وطنية للحوار والعمل الاقتصادي",
  body: "المركز الجزائري للتشبيك الاقتصادي والاستثمار التنموي جمعية وطنية تُعنى باستشراف التحولات الاقتصادية ودعم الاستثمار وروح المبادرة. يجمع المركز المؤسسات الاقتصادية والجامعات والهيئات العمومية وحاملي المشاريع ضمن فضاء للتعاون وتبادل الخبرات، بهدف بلورة رؤى عملية وتوصيات تسهم في دفع عجلة التنمية الوطنية.",
  link: "تعرف على المركز",
};

export function AboutFocusSection() {
  return (
    <section className="bg-white py-20" dir="rtl">
      <div className="container-content max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">{copy.eyebrow}</p>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#0b1f33] md:text-4xl">{copy.title}</h2>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{copy.body}</p>
        <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-bold text-primary">{copy.link}<ArrowLeft className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
