import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validate-contact";
import { profile } from "@/lib/profile";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Email me directly for now." },
      { status: 503 },
    );
  }

  const { name, email, message } = result.data;
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 502 },
    );
  }
}
