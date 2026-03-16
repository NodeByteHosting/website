# NodeByte Hosting Platform

A modern hosting management platform built with **Next.js** and a **Go (Fiber) backend**. Manage game servers (Minecraft, Rust, Hytale), VPS nodes, and billing from a unified admin dashboard.

[![License: AGPL-3.0-only](https://img.shields.io/badge/License-AGPL%203.0%20only-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Go](https://img.shields.io/badge/Go-Fiber_Backend-00ADD8?logo=go)](https://gofiber.io/)

## Features

### Multi-Panel Game Server Hosting
- **Pterodactyl Panel** support for game servers (Minecraft, Rust, Hytale, etc.)
- **Virtfusion Panel** support for VPS management
- Multi-panel architecture -- manage multiple panels from a single dashboard
- Real-time server status monitoring across all panels
- Automatic panel API integration and connection testing
- Resource allocation and limits management

### Admin Dashboard
- **User Management** -- user listing with pagination, filtering, sorting, and role management
- **Server Management** -- browse, filter, and manage all hosted servers
- **Node Management** -- monitor and configure hosting nodes
- **Location Management** -- view and sync Pterodactyl panel locations
- **Allocation Management** -- view allocations across nodes with server assignments
- **Egg Management** -- browse synced server types and configurations
- **Sync Operations** -- real-time sync logs with terminal-style output, cancellation support, and auto-sync scheduling
- **Settings Management** -- system configuration with connection testing across four tabs (Connections, Features, Notifications, Advanced)
- **Panel Configuration** -- built-in setup wizard for connecting multiple game panels

### Webhook Notification System
Automatic Discord webhook notifications for system events, server state changes, sync operations, billing events, security alerts, and support tickets. Webhooks are managed through the admin settings panel with per-webhook type and scope configuration.

### Internationalization
- 30+ languages supported
- Translation management via Crowdin
- Modular translation file structure (`templates/en/*.json`)
- Language and currency selectors in navigation
- Region-specific pricing with multi-currency support (GBP, USD, EUR, CAD, AUD)

### Knowledge Base
- Markdown-based documentation system
- Full-text search across articles
- Category organization with sidebar navigation
- Table of contents with scroll spy
- Syntax highlighting for code blocks

### Authentication
- JWT-based authentication via Go backend
- Email/password registration and login
- Forgot password and email verification flows
- Session management with secure token handling
- Admin-only access control via middleware
- User profile management with email change and verification

### Billing
- Multi-currency support (GBP, USD, EUR, CAD, AUD)
- Pricing configuration
- Invoice management (WHMCS integration)
- Subscription tracking

## Quick Start

### Prerequisites
- Node.js 22+ or Bun
- Go backend service (see backend repository)
- Pterodactyl Game Panel (for game server hosting)
- Discord Server (for webhooks, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone --recursive https://github.com/NodeByteHosting/website.git
   cd website
   ```

   Alternatively, if you've already cloned without `--recursive`, initialize the submodule:
   ```bash
   git submodule update --init --recursive --remote
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables:
   ```bash
   NEXT_PUBLIC_GO_API_URL="http://localhost:8080"  # Go backend URL
   BACKEND_API_KEY=""                               # API key for backend communication
   JWT_SECRET=""                                    # JWT signing secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The Go backend must be running for authentication, admin operations, and panel sync to function. The Next.js frontend communicates with the backend via the `NEXT_PUBLIC_GO_API_URL`.

## Architecture

This repository contains the **Next.js frontend**. All business logic, database access, authentication, and panel sync operations are handled by a separate **Go (Fiber) backend**. The frontend acts as a client, making API calls to the backend for all data operations.

- **Frontend (this repo):** Next.js 16 with App Router, React 19, TanStack React Query for data fetching, shadcn/ui components, and Tailwind CSS v4
- **Backend (separate service):** Go Fiber API server handling database, auth, panel integrations, sync, webhooks, and admin operations

### API Communication

The frontend uses a centralized API client (`packages/core/lib/api.ts`) that routes all requests to the Go backend. Admin hooks in `packages/core/hooks/use-admin-api.ts` provide React Query wrappers for admin operations. Public data hooks are in `packages/core/hooks/use-public-api.ts`.

A small set of lightweight API routes remain in the Next.js app for public-facing proxy endpoints:
- `/api/github/releases` -- GitHub release data
- `/api/instatus` -- Status page integration
- `/api/panel/*` -- Public panel data (counts, nodes, servers, stats, users)
- `/api/trustpilot` -- Trustpilot review data

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin dashboard pages
│   │   ├── allocations/         # Allocation management
│   │   ├── eggs/                # Egg management
│   │   ├── locations/           # Location management
│   │   ├── nodes/               # Node management
│   │   ├── servers/             # Server management
│   │   ├── settings/            # System settings
│   │   ├── sync/                # Sync operations and logs
│   │   └── users/               # User management
│   ├── api/                     # Lightweight proxy routes
│   │   ├── github/releases/     # GitHub releases proxy
│   │   ├── instatus/            # Status page proxy
│   │   ├── panel/               # Public panel data
│   │   └── trustpilot/          # Trustpilot proxy
│   ├── auth/                    # Authentication pages
│   ├── changelog/               # Changelog page
│   ├── contact/                 # Contact page
│   ├── dashboard/               # User dashboard
│   │   ├── account/             # Profile and security settings
│   │   └── servers/             # User server management
│   ├── games/                   # Game-specific pages
│   ├── kb/                      # Knowledge base
│   ├── maintenance/             # Maintenance mode page
│   ├── setup/                   # Initial setup wizard
│   └── layout.tsx               # Root layout
├── packages/                    # Shared packages
│   ├── auth/                    # Auth components and utilities
│   │   ├── components/          # Login, register, forgot-password forms
│   │   └── lib/                 # Auth client, context, server helpers
│   ├── core/                    # Core logic and hooks
│   │   ├── constants/           # Game-specific constants
│   │   ├── hooks/               # React hooks (admin API, public API, currency, locale, etc.)
│   │   ├── lib/                 # API client, currency, query client, translations, utilities
│   │   └── middleware/           # Route middleware
│   ├── changelog/               # Changelog components and hooks
│   ├── i18n/                    # Internationalization (next-intl config)
│   ├── kb/                      # Knowledge base components, content, and utilities
│   └── ui/                      # UI components (layouts, shadcn/ui primitives)
├── public/                      # Static assets
├── translations/                # Localization
│   ├── messages/                # 30+ language files
│   └── templates/               # Source translation templates (modular)
└── [config files]               # next.config.mjs, tsconfig.json, etc.
```

## Panel Integration

NodeByte supports multiple hosting control panels, allowing you to manage different types of infrastructure from a single dashboard.

### Supported Panels

**Pterodactyl Panel** -- Game server management (Minecraft, Rust, Hytale, etc.)
- API-based authentication via token
- Sync support for nodes, locations, allocations, eggs, servers, and users

**Virtfusion Panel** -- VPS and virtual machine management
- API key-based authentication
- Infrastructure provisioning and monitoring

### Setup Wizard

The platform includes an interactive setup wizard at `/setup` that guides you through:

1. **Site Information** -- site name, URL, and optional favicon
2. **Game Panels** -- Pterodactyl panel credentials with connection testing
3. **Infrastructure Panels** -- Virtfusion panel credentials with connection testing

The setup supports incremental configuration. You can configure components in any order and add panels later from the admin settings.

### Panel Data Synchronization

The backend automatically syncs data from configured panels:

- **Nodes** -- hosting nodes and their resources
- **Locations** -- geographic regions
- **Eggs** -- server types and configurations
- **Servers** -- active server instances
- **Allocations** -- IP/port assignments
- **Users** -- panel user accounts for registration verification

Sync frequency is configurable in admin settings. Auto-sync can be enabled or disabled, and manual sync can be triggered from the admin panel. Sync operations support cancellation and emit real-time progress logs.

## Development

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Building for Production

```bash
npm run build
npm start
```

### Deployment

The project includes a `nixpacks.toml` for deployment via Nixpacks with Bun and Node.js 22. Git submodules (translations) are initialized during the setup phase.

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines on code style, commit message format, and the pull request process.

## Security

For security vulnerabilities, please see [SECURITY.md](.github/SECURITY.md) for responsible disclosure procedures. Do not open public issues for security vulnerabilities.

Key security measures:
- JWT-based authentication with token validation via Go backend
- Admin-only access control via middleware
- API key masking in the admin UI
- Credential storage managed by the backend (not in environment variables)
- Webhook URL validation before storage
- Webhook scope control (ADMIN, USER, PUBLIC)

## License

This project is licensed under the **GNU Affero General Public License v3.0** -- see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this software, provided that:
- Source code is disclosed
- License and copyright notice are included
- Derivative works use the same license

## Support

### Resources
- [Knowledge Base](https://nodebyte.host/kb)

### Community
- [Discord Server](https://discord.gg/wN58bTzzpW)
- [Twitter/X](https://x.com/NodeByteHosting)
- [Email Support](mailto:support@nodebyte.host)

### Issue Tracking
Report bugs and feature requests on [GitHub Issues](https://github.com/NodeByteHosting/website/issues).

## Authors

**NodeByte Hosting Team**
- Website: https://nodebyte.host
- Email: hello@nodebyte.host

## Built With

- [Next.js](https://nextjs.org/) -- React framework with App Router
- [React](https://react.dev/) -- UI library (v19)
- [TypeScript](https://www.typescriptlang.org/) -- Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) -- Utility-first CSS (v4)
- [shadcn/ui](https://ui.shadcn.com/) -- Radix-based UI components
- [TanStack React Query](https://tanstack.com/query) -- Data fetching and caching
- [next-intl](https://next-intl.dev/) -- Internationalization
- [Go Fiber](https://gofiber.io/) -- Backend API framework (separate service)

---

**Last Updated:** March 1, 2026
