export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export type ValidateResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: unknown): ValidateResult {
  const errors: ContactErrors = {};
  const v = (input ?? {}) as Record<string, unknown>;
  const name = typeof v.name === "string" ? v.name.trim() : "";
  const email = typeof v.email === "string" ? v.email.trim() : "";
  const message = typeof v.message === "string" ? v.message.trim() : "";

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Message must be at least 10 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}
