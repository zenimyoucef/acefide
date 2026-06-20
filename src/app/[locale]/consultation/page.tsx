"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, CheckCircle, Send } from "lucide-react";

export default function ConsultationPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silent
    }
  };

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content text-center">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {locale === "ar" ? "طلب استشارة" : locale === "fr" ? "Demande de consultation" : "Consultation Request"}
          </h1>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-content max-w-2xl">
          <Card>
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-turquoise mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {locale === "ar" ? "تم إرسال طلب الاستشارة بنجاح" : locale === "fr" ? "Demande de consultation envoyée avec succès" : "Consultation request submitted successfully"}
                  </h3>
                  <p className="text-muted-foreground">{locale === "ar" ? "سنتواصل معك قريباً" : locale === "fr" ? "Nous vous contacterons bientôt" : "We will get back to you soon"}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contact.form.email")}</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">{t("contact.form.organization")}</Label>
                      <Input id="organization" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                    <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.form.message")}</Label>
                    <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                  <Button type="submit" size="lg" className="rounded-full w-full">
                    <Send className="h-4 w-4" />
                    {t("contact.form.send")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
