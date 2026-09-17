"use client";

import Link from "next/link";
import {
  Shield,
  Crosshair,
  Eye,
  Search,
  LockKeyhole,
  ArrowRight,
  Building2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#07111f]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xl font-black tracking-tight">
              CYBER<span className="text-cyan-400">ARENA</span>
            </div>
            <div className="text-[10px] font-semibold tracking-[0.3em] text-slate-500">
              ATTACK • DETECT • INVESTIGATE • DEFEND
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <span>Controlled Environment</span>
            <span className="flex items-center gap-2 text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Systems Online
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <Shield className="h-4 w-4" />
            Cybersecurity Simulation Platform
          </div>

          <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl">
            One incident.
            <br />
            <span className="text-cyan-400">Every side of the story.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            CyberArena connects a controlled attack simulation with detection,
            investigation, data-exposure assessment, customer communication and
            simulated containment inside a fictional banking environment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <TeamCard
            accent="red"
            icon={<Crosshair className="h-7 w-7" />}
            eyebrow="OFFENSIVE SIMULATION"
            title="Red Team"
            description="Launch safe, synthetic attack scenarios against CyberBank and generate the security events that drive the investigation."
            bullets={[
              "Suspicious login",
              "Login + protected data access",
              "Simulated data export",
            ]}
            href="/red-team"
            button="Enter Red Team"
          />

          <TeamCard
            accent="blue"
            icon={<Eye className="h-7 w-7" />}
            eyebrow="SECURITY OPERATIONS"
            title="Blue Team"
            description="Investigate the resulting incident, correlate events, assess potential data exposure and perform simulated containment."
            bullets={[
              "Real-time security alerts",
              "Investigation timeline",
              "Data exposure assessment",
            ]}
            href="/bank-security"
            button="Enter Blue Team"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                End-to-end demo flow
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold">
                <Flow icon={<Crosshair />} text="Attack" />
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <Flow icon={<Shield />} text="Detect" />
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <Flow icon={<Search />} text="Investigate" />
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <Flow icon={<Building2 />} text="Assess Exposure" />
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <Flow icon={<LockKeyhole />} text="Contain" />
              </div>
            </div>
            <Link
              href="/cyberbank"
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/5"
            >
              Open CyberBank →
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center text-xs leading-5 text-slate-600">
          CyberArena is a fictional educational environment. All accounts,
          customer information, network addresses and attack events are synthetic.
          No external systems are targeted.
        </div>
      </section>
    </main>
  );
}

function TeamCard({
  accent,
  icon,
  eyebrow,
  title,
  description,
  bullets,
  href,
  button,
}: {
  accent: "red" | "blue";
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  button: string;
}) {
  const red = accent === "red";

  return (
    <div
      className={`rounded-2xl border p-7 ${
        red
          ? "border-red-500/20 bg-red-500/[0.04]"
          : "border-cyan-400/20 bg-cyan-400/[0.04]"
      }`}
    >
      <div
        className={`inline-flex rounded-xl p-3 ${
          red ? "bg-red-500/10 text-red-400" : "bg-cyan-400/10 text-cyan-300"
        }`}
      >
        {icon}
      </div>

      <div
        className={`mt-6 text-xs font-bold tracking-[0.2em] ${
          red ? "text-red-400" : "text-cyan-300"
        }`}
      >
        {eyebrow}
      </div>

      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <p className="mt-4 min-h-[80px] leading-7 text-slate-400">{description}</p>

      <div className="mt-5 space-y-2">
        {bullets.map((b) => (
          <div key={b} className="flex items-center gap-2 text-sm text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                red ? "bg-red-400" : "bg-cyan-400"
              }`}
            />
            {b}
          </div>
        ))}
      </div>

      <Link
        href={href}
        className={`mt-7 flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold ${
          red
            ? "bg-red-600 hover:bg-red-500"
            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        }`}
      >
        {button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Flow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
      {icon}
      {text}
    </span>
  );
}
