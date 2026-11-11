import { Resend } from "resend";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sender shown to recipients, on the domain verified in Resend (RESEND_DOMAIN). Without it, Resend's
 * shared test sender is used, which only delivers to the Resend account owner's own address.
 */
export function senderAddress(domain = process.env.RESEND_DOMAIN?.trim()) {
  return `Sedcarrd <${domain ? `hello@${domain}` : "onboarding@resend.dev"}>`;
}

/**
 * Sends a transactional email through Resend (server only).
 *
 * Without RESEND_API_KEY (tests, local dev without a key) nothing is sent: the message is logged so
 * links can still be followed by hand. Resend's SDK returns `{ data, error }` instead of throwing, so
 * an API error is turned into a thrown Error here.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY is not set, not sending "${message.subject}" to ${message.to}:\n${message.text}`);
    return;
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: senderAddress(),
    to: [message.to],
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (error) throw new Error(`Resend rejected "${message.subject}" (${error.name}): ${error.message}`);
}
