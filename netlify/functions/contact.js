import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { renderContactEmail } from './templates/contactEmail.js';

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes (900 seconds)
});

// Email validation
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input
const sanitize = input => {
  if (!input) return '';
  return input
    .toString()
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OK' }),
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Rate limiting
    const clientIP =
      event.headers['x-forwarded-for'] ||
      event.headers['x-real-ip'] ||
      'anonymous';

    try {
      await rateLimiter.consume(clientIP);
    } catch (rateLimiterRes) {
      const retryAfterSeconds = Math.round(
        (rateLimiterRes.msBeforeNext || 900000) / 1000
      );
      return {
        statusCode: 429,
        headers: {
          ...headers,
          'Retry-After': String(retryAfterSeconds),
        },
        body: JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: retryAfterSeconds,
        }),
      };
    }

    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }

    // Validate required fields
    const { name, email, phone, service, message, honeypot } = body;

    // Honeypot check
    if (honeypot && honeypot.trim() !== '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid submission detected' }),
      };
    }

    // Validation
    const errors = [];

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      errors.push('Name must be between 2 and 100 characters');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Valid email is required');
    }

    if (
      !message ||
      message.trim().length < 10 ||
      message.trim().length > 2000
    ) {
      errors.push('Message must be between 10 and 2000 characters');
    }

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Validation failed', details: errors }),
      };
    }

    // Sanitize data
    const sanitizedData = {
      name: sanitize(name),
      email: sanitize(email).toLowerCase(),
      phone: sanitize(phone),
      service: sanitize(service),
      message: sanitize(message),
    };

    // Check email configuration
    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_TO
    ) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service is not configured' }),
      };
    }

    // Create email transporter
    const transporter = createTransporter();

    // Verify transporter
    await transporter.verify();

    // Render email using template module
    const {
      subject,
      html: emailHtml,
      text: emailText,
    } = renderContactEmail({
      data: sanitizedData,
      clientIP,
    });

    // Send email
    const mailOptions = {
      from: `"${sanitizedData.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: sanitizedData.email,
      subject,
      html: emailHtml,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Your message has been sent successfully!',
      }),
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.',
      }),
    };
  }
};
