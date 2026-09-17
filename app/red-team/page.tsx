"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crosshair,
  ShieldAlert,
  Terminal,
  Zap,
  Database,
  ArrowRight,
  Radio,
  Activity,
  Code2,
  KeyRound,
  MessageSquareWarning,
} from "lucide-react";
import {
  dataAccessIncident,
  demoIncident,
  simulatedExportIncident,
  sqlInjectionIncident,
  idorIncident,
  storedXssIncident,
} from "../../lib/security";

const KEY = "cyberbank_security_incident";

type ScenarioType = "login" | "access" | "export" | "sqli" | "idor" | "xss";

export default function RedTeam() {
  const [msg, setMsg] = useState("");
  const [active, setActive] = useState<string | null>(null);

  function launch(type: ScenarioType) {
    const incident =
      type === "login"
        ? demoIncident()
        : type === "access"
        ? dataAccessIncident()
        : type === "export"
        ? simulatedExportIncident()
        : type === "sqli"
        ? sqlInjectionIncident()
        : type === "idor"
        ? idorIncident()
        : storedXssIncident();

    localStorage.setItem(KEY, JSON.stringify(incident));
    localStorage.setItem("cyberbank_security_broadcast", Date.now().toString());
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));

    setActive(type);
    setMsg(
      `${incident.attackLabel?.toUpperCase()} // ${incident.id} CREATED — synthetic telemetry sent to CyberBank SOC.`
    );
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(255,50,50,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,50,50,.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <header className="relative border-b border-red-950 bg-[#0b0c11]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 shadow-[0_0_25px_rgba(239,68,68,.15)]">
              <Crosshair />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">
                CYBER<span className="text-red-500">ARENA</span>
              </div>
              <div className="text-[10px] font-bold tracking-[0.28em] text-red-400">
                RED TEAM // OFFENSIVE SIMULATION
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 sm:block"
            >
              Command Center
            </Link>
            <Link
              href="/bank-security"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/15"
            >
              Blue Team →
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <Radio className="h-4 w-4 animate-pulse" />
              Simulation node online
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-tight">
              Controlled Attack
              <br />
              <span className="text-red-500">Scenario Console</span>
            </h1>

            <p className="mt-5 max-w-3xl text-slate-400 leading-7">
              Generate safe, synthetic attack telemetry against the fictional
              CyberBank environment. Vulnerability labs below model SQL
              injection, IDOR/BOLA and stored XSS without executing exploits,
              querying a real database, or targeting external systems.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Scenario active={active === "login"} number="01" icon={<ShieldAlert />} title="Suspicious Login" description="Creates a high-risk authentication event without protected-data access." button="Launch scenario" onClick={() => launch("login")} />
              <Scenario active={active === "access"} number="02" icon={<Database />} title="Login + Data Access" description="Adds synthetic customer-profile and transaction-history access." button="Inject data access" onClick={() => launch("access")} />
              <Scenario active={active === "export"} number="03" icon={<Zap />} title="Simulated Export" description="Adds a controlled synthetic export event to demonstrate confirmed simulated exposure." button="Inject export" onClick={() => launch("export")} />

              <Scenario active={active === "sqli"} number="04" icon={<Code2 />} title="SQL Injection Lab" badge="WEB VULNERABILITY" description="Simulates a malicious query pattern reaching a fictional account-search endpoint. No SQL is executed." button="Simulate SQLi" onClick={() => launch("sqli")} />
              <Scenario active={active === "idor"} number="05" icon={<KeyRound />} title="IDOR / BOLA Lab" badge="AUTHORIZATION" description="Simulates access to another synthetic account object when object-level authorization should have blocked it." button="Simulate IDOR" onClick={() => launch("idor")} />
              <Scenario active={active === "xss"} number="06" icon={<MessageSquareWarning />} title="Stored XSS Lab" badge="INPUT / OUTPUT" description="Simulates malicious script-like content being stored in a support message. The demo marker is never executed." button="Simulate Stored XSS" onClick={() => launch("xss")} />
            </div>

            {msg && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-300">
                <Terminal className="h-4 w-4 shrink-0" />
                {msg}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-red-950 bg-[#0d0f15] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="text-xs font-bold tracking-[0.2em] text-slate-500">OPERATIONAL FEED</div>
              <Activity className="h-4 w-4 text-red-500" />
            </div>

            <div className="mt-5 space-y-4 font-mono text-xs">
              <Feed label="TARGET" value="CYBERBANK-DEMO" />
              <Feed label="MODE" value="CONTROLLED" />
              <Feed label="LABS" value="6 SCENARIOS" />
              <Feed label="EXTERNAL TARGETS" value="BLOCKED" good />
              <Feed label="REAL DATA" value="NONE" good />
              <Feed label="EVENT BUS" value="READY" good />
            </div>

            <div className="mt-7 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="text-xs font-bold text-red-400">DEMO SAFETY BOUNDARY</div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Vulnerability cards create fictional telemetry only. SQLi does
                not execute SQL, IDOR does not access a real object, and stored
                XSS never renders executable script. No external targeting is performed.
              </p>
            </div>

            <Link
              href="/bank-security"
              className="mt-5 flex items-center justify-between rounded-lg border border-red-500/20 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/5"
            >
              Watch Blue Team response
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Scenario({ number, icon, title, description, button, onClick, active, badge }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
  active: boolean;
  badge?: string;
}) {
  return (
    <div className={`group rounded-2xl border p-5 transition ${active ? "border-red-500/70 bg-red-500/10 shadow-[0_0_35px_rgba(239,68,68,.12)]" : "border-white/10 bg-[#0d0f15] hover:border-red-500/40 hover:bg-red-500/[0.03]"}`}>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">{icon}</div>
        <span className="font-mono text-[10px] font-bold text-slate-600">SCN-{number}</span>
      </div>
      {badge && <div className="mt-4 inline-flex rounded border border-red-500/20 bg-red-500/5 px-2 py-1 font-mono text-[8px] font-bold tracking-wider text-red-400">{badge}</div>}
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">{description}</p>
      <button onClick={onClick} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-black text-white shadow-[0_0_18px_rgba(239,68,68,.12)] hover:bg-red-500">
        <Crosshair className="h-4 w-4" />
        {button}
      </button>
    </div>
  );
}

function Feed({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-600">{label}</span>
      <span className={good ? "text-green-400" : "text-slate-300"}>{value}</span>
    </div>
  );
}
