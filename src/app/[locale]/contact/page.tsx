"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send, CheckCircle, Paperclip, X } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const officialContact = {
    address: isRtl ? "المبنى رقم 60، دالي إبراهيم، العاشور، درارية، الجزائر العاصمة" : locale === "fr" ? "Bâtiment 60, Dely Ibrahim, El Achour, Draria, Alger" : "Building 60, Dely Ibrahim, El Achour, Draria, Algiers",
    phone: "023 29 88 88",
    email: "acefidedz@gmail.com",
  };
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.set("name", formData.name);
      fd.set("email", formData.email);
      fd.set("phone", formData.phone);
      fd.set("organization", formData.organization);
      fd.set("subject", formData.subject);
      fd.set("message", formData.message);
      if (file) fd.set("file", file);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", organization: "", subject: "", message: "" });
        setFile(null);
      } else setError("تعذر إرسال الرسالة. يرجى مراجعة البيانات والمحاولة مجدداً.");
    } catch {
      setError("تعذر الاتصال بالخادم.");
    } finally { setLoading(false); }
  };

  return (
    <div className={cn(isRtl && "font-arabic")} dir={isRtl ? "rtl" : "ltr"}>
      <section className="gradient-primary py-14 sm:py-20">
        <div className="container-content text-center">
          <h1 className="text-[1.75rem] sm:text-4xl font-bold text-white mb-4">{t("title")}</h1>
          <div className="w-16 h-1 bg-turquoise mx-auto rounded-full" />
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="sm:col-span-2">
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
                      <div>
                        <Label htmlFor="file" className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                          <Paperclip className="h-4 w-4" /> إرفاق ملف (اختياري)
                        </Label>
                        <input
                          id="file"
                          type="file"
                          className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm">
                            <Paperclip className="h-3.5 w-3.5 text-primary" />
                            <span className="truncate flex-1">{file.name}</span>
                            <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                      <Button type="submit" size="lg" disabled={loading} className="rounded-full w-full md:w-auto">
                        <Send className="h-4 w-4" />
                        {loading ? "…" : t("form.send")}
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
                        "العنوان"
                      </h3>
                      <p className="text-sm text-muted-foreground">{officialContact.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        "الهاتف"
                      </h3>
                      <a href="tel:+21323298888" className="text-sm text-muted-foreground hover:text-primary">{officialContact.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">البريد الإلكتروني</h3>
                      <a href={`mailto:${officialContact.email}`} className="text-sm text-muted-foreground hover:text-primary">{officialContact.email}</a>
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
                        "خريطة الموقع (قيد الإضافة)"
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
