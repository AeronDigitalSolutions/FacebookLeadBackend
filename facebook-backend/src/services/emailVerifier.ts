import validator from "validator";
import dns from "dns/promises";

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
];

const ROLE_PREFIXES = [
  "admin",
  "support",
  "info",
  "sales",
  "contact",
  "help",
];

export const verifyEmail = async (email: string) => {
  const result = {
    email,
    isValid: true,
    status: "valid" as "valid" | "risky" | "invalid",
    reasons: [] as string[],
  };

  // 1️⃣ Syntax check
  if (!validator.isEmail(email)) {
    result.isValid = false;
    result.status = "invalid";
    result.reasons.push("Invalid email format");
    return result;
  }

  const [localPart, domain] = email.split("@");

  // 2️⃣ Role-based check
  if (ROLE_PREFIXES.includes(localPart.toLowerCase())) {
    result.status = "risky";
    result.reasons.push("Role-based email");
  }

  // 3️⃣ Disposable domain check
  if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) {
    result.isValid = false;
    result.status = "invalid";
    result.reasons.push("Disposable email domain");
    return result;
  }

  // 4️⃣ MX record check
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      result.isValid = false;
      result.status = "invalid";
      result.reasons.push("No MX records found");
      return result;
    }
  } catch {
    result.isValid = false;
    result.status = "invalid";
    result.reasons.push("Domain does not exist");
    return result;
  }

  // 5️⃣ SMTP-level check (SAFE MODE)
  // We do NOT send RCPT TO to avoid spam flags
  result.reasons.push("Mailbox existence not fully verifiable (safe mode)");

  return result;
};
