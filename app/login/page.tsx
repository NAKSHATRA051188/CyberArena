"use client";

import { useState } from "react";
import Link from "next/link";
import { demoIncident } from "../../lib/security";

type Result = {
  level: "LEGITIMATE" | "REVIEW" | "UNAUTHORIZED";
  score: number;
  reasons: string[];
};

function assess(
  newDevice: boolean,
  unknownLocation: boolean,
  failed: number
): Result {
  let score = 5;
  const reasons: string[] = [];

  if (newDevice) {
    score += 35;
    reasons.push("New device fingerprint");
  }

  if (unknownLocation) {
    score += 40;
    reasons.push("Unrecognized sign-in location");
  }

  if (failed > 0) {
    score += Math.min(20, failed * 10);
    reasons.push(
      `${failed} failed sign-in attempt${failed > 1 ? "s" : ""}`
    );
  }

  if (score >= 80) {
    return {
      level: "UNAUTHORIZED",
      score,
      reasons,
    };
  }

  if (score >= 40) {
    return {
      level: "REVIEW",
      score,
      reasons,
    };
  }

  return {
    level: "LEGITIMATE",
    score,
    reasons,
  };
}

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [newDevice, setNewDevice] = useState(false);
  const [unknownLocation, setUnknownLocation] = useState(false);
  const [failed, setFailed] = useState(0);

  const [result, setResult] = useState<Result | null>(null);

  function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const r = assess(newDevice, unknownLocation, failed);

    /*
     * Legitimate login:
     * Redirect directly to the CyberBank customer portal.
     */
    if (r.level === "LEGITIMATE") {
      window.location.href = "/cyberbank";
      return;
    }

    /*
     * Suspicious login:
     * Show the security alert and create a synthetic
     * security incident for the Blue Team SOC.
     */
    setResult(r);

    const incident = demoIncident();

    incident.risk = r.score;
    incident.classification = r.level;

    incident.reasons =
      r.reasons.length > 0 ? r.reasons : incident.reasons;

    incident.timestamp = new Date().toISOString();

    localStorage.setItem(
      "cyberbank_security_incident",
      JSON.stringify(incident)
    );

    localStorage.setItem(
      "cyberbank_security_broadcast",
      Date.now().toString()
    );
  }

  return (
    <main className="min-h-screen bg-[#eef1f5]">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/cyberbank"
            className="text-xl font-bold text-[#123b63]"
          >
            CYBERBANK
          </Link>

          <span className="text-sm text-slate-500">
            Secure Online Banking
          </span>
        </div>
      </header>

      {/* Login area */}
      <div className="mx-auto flex min-h-[calc(100vh-70px)] max-w-6xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-soft">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Sign in
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter your CyberBank demo credentials.
            </p>
          </div>

          <form onSubmit={signIn} className="space-y-4">
            {/* Customer ID */}
            <label className="block text-sm font-semibold text-slate-800">
              Customer ID

              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="mt-2 w-full rounded-lg border p-3 outline-none transition focus:border-blue-500"
                placeholder="krishna"
              />
            </label>

            {/* Password */}
            <label className="block text-sm font-semibold text-slate-800">
              Password

              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-lg border p-3 outline-none transition focus:border-blue-500"
                placeholder="CyberBank@123"
              />
            </label>

            {/* Security simulation controls */}
            <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="font-semibold text-slate-900">
                Demo security signals
              </div>

              <label className="flex cursor-pointer gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={newDevice}
                  onChange={(e) =>
                    setNewDevice(e.target.checked)
                  }
                />

                <span>New / unrecognized device</span>
              </label>

              <label className="flex cursor-pointer gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={unknownLocation}
                  onChange={(e) =>
                    setUnknownLocation(e.target.checked)
                  }
                />

                <span>Unrecognized location</span>
              </label>

              <label className="block text-slate-700">
                Previous failed attempts

                <select
                  value={failed}
                  onChange={(e) =>
                    setFailed(Number(e.target.value))
                  }
                  className="ml-2 rounded border p-1"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </label>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#123b63] py-3 font-semibold text-white transition hover:bg-[#0e3152]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Training simulation only • No real credentials are
            transmitted.
          </p>
        </div>
      </div>

      {/* Security Alert Modal */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Alert header */}
            <div className="border-b p-6">
              <div className="text-sm font-bold tracking-wide text-red-600">
                SECURITY ALERT
              </div>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Unusual sign-in detected
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                CyberBank has automatically protected this session
                because the sign-in pattern requires security review.
              </p>
            </div>

            {/* Risk information */}
            <div className="grid grid-cols-2 gap-3 p-6 text-sm">
              <div className="rounded-lg bg-slate-50 p-4">
                <span className="text-slate-500">
                  Risk score
                </span>

                <div className="mt-1 text-xl font-bold text-red-600">
                  {result.score}/100
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <span className="text-slate-500">
                  Classification
                </span>

                <div className="mt-1 font-bold text-slate-900">
                  {result.level}
                </div>
              </div>
            </div>

            {/* Detection reasons */}
            <div className="px-6 pb-5">
              <div className="text-sm font-semibold text-slate-900">
                Why this was flagged
              </div>

              {result.reasons.length > 0 ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {result.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  The sign-in pattern requires additional review.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t p-6">
              <Link
                href="/bank-security"
                className="flex-1 rounded-lg bg-[#123b63] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0e3152]"
              >
                Open Security Operations
              </Link>

              <button
                type="button"
                onClick={() => setResult(null)}
                className="rounded-lg border px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}