"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MembershipActivationPage() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/membership/activate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    const result = await response.json();
    if (!response.ok) return setError(result.error || "Unable to activate your account.");
    setDone(true);
  }

  return <main className="min-h-[70vh] bg-[#f7f8f6] px-4 py-20"><form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold">Activate membership account</h1>{done ? <p className="mt-5 text-sm text-emerald-700">Your account is active. You can now sign in.</p> : <><p className="mt-2 text-sm text-muted-foreground">Choose a password to activate your approved membership account.</p><Label className="mt-6 block text-sm font-semibold">Password<Input className="mt-2" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></Label>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<Button className="mt-6" disabled={!token}>Activate account</Button></>}</form></main>;
}
