# CyberArena Banking Edition

## Included
- Realistic fictional CyberBank customer website
- Customer login risk simulation
- Customer-side security alert popup for suspicious login
- Detailed CyberBank Security Operations employee console
- Live clock (no hard-coded event time)
- Synthetic incident storage in browser localStorage
- Cross-tab storage-event refresh for the employee console
- Investigation timeline
- Simulated Lock Account / Contain and Dismiss actions
- Controlled Red Team Login Anomaly simulation

## Run
1. Extract the ZIP.
2. Open the extracted folder in VS Code/Antigravity.
3. Run:
   npm install
   npm run dev
4. Open http://localhost:3000

## Demo
1. Open http://localhost:3000/bank-security in one tab.
2. Open http://localhost:3000/red-team in another tab.
3. Launch "Unauthorized Login".
4. The employee console receives the incident and shows the security compromise popup.
5. Click "Lock account & contain" to demonstrate the response.
6. Alternatively open http://localhost:3000/login and select New device + Unrecognized location to trigger the customer security popup.

All banking information, customers, IP addresses and response actions are fictional and for controlled training only.


## AI Security Advisor
The customer portal now includes a Security Advisor chatbot. It answers defensive questions about:
- suspicious/unauthorized logins
- account takeover prevention
- incident-response steps
- employee/admin portal compromise
- protecting data after possible unauthorized access
- containment, credential/session rotation, logs, backups and monitoring

### Optional real AI mode
The project runs without an API key using a built-in defensive fallback, so the hackathon demo works immediately.
For AI-generated answers, create a `.env.local` file:

OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-luna

Then restart `npm run dev`.

Never put API keys in client-side code or commit `.env.local`.


## Advisor / Detection separation
The AI Security Advisor does NOT detect attacks or determine whether the website/account is compromised.
The separate CyberBank security engine creates the security alert.

When an ACTIVE security alert already exists, the customer portal reads that existing alert and passes limited alert context to the advisor. This lets the advisor answer questions such as “Why did I get this alert?” and “What should I do now?” without pretending that the AI detected the incident.

The advisor receives only safe contextual fields such as classification, risk score and detection reasons. It is explicitly instructed not to request passwords, OTPs, card numbers or other secrets.


## Final AI Advisor behavior
- Detection is handled by the separate CyberBank security system.
- The AI chatbot is an advisor only.
- If an ACTIVE security alert already exists, the customer portal supplies limited alert context to the advisor.
- If the customer asks “Is there a security alert?”, “Why was I flagged?”, “Was this login suspicious?”, etc., the advisor can report/explain the already-generated alert.
- If no alert is supplied, the advisor does not invent one and states that it has no active alert available.
- The AI never claims that it detected the incident.


## Data Exposure Demonstration
CyberArena now distinguishes a suspicious login from evidence of protected-data
access. The controlled Red Team page has three synthetic scenarios:
1. Suspicious Login — no protected data access.
2. Login + Data Access — synthetic customer profile and transaction history access,
   classified as POTENTIAL DATA COMPROMISE.
3. Simulated Data Export — adds a synthetic export event, classified as
   CONFIRMED SIMULATED EXPOSURE.

The employee Security Operations page shows a Data Exposure Assessment and a
correlated investigation timeline. No real customer data or external systems are
used.


## UI + AI Advisor Update
The Red Team console now has a dedicated red offensive-simulation visual identity.
The Blue Team console uses a dark technical SOC interface with live incident,
session-intelligence and data-exposure panels.

The AI Security Advisor uses question-specific fallback responses and a stricter
prompt so it does not repeat the same opening lines. It remains an advisor only:
it explains an existing alert supplied by the security system and does not perform
detection itself.

## Vulnerability Simulation Labs

The Red Team console now includes three additional controlled web-security labs:
- SQL Injection Lab — generates synthetic SQL-injection telemetry for a fictional account-search endpoint. No SQL is executed and no database is queried.
- IDOR / BOLA Lab — generates synthetic object-level authorization telemetry for another fictional account object. No real authorization boundary is bypassed.
- Stored XSS Lab — generates synthetic stored-content telemetry for a fictional support-message flow. The demonstration marker is never rendered as executable HTML/JavaScript.

Each lab creates a `SecurityIncident` with an attack type, endpoint/object context, deterministic detection reasons and an investigation timeline entry. The Blue Team SOC displays the vulnerability class, target, detection mode and non-executing status.

These are training simulations rather than exploitable vulnerable services. The application remains restricted to fictional CyberBank data and browser-side synthetic telemetry.
