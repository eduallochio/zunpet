"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ExcluirContaPage() {
  const t = useTranslations("DeleteAccount");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setStatus("duplicate");
        } else {
          setErrorMsg(data.error ?? t("genericError"));
          setStatus("error");
        }
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg(t("connectionError"));
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/icon.png" alt="Zupet" width={32} height={32} className="rounded-lg" />
          <span className="font-semibold text-gray-900">{t("headerBrand")}</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {status === "success" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("successTitle")}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.rich("successDesc", { strong: (chunks) => <strong>{chunks}</strong> })}
              </p>
              <p className="text-gray-400 text-xs mt-4">
                {t.rich("successContact", {
                  email: () => <a href="mailto:contato@zupet.io" className="text-[#e87c3a] hover:underline">contato@zupet.io</a>,
                })}
              </p>
            </div>
          ) : status === "duplicate" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("duplicateTitle")}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t("duplicateDesc")}
              </p>
              <p className="text-gray-400 text-xs mt-4">
                {t.rich("duplicateContact", {
                  email: () => <a href="mailto:contato@zupet.io" className="text-[#e87c3a] hover:underline">contato@zupet.io</a>,
                })}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t("formTitle")}</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t("formDesc")}
                </p>
              </div>

              {/* O que será excluído */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-medium text-red-700 mb-2">{t("deletedDataTitle")}</p>
                <ul className="text-xs text-red-600 space-y-1">
                  <li>• {t("deletedItem1")}</li>
                  <li>• {t("deletedItem2")}</li>
                  <li>• {t("deletedItem3")}</li>
                  <li>• {t("deletedItem4")}</li>
                  <li>• {t("deletedItem5")}</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("emailLabel")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#e87c3a]/30 focus:border-[#e87c3a] transition"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("reasonLabel")} <span className="text-gray-400 font-normal">{t("reasonOptional")}</span>
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t("reasonPlaceholder")}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#e87c3a]/30 focus:border-[#e87c3a] transition resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl text-sm transition"
                >
                  {status === "loading" ? t("submitBtnLoading") : t("submitBtn")}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                {t.rich("preferAppNotice", { strong: (chunks) => <strong>{chunks}</strong> })}{" "}
                <Link href="/privacidade" className="text-[#e87c3a] hover:underline">{t("privacyLink")}</Link>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400">
        © {new Date().getFullYear()} Zupet · <Link href="/privacidade" className="hover:underline">{t("footerPrivacy")}</Link> · <Link href="/termos" className="hover:underline">{t("footerTerms")}</Link>
      </footer>
    </div>
  );
}
