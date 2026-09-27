import { parseContactRequest } from "../../lib/contact-request";
import { fallbackLinks, guestTemplate, ownerTemplate } from "../../lib/contact-templates";
import { submissionLimited } from "../../lib/rate-limit";
import { sendWhatsAppTemplate } from "../../lib/whatsapp";

export const runtime = "nodejs";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (typeof body === "object" && body !== null && "leaveBlank" in body) {
    const leaveBlank = (body as { leaveBlank?: unknown }).leaveBlank;
    if (typeof leaveBlank === "string" && leaveBlank.trim()) {
      return Response.json({ ok: true });
    }
  }

  const payload = parseContactRequest(body);
  if (!payload) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (await submissionLimited(clientIp(request), payload.phone)) {
    return Response.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  const owner = ownerTemplate(payload);
  const ownerTo = process.env.OWNER_WHATSAPP_E164;
  if (!ownerTo) {
    return Response.json(
      { ok: false, error: "send_failed", ...fallbackLinks(payload) },
      { status: 502 },
    );
  }

  const ownerResult = await sendWhatsAppTemplate(ownerTo, owner.name, owner.parameters);
  if (!ownerResult.ok) {
    return Response.json(
      { ok: false, error: "send_failed", ...fallbackLinks(payload) },
      { status: 502 },
    );
  }

  if (process.env.GUEST_CONFIRMATION_ENABLED === "true") {
    const guest = guestTemplate(payload);
    await sendWhatsAppTemplate(payload.phone, guest.name, guest.parameters);
  }

  return Response.json({ ok: true });
}
