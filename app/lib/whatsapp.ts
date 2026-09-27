export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  parameters: string[],
): Promise<{ ok: boolean }> {
  const digits = to.replace(/^\+/, "");
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_API_VERSION;

  if (!token || !phoneNumberId || !version) {
    return { ok: false };
  }

  const response = await fetch(
    `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: digits,
        type: "template",
        template: {
          name: templateName,
          language: { code: "sr" },
          components: [
            {
              type: "body",
              parameters: parameters.map((text) => ({ type: "text", text })),
            },
          ],
        },
      }),
    },
  );

  await response.json().catch(() => null);
  return { ok: response.ok };
}
