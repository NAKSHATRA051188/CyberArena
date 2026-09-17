"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  Fingerprint,
  LockKeyhole,
  MapPin,
  Network,
  MonitorSmartphone,
  Search,
  ShieldAlert,
  Terminal,
  UserRound,
} from "lucide-react";
import type { SecurityIncident } from "../../lib/security";

const KEY = "cyberbank_security_incident";

function fmt(s?: string) {
  return s
    ? new Date(s).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium",
      })
    : "—";
}

export default function BankSecurity() {
  const [incident, setIncident] = useState<SecurityIncident | null>(null);
  const [popup, setPopup] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) {
          setIncident(null);
          return;
        }
        const i = JSON.parse(raw) as SecurityIncident;
        setIncident(i);
        if (i.status === "ACTIVE") setPopup(true);
      } catch {
        setIncident(null);
      }
    };

    load();
    const poll = window.setInterval(load, 1000);
    window.addEventListener("storage", load);

    return () => {
      window.clearInterval(poll);
      window.removeEventListener("storage", load);
    };
  }, []);

  function contain() {
    if (!incident) return;

    const next = {
      ...incident,
      status: "CONTAINED" as const,
      responseAction: "Account and suspicious session contained",
      resolvedAt: new Date().toISOString(),
    };

    localStorage.setItem(KEY, JSON.stringify(next));
    setIncident(next);
    setPopup(false);
    setToast("CONTAINMENT COMPLETE // SESSION ISOLATED");
    setTimeout(() => setToast(""), 2500);
  }

  const exposure = incident?.dataExposure;

  return (
    <main className="min-h-screen bg-[#050810] text-slate-100">
      <header className="border-b border-cyan-950 bg-[#070b14]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <ShieldAlert />
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.12em]">
                CYBERBANK // SOC
              </div>
              <div className="font-mono text-[10px] text-cyan-400">
                SECURITY OPERATIONS CENTER v1.0
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <span className="hidden text-slate-500 md:block">
              EVENT STREAM: <b className="text-green-400">CONNECTED</b>
            </span>
            <span className="flex items-center gap-2 text-green-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              ONLINE
            </span>
            <Link
              href="/"
              className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 hover:bg-white/5"
            >
              Arena
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#070b14] p-4 lg:block">
          <div className="mb-5 px-3 font-mono text-[10px] font-bold tracking-[0.2em] text-slate-600">
            SOC MODULES
          </div>
          {[
            [Activity, "Live Overview"],
            [BellRing, "Threat Alerts"],
            [Search, "Investigations"],
            [Database, "Data Exposure"],
            [Network, "Network Sessions"],
            [UserRound, "Customers"],
          ].map(([Icon, label], idx) => (
            <div
              key={label as string}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${
                idx === 1
                  ? "border border-cyan-500/15 bg-cyan-500/10 font-bold text-cyan-300"
                  : "text-slate-500"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </div>
          ))}

          <div className="mt-8 rounded-xl border border-cyan-500/10 bg-cyan-500/[0.03] p-4">
            <div className="font-mono text-[10px] text-cyan-400">ENVIRONMENT</div>
            <div className="mt-2 text-xs text-slate-500">
              CYBERBANK-DEMO
            </div>
            <div className="mt-3 font-mono text-[10px] text-slate-600">
              REAL TARGETS: BLOCKED
              <br />
              REAL DATA: NONE
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] font-bold tracking-[0.25em] text-cyan-400">
                LIVE INCIDENT MONITOR
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight">
                Security Command Console
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Correlate authentication and protected-resource events to
                determine what happened and whether customer data may have been
                exposed.
              </p>
            </div>

            <Link
              href="/red-team"
              className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-bold text-red-300"
            >
              Red Team →
            </Link>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-4">
            <TechStat label="ACTIVE ALERTS" value={incident?.status === "ACTIVE" ? "01" : "00"} />
            <TechStat label="RISK SCORE" value={incident ? `${incident.risk}` : "—"} />
            <TechStat label="DATA EXPOSURE" value={exposure?.protectedDataAccessed?.length ? "POTENTIAL" : "NONE"} />
            <TechStat label="SYSTEM STATE" value={incident?.status || "CLEAR"} />
          </div>

          {!incident ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#080d17] p-12 text-center">
              <Activity className="mx-auto h-10 w-10 text-cyan-500" />
              <h2 className="mt-4 text-xl font-bold">Awaiting security events</h2>
              <p className="mt-2 text-sm text-slate-500">
                Launch a controlled scenario from Red Team to populate the SOC.
              </p>
              <Link
                href="/red-team"
                className="mt-5 inline-flex rounded-lg bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950"
              >
                Launch Simulation
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-2xl border border-cyan-950 bg-[#080d17]">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#0b111e] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      <div>
                        <div className="font-mono text-[10px] text-slate-600">
                          INCIDENT RECORD
                        </div>
                        <div className="font-bold">
                          {incident.id} // {incident.classification}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[10px] font-bold text-red-300">
                      {incident.status}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <PanelField label="CUSTOMER" value={incident.customer} />
                      <PanelField label="ACCOUNT" value={incident.account} />
                      <PanelField label="RISK" value={`${incident.risk}/100`} danger />
                      <PanelField label="DEVICE" value={incident.device} />
                      <PanelField label="LOCATION" value={incident.location} />
                      <PanelField label="SOURCE" value={incident.source} />
                      <PanelField label="ATTACK TYPE" value={incident.attackLabel || "Suspicious Login"} danger={incident.attackType !== "SUSPICIOUS_LOGIN"} />
                      {incident.affectedEndpoint && (
                        <PanelField label="AFFECTED ENDPOINT" value={incident.affectedEndpoint} danger />
                      )}
                      {incident.affectedObject && (
                        <PanelField label="AFFECTED OBJECT" value={incident.affectedObject} danger />
                      )}
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-cyan-400">
                        <Terminal className="h-3.5 w-3.5" />
                        DETECTION REASONS
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {incident.reasons.map((r) => (
                          <div key={r} className="rounded-md bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                            <span className="text-red-400">›</span> {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {incident.attackType && incident.attackType !== "SUSPICIOUS_LOGIN" && (
                  <div className="rounded-2xl border border-red-500/20 bg-[#0b0b12] p-6">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                      <h2 className="font-bold">Vulnerability Detection</h2>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <PanelField label="CLASS" value={incident.attackLabel || "Controlled vulnerability"} danger />
                      <PanelField label="DETECTION MODE" value="DETERMINISTIC RULE" />
                      <PanelField label="TARGET" value="CYBERBANK-DEMO" />
                      <PanelField label="EXECUTION" value="SIMULATED / NON-EXECUTING" />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      This lab records what the security system would detect from a vulnerable flow. It does not execute SQL, bypass a real authorization boundary, or execute JavaScript.
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-[#080d17] p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">Correlated Event Timeline</h2>
                    <span className="font-mono text-[10px] text-slate-600">
                      SESSION TRACE
                    </span>
                  </div>

                  <div className="mt-5 space-y-0 border-l border-cyan-500/20 pl-6">
                    {[
                      ["AUTH", "Suspicious login attempt", "Authentication request flagged."],
                      ["AUTH", "Credential verification", "Demo credential verification completed."],
                      ["DEVICE", "New device identified", "Device fingerprint is not in the trusted profile."],
                      ["GEO", "Location anomaly", "Sign-in location differs from trusted activity."],
                      ...(exposure?.customerProfileAccessed
                        ? [["DATA", "Customer profile accessed", "Synthetic personal information was viewed by the suspicious session."]]
                        : []),
                      ...(exposure?.transactionHistoryAccessed
                        ? [["DATA", "Transaction history accessed", "Synthetic transaction records were viewed by the suspicious session."]]
                        : []),
                      ...(exposure?.dataDownloaded
                        ? [["EXPORT", "Synthetic data export", "Controlled export event — simulated exposure only."]]
                        : []),
                      ...(incident.attackType === "SQL_INJECTION"
                        ? [["SQLI", "SQL injection signature", "Synthetic query-pattern rule triggered at the demo account-search boundary."]]
                        : []),
                      ...(incident.attackType === "IDOR"
                        ? [["IDOR", "Object authorization anomaly", "Synthetic request referenced an object belonging to another demo customer."]]
                        : []),
                      ...(incident.attackType === "STORED_XSS"
                        ? [["XSS", "Stored content anomaly", "Synthetic script-like message content triggered the validation/output-encoding rule."]]
                        : []),
                      ["ENGINE", "Risk classification", `Session classified at ${incident.risk}/100.`],
                      ["SOC", "Incident created", "Security Operations was notified."],
                    ].map(([tag, title, detail], i) => (
                      <div key={`${tag}-${title}`} className="relative pb-6">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#080d17] bg-cyan-400" />
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-400">
                            {tag}
                          </span>
                          <span className="text-sm font-bold">{title}</span>
                        </div>
                        <div className="mt-1 text-xs leading-5 text-slate-600">{detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-red-500/20 bg-[#0b0b12] p-6 shadow-[0_0_40px_rgba(239,68,68,.05)]">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-red-400" />
                    <h2 className="font-bold">Data Exposure Assessment</h2>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    The SOC does not infer compromise from login alone. The
                    assessment uses observed synthetic resource-access events.
                  </p>

                  <div className="mt-5 space-y-1">
                    <Exposure label="Authentication" value="SUSPICIOUS" danger />
                    <Exposure label="Account accessed" value={exposure?.accountAccessed ? "YES" : "NO"} danger={!!exposure?.accountAccessed} />
                    <Exposure label="Customer profile" value={exposure?.customerProfileAccessed ? "ACCESSED" : "NO"} danger={!!exposure?.customerProfileAccessed} />
                    <Exposure label="Transaction history" value={exposure?.transactionHistoryAccessed ? "ACCESSED" : "NO"} danger={!!exposure?.transactionHistoryAccessed} />
                    <Exposure label="Data downloaded" value={exposure?.dataDownloaded ? "YES" : "NO"} danger={!!exposure?.dataDownloaded} />
                  </div>

                  <div className={`mt-5 rounded-xl border p-4 ${
                    exposure?.assessment === "POTENTIAL"
                      ? "border-amber-500/20 bg-amber-500/5"
                      : exposure?.assessment === "CONFIRMED_SIMULATED"
                      ? "border-red-500/30 bg-red-500/10"
                      : "border-green-500/20 bg-green-500/5"
                  }`}>
                    <div className="font-mono text-[10px] font-bold tracking-wider text-slate-500">
                      ASSESSMENT RESULT
                    </div>
                    <div className="mt-1 font-black">
                      {exposure?.assessment === "POTENTIAL"
                        ? "POTENTIAL DATA COMPROMISE"
                        : exposure?.assessment === "CONFIRMED_SIMULATED"
                        ? "CONFIRMED SIMULATED EXPOSURE"
                        : "NO EVIDENCE OF DATA ACCESS"}
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-500">
                      {exposure?.protectedDataAccessed?.length
                        ? `Observed: ${exposure.protectedDataAccessed.join(", ")}.`
                        : "No protected customer resources observed."}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#080d17] p-6">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-cyan-400" />
                    <h2 className="font-bold">Session Intelligence</h2>
                  </div>
                  <div className="mt-5 space-y-4">
                    <Intel icon={<MonitorSmartphone />} label="DEVICE" value={incident.device} />
                    <Intel icon={<MapPin />} label="LOCATION" value={incident.location} />
                    <Intel icon={<Network />} label="NETWORK" value={`${incident.ip} // SYNTHETIC`} />
                    <Intel icon={<Clock3 />} label="DETECTED" value={fmt(incident.timestamp)} />
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03] p-6">
                  <div className="font-mono text-[10px] font-bold tracking-wider text-cyan-400">
                    RESPONSE PLAYBOOK
                  </div>
                  <h3 className="mt-2 font-bold">
                    {exposure?.assessment === "POTENTIAL"
                      ? "Protect the account and investigate affected resources."
                      : "Verify the customer and investigate the session."}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Verify identity through an approved channel, review the
                    session, document affected synthetic data categories and
                    contain the session when appropriate.
                  </p>
                  {incident.status === "ACTIVE" && (
                    <button
                      onClick={contain}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-sm font-black text-slate-950 hover:bg-cyan-400"
                    >
                      <LockKeyhole className="h-4 w-4" />
                      LOCK ACCOUNT & CONTAIN
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {popup && incident && incident.status === "ACTIVE" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-red-500/30 bg-[#090c14] shadow-[0_0_80px_rgba(239,68,68,.18)]">
            <div className="border-b border-red-500/20 bg-red-500/10 p-6">
              <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert />
                <span className="font-mono text-[10px] font-bold tracking-[0.2em]">
                  SOC PRIORITY ALERT
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-black">
                Security compromise detected
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                An unauthorized sign-in pattern was detected. The console has
                correlated subsequent synthetic resource-access events to help
                determine whether customer data may have been exposed.
              </p>
            </div>

            <div className="grid gap-3 p-6 sm:grid-cols-2">
              <PopupField label="CUSTOMER" value={incident.customer} />
              <PopupField label="RISK" value={`${incident.risk}/100`} />
              <PopupField
                label="DATA ACCESS"
                value={exposure?.protectedDataAccessed?.length ? "POTENTIAL" : "NONE OBSERVED"}
              />
              <PopupField
                label="ASSESSMENT"
                value={
                  exposure?.assessment === "CONFIRMED_SIMULATED"
                    ? "SIMULATED EXPOSURE"
                    : exposure?.assessment === "POTENTIAL"
                    ? "POTENTIAL COMPROMISE"
                    : "NO EVIDENCE"
                }
              />
            </div>

            <div className="flex gap-3 border-t border-white/10 p-6">
              <button
                onClick={contain}
                className="flex-1 rounded-lg bg-red-600 py-3 text-sm font-black text-white hover:bg-red-500"
              >
                CONTAIN INCIDENT
              </button>
              <button
                onClick={() => setPopup(false)}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-slate-300"
              >
                INVESTIGATE
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg border border-cyan-500/30 bg-[#07111f] px-5 py-3 font-mono text-xs font-bold text-cyan-300 shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}

function TechStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080d17] p-5">
      <div className="font-mono text-[9px] font-bold tracking-[0.18em] text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}

function PanelField({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/15 p-3">
      <div className="font-mono text-[9px] text-slate-600">{label}</div>
      <div className={`mt-1 text-xs font-bold ${danger ? "text-red-400" : "text-slate-300"}`}>{value}</div>
    </div>
  );
}

function Exposure({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`font-mono text-[10px] font-bold ${danger ? "text-red-400" : "text-green-400"}`}>{value}</span>
    </div>
  );
}

function Intel({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="text-cyan-500">{icon}</div>
      <div>
        <div className="font-mono text-[9px] text-slate-600">{label}</div>
        <div className="mt-1 text-xs font-semibold text-slate-400">{value}</div>
      </div>
    </div>
  );
}

function PopupField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="font-mono text-[9px] text-slate-600">{label}</div>
      <div className="mt-1 text-sm font-bold text-slate-200">{value}</div>
    </div>
  );
}

function Clock3() {
  return <Activity className="h-4 w-4" />;
}
