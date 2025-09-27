// Email template renderer for contact notifications

// Minimal HTML-escape for safe injection into email templates
const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function renderContactEmail({ data, clientIP }) {
  const serviceLabels = {
    family: 'Family Counseling',
    youth: 'Youth Intervention',
    spiritual: 'Spiritual Therapy',
    crisis: 'Crisis Intervention',
    psychotherapy: 'Psychotherapy',
    career: 'Career Counseling',
  };

  const serviceLabel = serviceLabels[data.service] || 'Not specified';
  const submitted = new Date().toLocaleString();
  const preheader = `New contact from ${data.name} — ${serviceLabel}`;

  const subject = `📩 New Contact — ${serviceLabel} — ${data.name}`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Contact — RuhTouch</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .bg-white { background-color: #0b0f12 !important; }
        .text-default { color: #e5e7eb !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f3f4f6;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#ffffff; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.06); overflow:hidden;">
            <tr>
              <td style="background:#10b981; padding:20px 24px;">
                <h1 style="margin:0; font-family:Segoe UI, Roboto, Arial, sans-serif; font-size:20px; color:#ffffff;">RuhTouch — New Contact</h1>
                <p style="margin:4px 0 0; font-family:Segoe UI, Roboto, Arial, sans-serif; font-size:13px; color:#dcfce7;">Secure message notification</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px; font-family:Segoe UI, Roboto, Arial, sans-serif; color:#111827;">
                <p style="margin:0 0 16px; font-size:16px;">You have received a new contact request via your website.</p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-spacing:0; margin:0 0 16px;">
                  <tr>
                    <td style="padding:8px 0; width:140px; color:#6b7280; font-size:13px;">Name</td>
                    <td style="padding:8px 0; font-weight:600; font-size:14px;">${escapeHtml(data.name)}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; width:140px; color:#6b7280; font-size:13px;">Email</td>
                    <td style="padding:8px 0; font-size:14px;"><a href="mailto:${encodeURIComponent(data.email)}" style="color:#0ea5e9; text-decoration:none;">${escapeHtml(data.email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; width:140px; color:#6b7280; font-size:13px;">Phone</td>
                    <td style="padding:8px 0; font-size:14px;">${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color:#0ea5e9; text-decoration:none;">${escapeHtml(data.phone)}</a>` : 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; width:140px; color:#6b7280; font-size:13px;">Service</td>
                    <td style="padding:8px 0; font-size:14px;">${escapeHtml(serviceLabel)}</td>
                  </tr>
                </table>

                <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:8px 0 16px;">
                  <div style="font-size:13px; color:#6b7280; margin-bottom:6px;">Message</div>
                  <div style="white-space:pre-wrap; font-size:15px; line-height:1.6; color:#111827;">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;">
                  <tr>
                    <td>
                      <a href="mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent('Re: RuhTouch inquiry')}&body=${encodeURIComponent('\n\n— Sent from RuhTouch')}" style="display:inline-block; background:#10b981; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:9999px; font-size:14px; font-weight:600;">Reply to ${escapeHtml(data.name)}</a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0; font-size:12px; color:#6b7280;">Submitted: ${escapeHtml(submitted)} · IP: ${escapeHtml(clientIP)}</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f9fafb; padding:16px 24px; text-align:center;">
                <p style="margin:0; font-family:Segoe UI, Roboto, Arial, sans-serif; font-size:12px; color:#6b7280;">This email was sent by the RuhTouch website contact form. Please do not share sensitive information via email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  const text = [
    'New Contact — RuhTouch',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Service: ${serviceLabel}`,
    '',
    'Message:',
    data.message,
    '',
    '—',
    `Submitted: ${submitted}`,
    `IP: ${clientIP}`,
    '',
    `Reply: mailto:${data.email}`,
  ].join('\n');

  return { subject, html, text };
}
