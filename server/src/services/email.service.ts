import { env } from '../config/env'

/**
 * Sends the "you got a new contact message" notification to the portfolio
 * owner via Resend (https://resend.com) — a transactional email provider
 * with a single plain HTTPS endpoint, so this needs nothing beyond the
 * `fetch` that's already used elsewhere in this codebase (see
 * services/github.service.ts). No SMTP client, no new npm dependency.
 *
 * This is intentionally the *only* file that knows about Resend. The
 * Message controller calls `sendContactNotification` and nothing else —
 * swapping providers later means editing this file, not the controller.
 */

const RESEND_API_URL = 'https://api.resend.com/emails'

export interface ContactNotificationInput {
  name: string
  email: string
  subject?: string
  message: string
  messageId: string
}

export interface EmailResult {
  sent: boolean
  /** Short, safe-to-log reason when `sent` is false. Never the provider's raw error body. */
  reason?: string
}

/** Minimal HTML-escaping — visitor-provided content is never trusted enough to inline raw. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildHtml(input: ContactNotificationInput): string {
  const subject = input.subject ? escapeHtml(input.subject) : '(no subject)'
  // Preserve line breaks in the message without allowing any other HTML through.
  const messageHtml = escapeHtml(input.message).replace(/\n/g, '<br />')

  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; font-size: 15px; color: #111;">
      <h2 style="margin: 0 0 16px;">New portfolio contact message</h2>
      <p style="margin: 0 0 4px;"><strong>From:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin: 0 0 4px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${subject}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <p style="margin: 0 0 16px; white-space: pre-wrap;">${messageHtml}</p>
      <p style="margin: 0; color: #666; font-size: 13px;">Received ${new Date().toLocaleString('en-US')}</p>
    </div>
  `.trim()
}

function buildText(input: ContactNotificationInput): string {
  return [
    'New portfolio contact message',
    '',
    `From: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject || '(no subject)'}`,
    '',
    'Message:',
    input.message,
    '',
    `Received: ${new Date().toLocaleString('en-US')}`,
  ].join('\n')
}

/**
 * Fire-and-report — never throws. The caller (Message controller) must be
 * able to save a message successfully even when this fails, so every
 * failure mode here resolves to `{ sent: false }` with a safe, generic
 * reason instead of propagating an error.
 */
export async function sendContactNotification(input: ContactNotificationInput): Promise<EmailResult> {
  if (!env.resendApiKey || !env.contactNotificationEmail) {
    return { sent: false, reason: 'not configured' }
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.emailFrom,
        to: [env.contactNotificationEmail],
        reply_to: input.email,
        subject: `New portfolio message${input.subject ? `: ${input.subject}` : ''}`,
        html: buildHtml(input),
        text: buildText(input),
      }),
    })

    if (!res.ok) {
      // Log status only — the response body may echo back request details
      // we'd rather not put in logs, and it's not actionable for callers.
      console.error(`[email] contact notification failed — Resend responded ${res.status}`)
      return { sent: false, reason: `provider error ${res.status}` }
    }

    console.log(`[email] contact notification sent for message ${input.messageId}`)
    return { sent: true }
  } catch (err) {
    console.error('[email] contact notification failed:', err instanceof Error ? err.message : err)
    return { sent: false, reason: 'network error' }
  }
}
