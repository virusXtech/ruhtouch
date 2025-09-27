# Contact Form Email Setup Guide

## Security Features Implemented

### 🔒 Server-Side Security

- **Rate Limiting**: 5 requests per 15 minutes per IP address
- **Input Validation & Sanitization**: All form data is validated and sanitized
- **Honeypot Protection**: Hidden field to catch spam bots
- **CSRF Protection**: Form validation prevents cross-site request forgery
- **Email Validation**: Comprehensive email format and domain validation
- **Content Security**: HTML content is sanitized to prevent XSS attacks

### 🛡️ Client-Side Security

- **Real-time Validation**: Input validation before form submission
- **Rate Limit Display**: User-friendly rate limit notifications
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Prevents double submissions

## Email Configuration Setup

### Step 1: Configure Environment Variables

Copy `.env.example` to `.env` and fill in your email credentials:

```bash
cp .env.example .env
```

### Step 2: Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. **Update .env file**:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   SMTP_FROM=youremail@gmail.com
   SMTP_TO=youremail@gmail.com
   ```

### Step 3: Other Email Providers

#### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=youremail@outlook.com
SMTP_PASS=your-password-here
```

#### Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=youremail@yahoo.com
SMTP_PASS=your-app-password-here
```

#### Custom SMTP

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=youremail@yourdomain.com
SMTP_PASS=your-password-here
```

## Rate Limiting Configuration

Adjust these values in your `.env` file:

```env
RATE_LIMIT_POINTS=5        # Number of requests allowed
RATE_LIMIT_DURATION=900    # Time window in seconds (900 = 15 minutes)
```

## Testing the Setup

1. **Start the development server**:

   ```bash
   yarn dev
   ```

2. **Test the contact form**:
   - Fill out the form with valid data
   - Submit and check your email
   - Try submitting multiple times to test rate limiting
   - Try submitting invalid data to test validation

## Deployment Considerations

### Environment Variables

Make sure to set all environment variables in your deployment platform:

- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Railway: Variables tab in your project

### Security Headers

Consider adding these security headers in production:

```javascript
// In your deployment configuration
{
  "Content-Security-Policy": "default-src 'self'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

## Troubleshooting

### Common Issues

1. **"Email service is not configured" error**:
   - Check that all SMTP environment variables are set
   - Verify there are no extra spaces in the .env file

2. **"SMTP configuration error"**:
   - Verify SMTP credentials are correct
   - Check if app password is required (Gmail, Yahoo)
   - Ensure 2FA is enabled and app password is generated

3. **"Too many requests" error**:
   - This is working as intended for rate limiting
   - Wait for the specified time period
   - Adjust rate limiting settings if needed

4. **Emails not being received**:
   - Check spam/junk folder
   - Verify SMTP_TO email address is correct
   - Test with a different email provider

### Development Tips

1. **Test with a dedicated test email account**
2. **Use email testing services like Mailtrap for development**
3. **Monitor server logs for detailed error messages**
4. **Test rate limiting with different IP addresses**

## Security Best Practices

1. **Never commit .env file to version control**
2. **Use app passwords instead of regular passwords**
3. **Regularly rotate SMTP credentials**
4. **Monitor for unusual form submission patterns**
5. **Consider implementing CAPTCHA for additional protection**
6. **Set up email alerts for failed submissions**

## Support

If you encounter issues:

1. Check the browser console for client-side errors
2. Check server logs for API errors
3. Verify all environment variables are set correctly
4. Test SMTP connection independently
