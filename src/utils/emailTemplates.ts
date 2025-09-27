interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

interface EmailTemplateData extends ContactFormData {
  clientIP: string;
  submittedAt: string;
  serviceLabel?: string;
}

export const generateContactEmailTemplate = (
  data: EmailTemplateData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background-color: #059669; 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content { 
          background-color: #ffffff; 
          padding: 30px 20px; 
        }
        .field { 
          margin-bottom: 20px; 
          padding: 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #059669;
          border-radius: 4px;
        }
        .field strong { 
          color: #059669; 
          font-weight: 600;
          display: inline-block;
          min-width: 120px;
        }
        .field-content {
          margin-top: 5px;
          color: #333;
        }
        .message-content {
          background-color: #ffffff;
          padding: 15px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          margin-top: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 14px; 
          color: #6c757d;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        .meta-info {
          font-size: 12px;
          color: #6c757d;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 0;
            border-radius: 0;
          }
          .content, .header {
            padding: 20px 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <strong>Name:</strong>
            <div class="field-content">${data.name}</div>
          </div>
          
          <div class="field">
            <strong>Email:</strong>
            <div class="field-content">
              <a href="mailto:${data.email}" style="color: #059669; text-decoration: none;">${data.email}</a>
            </div>
          </div>
          
          ${
            data.phone
              ? `
            <div class="field">
              <strong>Phone:</strong>
              <div class="field-content">
                <a href="tel:${data.phone}" style="color: #059669; text-decoration: none;">${data.phone}</a>
              </div>
            </div>
          `
              : ''
          }
          
          ${
            data.service
              ? `
            <div class="field">
              <strong>Service Interested In:</strong>
              <div class="field-content">${data.serviceLabel || data.service}</div>
            </div>
          `
              : ''
          }
          
          <div class="field">
            <strong>Message:</strong>
            <div class="message-content">${data.message}</div>
          </div>
          
          <div class="field meta-info">
            <strong>Submission Details:</strong>
            <div class="field-content">
              <div><strong>IP Address:</strong> ${data.clientIP}</div>
              <div><strong>Submitted:</strong> ${data.submittedAt}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent from your website contact form.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            Please reply directly to this email to respond to the sender.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateContactEmailTextTemplate = (
  data: EmailTemplateData
): string => {
  return `
New Contact Form Submission
===========================

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.serviceLabel || data.service || 'Not specified'}

Message:
--------
${data.message}

Submission Details:
------------------
IP Address: ${data.clientIP}
Submitted: ${data.submittedAt}

---
This message was sent from your website contact form.
Please reply directly to this email to respond to the sender.
  `.trim();
};
