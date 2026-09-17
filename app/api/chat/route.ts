import { NextResponse } from "next/server";
import OpenAI from "openai";

const fallback = (message: string, alert: any) => {
  const q = message.toLowerCase();

  if (alert?.active && /(alert|flag|suspicious|unauthor|incident|compromis)/.test(q)) {
    const classification = alert.classification || "security alert";
    const risk = alert.risk != null ? `risk score ${alert.risk}/100` : "elevated risk";
    const reasons = Array.isArray(alert.reasons) ? alert.reasons.slice(0, 3).join(", ") : "unusual activity";

    return `Yes. CyberBank already has an active ${classification} alert. The recorded context indicates ${risk}. The reasons include ${reasons}. I can explain the alert or walk you through defensive next steps.`;
  }

  if (/(password|otp|one[- ]time|credential|phish)/.test(q)) {
    return "Do not share your password or OTP with anyone, including someone claiming to be bank staff. If you suspect account takeover, use the bank's official recovery channel, verify recent sessions and secure the account before continuing normal activity.";
  }

  if (/(data|personal|transaction|exposed|leak|stolen)/.test(q)) {
    return alert?.active
      ? "The existing alert should be investigated for resource access, not just the login event. In CyberArena, protected-data access is tracked separately so the employee can distinguish a suspicious login from potential data exposure."
      : "A suspicious login does not by itself prove that data was accessed. A proper investigation should correlate the session with protected-resource access, downloads or exports before concluding that data was exposed.";
  }

  if (/(employee|admin|staff|portal)/.test(q)) {
    return "If an employee or administrator account is suspected of compromise, isolate the session, verify the account owner through an approved channel, review privileged actions and rotate affected credentials according to the organization's incident-response process.";
  }

  if (/(what should i do|next|help|respond|recover|recovery)/.test(q)) {
    return "Start with containment: avoid further interaction with the suspicious session, verify the account owner, review recent activity and preserve the incident record. Then investigate which resources were accessed before restoring normal access.";
  }

  return "Tell me what you want to understand—this can be the existing security alert, account protection, possible data exposure, incident response, or employee/admin security. I’ll focus on that specific question.";
};

export async function POST(req: Request) {
  try {
    const { message, securityAlert } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ answer: "Please enter a security question." }, { status: 400 });
    }

    const client = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;

    if (!client) {
      return NextResponse.json({ answer: fallback(message, securityAlert) });
    }

    const system = `You are CyberBank Security Advisor.

You are an ADVISOR, not a detection engine. You must never claim that you detected an attack. The security system supplies existing alert context to you.

Current existing alert context:
${JSON.stringify(securityAlert ?? null)}

Rules:
- Answer the user's actual question directly.
- Do not repeat a fixed greeting or boilerplate introduction on every response.
- Vary wording naturally between turns.
- If an active alert exists and the user asks about it, explain the EXISTING alert using only the supplied fields.
- If there is no active alert context, never invent an alert or incident.
- A suspicious login is not proof that data was stolen. Distinguish attempted access, resource access and simulated export.
- Give defensive, practical guidance.
- Never ask for or expose passwords, OTPs, API keys or real banking secrets.
- This is a fictional training environment.`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions: system,
      input: message,
    });

    return NextResponse.json({
      answer: response.output_text || fallback(message, securityAlert),
    });
  } catch {
    return NextResponse.json({
      answer: fallback("help", null),
    });
  }
}
