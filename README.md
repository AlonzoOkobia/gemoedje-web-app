# Gemoedje Web App 🌟
> **A comprehensive mental health platform connecting patients with healthcare providers**

## 📖 What is Gemoedje?

Gemoedje (Dutch for "mood" or "state of mind") is a modern web application that serves as a bridge between mental health patients and healthcare providers. Think of it as a "dating app" for mental health - but instead of romantic connections, it helps people find the right mental health professional based on their specific needs, location, and preferences.

### 🎯 Key Features

- **Provider Search**: Find mental health professionals by location, specialty, insurance, and more
- **Provider Profiles**: Detailed information about healthcare providers including qualifications, specialties, and availability
- **Blog & Resources**: Educational content about mental health and wellness
- **Multi-language Support**: Available in multiple languages (currently Dutch and English)
- **Admin Dashboard**: Tools for managing providers, content, and platform operations
- **Provider Dashboard**: Tools for healthcare professionals to manage their profiles and bookings
- **Subscription Management**: Premium features for providers with Stripe integration

## 🚀 Getting Started

### For Non-Technical Users

If you're not a developer and just want to understand what this project does:

1. **This is a website** that helps people find mental health professionals
2. **It's built with modern web technology** to be fast, secure, and easy to use
3. **It supports multiple languages** so people can use it in their preferred language
4. **It has different sections** for patients, providers, and administrators
5. **It integrates with payment systems** to handle premium subscriptions

### For Developers

This is a full-stack web application built with Next.js 15, React 19, and TypeScript. It follows modern development practices and includes comprehensive tooling for development, testing, and deployment.

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library built on Radix UI
- **Framer Motion** - Animation library

### Backend & APIs

- **Next.js API Routes** - Server-side API endpoints
- **Strapi CMS** - Headless content management system
- **Stripe** - Payment processing and subscription management
- **Mapbox** - Location services and mapping

### State Management & Data

- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Internationalization

- **next-intl** - Multi-language support
- **Dynamic routing** with locale-based URLs

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message conventions
- **TypeScript** - Static type checking

## 📁 Project Structure

```
gemoedje-web-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── provider/      # Provider dashboard
│   │   │   ├── blog/          # Blog pages
│   │   │   ├── contact/       # Contact page
│   │   │   └── ...            # Other public pages
│   │   └── api/               # API endpoints
│   │       ├── auth/          # Authentication APIs
│   │       ├── providers/     # Provider management APIs
│   │       ├── stripe/        # Payment APIs
│   │       └── ...            # Other APIs
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   ├── organisms/         # Complex components
│   │   └── dialogs/           # Modal dialogs
│   ├── libs/                  # Utility libraries
│   │   ├── auth.ts            # Authentication logic
│   │   ├── api/               # API client functions
│   │   └── utils.ts           # Helper functions
│   ├── features/              # Feature-specific code
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # State management
│   ├── types/                 # TypeScript type definitions
│   ├── i18n/                  # Internationalization
│   └── styles/                # Global styles
├── public/                    # Static assets
├── package.json               # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (recommended: Node.js 20+)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gemoedje-web-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see Environment Variables section below)

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# Strapi CMS
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_token

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mapbox (for location services)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoi...

# hCaptcha (for bot protection)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key
HCAPTCHA_SECRET_KEY=your_secret_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🎯 Available Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start development server with Turbopack |
| `npm run build`      | Build the application for production    |
| `npm run start`      | Start production server                 |
| `npm run lint`       | Run ESLint to check code quality        |
| `npm run lint:fix`   | Fix ESLint issues automatically         |
| `npm run type-check` | Run TypeScript type checking            |

## 🌍 Internationalization (i18n)

The app supports multiple languages through the `next-intl` library:

- **URL Structure**: `/[locale]/page` (e.g., `/en/blog`, `/nl/blog`)
- **Supported Locales**: English (en), Dutch (nl)
- **Configuration**: Located in `src/i18n/`
- **Translation Files**: JSON files in `src/i18n/locales/`

### Adding a New Language

1. Create translation files in `src/i18n/locales/[new-locale]/`
2. Update the locale configuration in `src/i18n/config.ts`
3. Add the new locale to the middleware configuration

## 🔐 Authentication & Authorization

The app uses a role-based access control system:

- **Public Users**: Can browse providers and read blog content
- **Providers**: Can manage their profiles and view bookings
- **Admins**: Can manage all providers, content, and platform settings

### Authentication Flow

1. User registers/logs in through the unified login form
2. JWT token is stored in httpOnly cookies
3. Middleware validates tokens on protected routes
4. Role-based access control determines available features

## 💳 Payment Integration

Stripe handles all payment processing:

- **Subscription Management**: Premium plans for providers
- **Webhook Handling**: Real-time subscription updates
- **Checkout Sessions**: Secure payment processing
- **Price Management**: Dynamic pricing with caching

## 🗺️ Location Services

Mapbox provides location-based features:

- **Geocoding**: Convert addresses to coordinates
- **Search Suggestions**: Location autocomplete
- **Distance Calculations**: Find providers within radius
- **Interactive Maps**: Visual location display

## 📱 Responsive Design

The app is fully responsive and works on:

- **Desktop**: Full-featured experience
- **Tablet**: Optimized for medium screens
- **Mobile**: Touch-friendly mobile interface

## 🧪 Development Workflow

### Code Quality

- **ESLint**: Enforces coding standards
- **Prettier**: Maintains consistent formatting
- **TypeScript**: Catches type errors early
- **Husky**: Pre-commit hooks for quality checks

### Git Workflow

- **Conventional Commits**: Standardized commit messages
- **Pre-commit Hooks**: Automatic code quality checks
- **Branch Protection**: Main branch protection rules

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deployment Options

- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment platform
- **Self-hosted**: Docker container deployment

### Environment Setup

1. Set production environment variables
2. Configure domain and SSL certificates
3. Set up monitoring and logging
4. Configure CDN for static assets

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **TypeScript errors**

   ```bash
   npm run type-check
   ```

3. **ESLint issues**

   ```bash
   npm run lint:fix
   ```

4. **Build failures**

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [React documentation](https://react.dev)
- Search existing issues in the repository
- Create a new issue with detailed information

### For Developers

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with conventional format**: `git commit -m "feat: add amazing feature"`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Include tests for new features
- Update documentation as needed
- Be respectful and inclusive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

_Last updated: August 2025_
