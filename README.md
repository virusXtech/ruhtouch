# 🌿 RuhTouch - Mental Health & Spiritual Wellness Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/df745c2a-f6a8-4008-93cb-e7add3579136/deploy-status)](https://app.netlify.com/projects/ruhtouch/deploys)

A modern, responsive website for mental health and spiritual counseling services, built with Astro, TypeScript, and Tailwind CSS. Features a secure contact form with advanced spam protection and email notifications.

## ✨ Features

### 🎨 **Frontend**

- **Responsive Design**: Mobile-first approach with beautiful animations
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Interactive Components**: Smooth animations with AOS (Animate On Scroll)
- **Accessibility**: WCAG compliant with proper semantic HTML

### 🔒 **Secure Contact Form**

- **Advanced Security**: Rate limiting, honeypot protection, input sanitization
- **Real-time Validation**: Client-side and server-side validation
- **Professional Emails**: HTML email templates with responsive design
- **User Experience**: Form hiding on success with "Send Another Message" option
- **Spam Protection**: Multiple layers of bot and spam prevention

### ⚡ **Performance**

- **Server-Side Rendering**: Astro SSR for optimal performance
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
│   ├── pages/
│   │   ├── index.astro   # Homepage
│   │   └── api/          # Server-side API endpoints
│   │       └── contact.ts # Secure contact form handler
│   └── utils/
│       └── emailTemplates.ts # Professional email templates
├── .env.example          # Environment variables template
├── .env                  # Your environment configuration
├── CONTACT_SETUP.md      # Detailed setup instructions
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) v5.14.1 - Static Site Generator with SSR
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Forms**: [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) - Form styling
- **Icons**: [Lucide Astro](https://lucide.dev/) - Beautiful icon library
- **Animations**: [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll library
- **Email**: [Nodemailer](https://nodemailer.com/) - Email sending service
- **Security**:
  - [Rate Limiter Flexible](https://github.com/animir/node-rate-limiter-flexible) - Rate limiting
  - [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization
  - [Validator](https://github.com/validatorjs/validator.js/) - Input validation

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

The contact form includes enterprise-level security and requires email configuration. See [CONTACT_SETUP.md](./CONTACT_SETUP.md) for detailed setup instructions.

### Quick Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**: Google Account > Security > 2-Step Verification > App passwords
3. **Update .env file**:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-email@gmail.com
   SMTP_TO=your-email@gmail.com
   ```

## 🔒 Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP address
- **Honeypot Protection**: Hidden fields to catch spam bots
- **Input Sanitization**: All form data sanitized to prevent XSS
- **Email Validation**: Comprehensive format and domain validation
- **CSRF Protection**: Form validation prevents cross-site requests
- **Error Handling**: Secure error messages that don't expose sensitive data

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
yarn build
netlify deploy --prod --dir=dist
```

### Manual Deployment

```bash
# Build for production
yarn build

# Upload the dist/ folder to your hosting provider
```

**Important**: Set environment variables in your deployment platform:

- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables

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
- **Documentation**: [Astro Docs](https://docs.astro.build)
- **Contact Setup**: [CONTACT_SETUP.md](./CONTACT_SETUP.md)

## 📞 Support

For support and questions:

- 📧 Email: [faisalismoodie@gmail.com](mailto:faisalismoodie@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/virusXtech/ruhtouch/issues)

---

Built with ❤️ by [virusXtech](https://github.com/virusXtech)
