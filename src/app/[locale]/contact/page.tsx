"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
      }
    } catch {
      // silent
    }
  };

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-20">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>
      </section>

      <section className="py-20">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-turquoise mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {t("form.success")}
                      </h3>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("form.name")}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("form.email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("form.phone")}</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">{t("form.organization")}</Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t("form.subject")}</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t("form.message")}</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="rounded-full w-full md:w-auto">
                        <Send className="h-4 w-4" />
                        {t("form.send")}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {locale === "ar" ? "العنوان" : locale === "fr" ? "Adresse" : "Address"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{t("info.address")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {locale === "ar" ? "الهاتف" : locale === "fr" ? "Téléphone" : "Phone"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{t("info.phone")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">{t("info.email")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardContent className="p-0 overflow-hidden rounded-xl">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center p-6">
                      <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {locale === "ar"
                          ? "خريطة الموقع (قيد الإضافة)"
                          : locale === "fr"
                          ? "Carte du site (à venir)"
                          : "Map location (coming soon)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
