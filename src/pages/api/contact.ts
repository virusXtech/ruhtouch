import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';
import * as fs from 'fs';
import * as path from 'path';
import {
  generateContactEmailTemplate,
  generateContactEmailTextTemplate,
} from '../../utils/emailTemplates';

// Load environment variables from .env file
let envVars: Record<string, string> = {};
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // Remove quotes if present
        envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    });
  }
} catch (error) {
  console.error('Error loading .env file:', error);
}

// Environment variables helper
const getEnvVar = (key: string, defaultValue: string = '') => {
  return (
    envVars[key] || process.env[key] || import.meta.env[key] || defaultValue
  );
};

// Rate limiter configuration
const rateLimiter = new RateLimiterMemory({
  points: parseInt(getEnvVar('RATE_LIMIT_POINTS', '5')), // Number of requests
  duration: parseInt(getEnvVar('RATE_LIMIT_DURATION', '900')), // Per 15 minutes (900 seconds)
});

// Input validation schema
const validateContactForm = (data: FormData) => {
  const errors: string[] = [];

  const name = data.get('name') as string;
  const email = data.get('email') as string;
  const phone = data.get('phone') as string;
  const service = data.get('service') as string;
  const message = data.get('message') as string;
  const honeypot = data.get(
    getEnvVar('HONEYPOT_FIELD_NAME', 'website')
  ) as string;

  // Honeypot check (should be empty)
  if (honeypot && honeypot.trim() !== '') {
    errors.push('Invalid submission detected');
  }

  // Name validation
  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }
  if (name && !/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    errors.push('Name contains invalid characters');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }
  if (email && email.length > 254) {
    errors.push('Email is too long');
  }

  // Phone validation (optional)
  if (phone && phone.trim() !== '') {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
    if (!validator.isMobilePhone(cleanPhone, 'any', { strictMode: false })) {
      errors.push('Invalid phone number format');
    }
  }

  // Service validation
  const validServices = [
    'family',
    'youth',
    'spiritual',
    'crisis',
    'psychotherapy',
    'career',
  ];
  if (service && !validServices.includes(service)) {
    errors.push('Invalid service selection');
  }

  // Message validation
  if (!message || message.trim().length < 10 || message.trim().length > 2000) {
    errors.push('Message must be between 10 and 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: name ? DOMPurify.sanitize(name.trim()) : '',
      email: email
        ? validator.normalizeEmail(email) || email.toLowerCase().trim()
        : '',
      phone: phone ? DOMPurify.sanitize(phone.trim()) : '',
      service: service ? DOMPurify.sanitize(service) : '',
      message: message ? DOMPurify.sanitize(message.trim()) : '',
    },
  };
};

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: parseInt(getEnvVar('SMTP_PORT', '587')),
    secure: false, // true for 465, false for other ports
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASS'),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Check rate limiting
    const clientIP = clientAddress || 'anonymous';

    try {
      await rateLimiter.consume(clientIP);
    } catch (rateLimiterRes: any) {
      const msBeforeNext = rateLimiterRes?.msBeforeNext || 900000;
      const retryAfterSeconds = Math.round(msBeforeNext / 1000) || 900;

      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: retryAfterSeconds,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    // Check content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse form data
    const formData = await request.formData();

    // Validate and sanitize input
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: validation.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { sanitizedData } = validation;

    // Get email configuration
    const smtpUser = getEnvVar('SMTP_USER');
    const smtpPass = getEnvVar('SMTP_PASS');
    const smtpTo = getEnvVar('SMTP_TO');
    const smtpFrom = getEnvVar('SMTP_FROM');

    const isEmailConfigured = !!smtpUser && !!smtpPass && !!smtpTo;

    // Check if email configuration is set
    if (!isEmailConfigured) {
      console.error('Email configuration is incomplete');
      return new Response(
        JSON.stringify({ error: 'Email service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create email transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP configuration error:', error);
      return new Response(
        JSON.stringify({ error: 'Email service is temporarily unavailable' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email content
    const serviceLabels: Record<string, string> = {
      family: 'Family Counseling',
      youth: 'Youth Intervention',
      spiritual: 'Spiritual Therapy',
      crisis: 'Crisis Intervention',
      psychotherapy: 'Psychotherapy',
      career: 'Career Counseling',
    };

    // Prepare email template data
    const emailData = {
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      service: sanitizedData.service,
      message: sanitizedData.message.replace(/\n/g, '\n'),
      clientIP,
      submittedAt: new Date().toLocaleString(),
      serviceLabel: sanitizedData.service
        ? serviceLabels[sanitizedData.service]
        : undefined,
    };

    const emailHtml = generateContactEmailTemplate(emailData);
    const emailText = generateContactEmailTextTemplate(emailData);

    // Send email
    const mailOptions = {
      from: `"${sanitizedData.name}" <${smtpFrom}>`,
      to: smtpTo,
      replyTo: sanitizedData.email,
      subject: `New Contact - from RuhTouch by ${sanitizedData.name}`,
      html: emailHtml,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent successfully!',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const prerender = false;
