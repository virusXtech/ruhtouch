# 🌿 RuhTouch - Mental Health & Spiritual Wellness Platform

A modern, responsive website for mental health and spiritual counseling services, built with Astro, TypeScript, and Tailwind CSS. Features a secure contact form with Netlify Functions for backend processing.

## ✨ Features

### 🎨 **Frontend**

- **Static Site Generation**: Lightning-fast loading with Astro static build
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Interactive Components**: Smooth animations with AOS (Animate On Scroll)
- **Accessibility**: WCAG compliant with proper semantic HTML

### 🔒 **Secure Contact Form**

- **Netlify Functions**: Serverless backend with automatic scaling
- **Advanced Security**: Rate limiting, honeypot protection, input sanitization
- **Real-time Validation**: Client-side and server-side validation
- **Professional Emails**: HTML email templates with responsive design
- **User Experience**: Form hiding on success with "Send Another Message" option
- **Spam Protection**: Multiple layers of bot and spam prevention

### ⚡ **Performance**

- **Static Site Generation**: Instant page loads and CDN optimization
- **Serverless Functions**: Contact form processing only when needed
- **Type Safety**: Full TypeScript implementation
- **Modern Build**: Optimized for production deployment

## 🚀 Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   └── assets/            # Static images and files
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── Contact.astro  # Secure contact form with validation
│   │   ├── Header.astro   # Navigation header
│   │   ├── Hero.astro     # Hero section
│   │   ├── About.astro    # About section
│   │   ├── Services.astro # Services showcase
│   │   ├── Testimonials.astro # Client testimonials
│   │   └── Footer.astro   # Site footer
│   ├── data/             # Static data files
│   │   ├── services.ts   # Service offerings data
│   │   └── testimonials.ts # Client testimonials data
│   ├── layouts/
│   │   └── Layout.astro  # Base layout with meta tags and scripts
│   └── pages/
│       └── index.astro   # Homepage
├── netlify/
│   └── functions/
│       └── contact.js    # Serverless contact form handler
├── dist/                 # Static build output (generated)
├── netlify.toml         # Netlify deployment configuration
└── package.json
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Astro](https://astro.build) v5.14.1 - Static Site Generator
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Forms**: [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) - Form styling
- **Icons**: [Lucide Astro](https://lucide.dev/) - Beautiful icon library
- **Animations**: [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll library

### Backend (Netlify Functions)

- **Runtime**: Node.js serverless functions
- **Email**: [Nodemailer](https://nodemailer.com/) - Email sending service
- **Security**: [Rate Limiter Flexible](https://github.com/animir/node-rate-limiter-flexible) - Rate limiting
- **Deployment**: [Netlify](https://netlify.com/) - Static hosting + serverless functions

## 🧞 Commands

All commands are run from the root of the project using Yarn:

| Command             | Action                                       |
| :------------------ | :------------------------------------------- |
| `yarn install`      | Installs dependencies                        |
| `yarn dev`          | Starts local dev server at `localhost:4321`  |
| `yarn build`        | Build your production site to `./dist/`      |
| `yarn preview`      | Preview your build locally, before deploying |
| `yarn lint`         | Run ESLint to check code quality             |
| `yarn lint:fix`     | Fix auto-fixable ESLint issues               |
| `yarn format`       | Format code with Prettier                    |
| `yarn format:check` | Check if code is properly formatted          |
| `yarn check`        | Run both linting and format checks           |
| `yarn fix`          | Fix linting and formatting issues            |

## ⚙️ Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/virusXtech/ruhtouch.git
   cd ruhtouch
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your email configuration
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

5. **Visit your site**
   Open `http://localhost:4321` in your browser

## 📧 Contact Form Setup

The contact form uses Netlify Functions for secure server-side processing. You'll need to configure environment variables in your Netlify dashboard.

### Environment Variables Setup

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Environment Variables
2. **Add the following variables**:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   SMTP_FROM=youremail@gmail.com
   SMTP_TO=youremail@gmail.com
   ```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**: Google Account → Security → 2-Step Verification → App passwords
3. **Use the App Password** as `SMTP_PASS` (not your regular password)

### Other Email Providers

**Outlook/Hotmail:**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo Mail:**

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**Custom SMTP:**

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
```

## 🔒 Security Features

### 🛡️ Contact Form Security

- **Rate Limiting**: 5 requests per 15 minutes per IP address
- **Honeypot Protection**: Hidden fields to catch spam bots
- **Input Sanitization**: All form data sanitized to prevent XSS attacks
- **Email Validation**: Comprehensive format and domain validation
- **Real-time Validation**: Client-side validation with server-side verification
- **Error Handling**: Secure error messages that don't expose sensitive data

### 🔐 Function Security

- **Environment Variables**: Sensitive data stored securely in Netlify
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: Multiple layers of data validation
- **Spam Detection**: Advanced bot detection mechanisms

## 🚀 Deployment

### Netlify (Recommended)

This project is optimized for Netlify deployment with automatic builds and serverless functions.

#### Option 1: Git Integration (Recommended)

1. **Connect your repository** to Netlify
2. **Set build command**: `yarn build`
3. **Set publish directory**: `dist`
4. **Add environment variables** in Site Settings → Environment Variables
5. **Deploy automatically** on every git push

#### Option 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
yarn build
netlify deploy --prod --dir=dist
```

### Other Platforms

**Note**: For other platforms, you'll need to set up the contact form differently as Netlify Functions are platform-specific.

**Vercel**: Would require converting the Netlify function to Vercel API routes  
**Cloudflare Pages**: Would require converting to Cloudflare Workers  
**Traditional Hosting**: Would need a separate backend service for the contact form

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Site**: [ruhtouch.com](https://ruhtouch.com) _(replace with actual URL)_
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)
- **Netlify Functions**: [docs.netlify.com/functions](https://docs.netlify.com/functions/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)

## 📞 Support

For support and questions:

- 📧 Email: [Contact Email](mailto:contact@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/virusXtech/ruhtouch/issues)

---

Built with ❤️ by [virusXtech](https://github.com/virusXtech)
