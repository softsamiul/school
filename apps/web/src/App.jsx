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

  const statusLabel = {
    loading: "Checking API",
    connected: "API connected",
    unavailable: "API unavailable",
  }[apiStatus.state];

  return (
    <main className="page-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="brand-mark" aria-hidden="true">S</div>
        <p className="eyebrow">School management platform</p>
        <h1 id="welcome-title">Your school workspace starts here.</h1>
        <p className="intro">
          The React app and Express API are connected. Add your school workflows
          one well-defined feature at a time.
        </p>
        <div className={`status status--${apiStatus.state}`} role="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {statusLabel}
        </div>
        <p className="next-step">
          Before adding student data, establish authentication and verified
          school membership in the API.
        </p>
      </section>
      <footer>Built for clear, school-scoped workflows.</footer>
    </main>
  );
}
