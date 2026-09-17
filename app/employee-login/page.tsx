"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLogin() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/employee-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid employee credentials.");
        setLoading(false);
        return;
      }

      router.push("/bank-security");
      router.refresh();
    } catch {
      setError("Unable to connect to the security system.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10">
            <span className="text-2xl font-bold text-blue-400">
              CB
            </span>
          </div>

          <h1 className="text-3xl font-bold">
            CyberBank Security
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Employee Security Operations Portal
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-[#0d1a2b] p-7 shadow-2xl">

          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-green-400">
              ● Secure Employee Access
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              Sign in to Security Operations
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Authorized CyberBank employees can access security
              alerts, investigations and response controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Employee ID
              </label>

              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="SOC001"
                required
                className="w-full rounded-lg border border-slate-600 bg-[#081321] px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="CyberBank@2026"
                required
                className="w-full rounded-lg border border-slate-600 bg-[#081321] px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {loading
                ? "Authenticating..."
                : "Access Security Operations"}
            </button>

          </form>

          <div className="mt-6 rounded-lg border border-slate-700 bg-[#081321] p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hackathon Demo Credentials
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  Employee ID
                </span>
                <span className="font-mono text-blue-300">
                  SOC001
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Password
                </span>
                <span className="font-mono text-blue-300">
                  CyberBank@2026
                </span>
              </div>
            </div>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          CYBERARENA • CyberBank Security Simulation
        </p>

      </div>
    </main>
  );
}