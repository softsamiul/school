import { useEffect, useState } from "react";
import { healthResponseSchema } from "@school/contracts/health";

export default function App() {
  const [apiStatus, setApiStatus] = useState({ state: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadApiStatus() {
      try {
        const response = await fetch("/api/health/live", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("API returned an error");

        const payload = healthResponseSchema.parse(await response.json());
        setApiStatus({ state: "connected", service: payload.service });
      } catch (error) {
        if (error.name !== "AbortError") setApiStatus({ state: "unavailable" });
      }
    }

    loadApiStatus();
    return () => controller.abort();
  }, []);

  const statusContent = {
    loading: {
      label: "Checking API",
      color: "bg-amber-500",
      border: "border-amber-200",
    },
    connected: {
      label: "API connected",
      color: "bg-emerald-600",
      border: "border-emerald-200",
    },
    unavailable: {
      label: "API unavailable",
      color: "bg-rose-600",
      border: "border-rose-200",
    },
  }[apiStatus.state];

  return (
    <main className="grid min-h-screen grid-rows-[1fr_auto] place-items-center bg-slate-50 px-5 pt-10 pb-6 font-sans text-slate-900 antialiased">
      <section
        className="w-full max-w-[680px] rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(34,54,92,0.09)] sm:p-12 md:p-16"
        aria-labelledby="welcome-title"
      >
        <div className="grid size-12 place-items-center rounded-[15px] bg-blue-700 text-[22px] font-bold text-white" aria-hidden="true">
          S
        </div>
        <p className="mt-[38px] mb-3 text-xs font-bold tracking-[0.12em] text-indigo-700 uppercase">
          School management platform
        </p>
        <h1 id="welcome-title" className="max-w-[540px] text-4xl leading-[1.05] font-bold tracking-[-0.045em] sm:text-5xl">
          Your school workspace starts here.
        </h1>
        <p className="mt-[22px] mb-7 max-w-[500px] text-base leading-[1.7] text-slate-500 sm:text-[17px]">
          The React app and Express API are connected. Add your school workflows
          one well-defined feature at a time.
        </p>
        <div
          className={`inline-flex min-h-10 items-center gap-2.5 rounded-full border ${statusContent.border} px-3.5 text-[13px] font-semibold text-slate-600`}
          role="status"
          aria-live="polite"
        >
          <span className={`size-2 rounded-full ${statusContent.color}`} aria-hidden="true" />
          {statusContent.label}
        </div>
        <p className="mt-[26px] max-w-[460px] text-[13px] leading-relaxed text-slate-500">
          Before adding student data, establish authentication and verified
          school membership in the API.
        </p>
      </section>
      <footer className="pt-8 text-xs text-slate-400">
        Built for clear, school-scoped workflows.
      </footer>
    </main>
  );
}
