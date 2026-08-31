"use client";


const items = [
  "تشجيع الابتكار و ريادة الاعمال من خلال المساهمة في صناعة الفكر الاقتصادي",
  "المشاركة في مرافقة الافكار التنموية و الترويج للفرص الاقتصادية",
  "مرافقة مجتمع الاعمال في المنظومة الوطنية و المساهمة في تحقيق الانتقال الرقمي",
  "تعزيز ثقافة المقاولاتية في اواسط الشباب بهدف التمكين الاقتصادي",
  "الاقتراح الهادف لتثمين الفرص التنموية و تطوير القطاعات الاقتصادية",
  "المبادرة الى دراسات تشاركية رامية لتنويع الاقتصاد و تثمين المقدرات الوطنية",
  "العمل على تعزيز دور الجالية الوطنية بالخارج في جهود التنمية المحلية",
  "المساهمة في الربط و التشبيك الاقتصادي من خلال بناء و تعزيز العلاقات و التعاون بين مجتمع الاعمال",
  "السعي لأخلقة الحياة الاقتصادية و انجاح البرامج التنموية",
  "التعاون مع الهيئات الرسمية لمجابهة تحديات الامن التنموي",
];

export function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f8f4] py-14 sm:py-20" dir="rtl">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -start-32 top-10 h-[28rem] w-[28rem] rounded-full bg-primary/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -end-20 bottom-10 h-72 w-72 rounded-full bg-turquoise/[0.06] blur-[100px]" />

      <div className="container-content relative z-10">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="text-[1.75rem] sm:text-3xl font-black tracking-tight text-[#0b1f33]">
            أدوارنا
          </h2>
          <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-l from-turquoise via-primary to-turquoise" />
        </div>

        {/* Items */}
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/40 bg-white/80 p-5 shadow-[0_1px_3px_rgba(11,31,51,0.04)] backdrop-blur-sm transition-all duration-[400ms] ease-out hover:border-primary/20 hover:bg-white hover:shadow-[0_8px_30px_rgba(11,122,83,0.08)] hover:-translate-y-[3px] sm:p-6"
            >
              {/* Left accent bar */}
              <div className="absolute inset-y-0 end-0 w-[3px] rounded-l-full bg-gradient-to-b from-turquoise/0 via-primary/50 to-turquoise/0 opacity-0 transition-all duration-400 group-hover:opacity-100" />

              {/* Number badge */}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-turquoise text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(11,122,83,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(11,122,83,0.35)]">
                {index + 1}
              </span>

              {/* Text */}
              <p className="pt-2 text-[0.94rem] leading-[2] text-[#455a4e] transition-colors duration-300 group-hover:text-[#1a2e24]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
