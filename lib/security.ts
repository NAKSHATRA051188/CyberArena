export type DataExposureAssessment =
  | "NO_EVIDENCE"
  | "POTENTIAL"
  | "CONFIRMED_SIMULATED";

export type AttackType =
  | "SUSPICIOUS_LOGIN"
  | "DATA_ACCESS"
  | "SIMULATED_EXPORT"
  | "SQL_INJECTION"
  | "IDOR"
  | "STORED_XSS";

export type SecurityIncident = {
  id: string;
  timestamp: string;
  account: string;
  customer: string;
  risk: number;
  classification: "REVIEW" | "UNAUTHORIZED";
  device: string;
  location: string;
  ip: string;
  reasons: string[];
  status: "ACTIVE" | "CONTAINED" | "DISMISSED";
  source: string;
  attackType?: AttackType;
  attackLabel?: string;
  affectedEndpoint?: string;
  affectedObject?: string;
  responseAction?: string;
  resolvedAt?: string;
  dataExposure?: {
    accountAccessed: boolean;
    customerProfileAccessed: boolean;
    transactionHistoryAccessed: boolean;
    dataDownloaded: boolean;
    protectedDataAccessed: string[];
    assessment: DataExposureAssessment;
  };
};

function baseIncident(): SecurityIncident {
  const now = new Date().toISOString();
  return {
    id: "CB-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    timestamp: now,
    account: "CB-4821-9017",
    customer: "Krishna Agarwal",
    risk: 94,
    classification: "UNAUTHORIZED",
    device: "Windows 11 • Chrome 140 • New device",
    location: "Bengaluru, India • Unrecognized",
    ip: "203.0.113.47",
    reasons: [
      "New device fingerprint",
      "Unrecognized sign-in location",
      "High-risk session pattern",
    ],
    status: "ACTIVE",
    source: "RED TEAM / CONTROLLED SIMULATION",
    attackType: "SUSPICIOUS_LOGIN",
    attackLabel: "Suspicious Login",
    dataExposure: {
      accountAccessed: false,
      customerProfileAccessed: false,
      transactionHistoryAccessed: false,
      dataDownloaded: false,
      protectedDataAccessed: [],
      assessment: "NO_EVIDENCE",
    },
  };
}

export function demoIncident(): SecurityIncident {
  return baseIncident();
}

export function dataAccessIncident(): SecurityIncident {
  const incident = baseIncident();
  incident.risk = 98;
  incident.source = "RED TEAM / LOGIN + DATA ACCESS";
  incident.attackType = "DATA_ACCESS";
  incident.attackLabel = "Unauthorized Data Access";
  incident.reasons = [
    "New device fingerprint",
    "Unrecognized sign-in location",
    "Customer profile accessed",
    "Transaction history accessed",
  ];
  incident.dataExposure = {
    accountAccessed: true,
    customerProfileAccessed: true,
    transactionHistoryAccessed: true,
    dataDownloaded: false,
    protectedDataAccessed: ["Personal information", "Transaction history"],
    assessment: "POTENTIAL",
  };
  return incident;
}

export function simulatedExportIncident(): SecurityIncident {
  const incident = dataAccessIncident();
  incident.risk = 99;
  incident.source = "RED TEAM / SIMULATED DATA EXPORT";
  incident.attackType = "SIMULATED_EXPORT";
  incident.attackLabel = "Simulated Data Export";
  incident.reasons = [...incident.reasons, "Synthetic data export event"];
  incident.dataExposure = {
    ...incident.dataExposure!,
    dataDownloaded: true,
    assessment: "CONFIRMED_SIMULATED",
  };
  return incident;
}

/**
 * Safe SQL injection training simulation.
 * No SQL is executed and no database is queried. The scenario creates only
 * synthetic telemetry describing what a vulnerable endpoint would report.
 */
export function sqlInjectionIncident(): SecurityIncident {
  const incident = baseIncident();
  incident.risk = 97;
  incident.source = "RED TEAM / SQL INJECTION LAB";
  incident.attackType = "SQL_INJECTION";
  incident.attackLabel = "SQL Injection (Simulated)";
  incident.affectedEndpoint = "/api/demo/accounts/search";
  incident.reasons = [
    "SQL injection signature detected in synthetic request",
    "Unexpected query structure in demo account-search flow",
    "Database boundary rule triggered",
  ];
  incident.dataExposure = {
    accountAccessed: false,
    customerProfileAccessed: false,
    transactionHistoryAccessed: false,
    dataDownloaded: false,
    protectedDataAccessed: [],
    assessment: "NO_EVIDENCE",
  };
  return incident;
}

/**
 * Safe IDOR/BOLA training simulation using fictional object identifiers.
 * No real authorization boundary is bypassed.
 */
export function idorIncident(): SecurityIncident {
  const incident = baseIncident();
  incident.risk = 96;
  incident.source = "RED TEAM / IDOR-BOLA LAB";
  incident.attackType = "IDOR";
  incident.attackLabel = "IDOR / Broken Object Authorization (Simulated)";
  incident.affectedEndpoint = "/api/demo/accounts/CB-7712-4403";
  incident.affectedObject = "Synthetic account CB-7712-4403";
  incident.reasons = [
    "Object identifier changed in synthetic request",
    "Requested object belongs to another demo customer",
    "Object-level authorization rule triggered",
  ];
  incident.dataExposure = {
    accountAccessed: true,
    customerProfileAccessed: false,
    transactionHistoryAccessed: false,
    dataDownloaded: false,
    protectedDataAccessed: ["Synthetic account metadata"],
    assessment: "POTENTIAL",
  };
  return incident;
}

/**
 * Safe stored-XSS training simulation. The stored content is a non-executable
 * marker; the browser never renders it as HTML/JavaScript.
 */
export function storedXssIncident(): SecurityIncident {
  const incident = baseIncident();
  incident.risk = 95;
  incident.source = "RED TEAM / STORED XSS LAB";
  incident.attackType = "STORED_XSS";
  incident.attackLabel = "Stored XSS (Simulated)";
  incident.affectedEndpoint = "/cyberbank/support/messages";
  incident.affectedObject = "Synthetic support-message record";
  incident.reasons = [
    "Script-like content detected in synthetic message field",
    "Stored-content validation rule triggered",
    "Output-encoding policy violation simulated",
  ];
  incident.dataExposure = {
    accountAccessed: true,
    customerProfileAccessed: false,
    transactionHistoryAccessed: false,
    dataDownloaded: false,
    protectedDataAccessed: ["Synthetic support-message content"],
    assessment: "POTENTIAL",
  };
  return incident;
}
