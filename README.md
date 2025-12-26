# NodeByte Hosting Platform

A modern, scalable hosting management platform built with **Next.js**, **Prisma**, and **PostgreSQL**. Manage game servers (Minecraft, Rust, Hytale), VPS nodes, and billing all from a unified admin dashboard.

[![License: GPL-3.0-only](https://img.shields.io/badge/License-GPL%203.0%20only-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql)](https://www.postgresql.org/)

## Features

### 🎮 Multi-Panel Game Server Hosting
- **Pterodactyl Panel** support for game servers (Minecraft, Rust, Hytale, etc.)
- **Virtfusion Panel** support for VPS management
- Multi-panel architecture - manage multiple panels from single dashboard
- Real-time server status monitoring across all panels
- Automatic panel API integration and connection testing
- Resource allocation and limits management

### 🔐 Admin Dashboard
- **User Management**: Complete user CRUD with status tracking
- **Server Management**: Browse, filter, and manage all hosted servers
- **Node Management**: Monitor and configure hosting nodes
- **Sync Operations**: Real-time sync logs with terminal-style output
- **Settings Management**: System configuration with connection testing
- **Panel Configuration**: Built-in setup wizard for connecting multiple game panels

### 🔔 Webhook Notification System
Automatic Discord webhook notifications for:
- **System Events** - Settings changes, sync operations, maintenance mode
- **Server Events** - Server online/offline/crashed status changes
- **Resource Alerts** - Node CPU, memory, disk, and network monitoring
- **Support Tickets** - Support ticket creation, updates, and resolution
- **Billing Events** - Invoices, payments, and subscription changes
- **Security Alerts** - Critical errors and system alerts
- **Custom Events** - Extensible system for custom notifications

See [Webhook Dispatcher Documentation](./docs/WEBHOOK_DISPATCHER_README.md) for complete details.

### 🌍 Internationalization
- Multi-language support (30+ languages)
- Translation management via Crowdin
- Language and currency selectors
- Region-specific pricing

### 📚 Knowledge Base
- Markdown-based documentation system
- Full-text search across articles
- Category organization
- Table of contents with scroll spy
- Syntax highlighting for code blocks

### 🔑 Authentication & Security
- NextAuth v5 with email/password authentication
- Session management
- Admin-only access control
- Environment variable and database credential storage
- Token immutability and protection
- Panel authentication via secure credential storage

### 💳 Billing
- Multi-currency support (GBP, USD, EUR, CAD, AUD)
- Pricing configuration
- Invoice management (WHMCS integration)
- Subscription tracking

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL 14+
- Discord Server (for webhooks, optional)
- Pterodactyl Game Panel (for game server hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NodeByteHosting/website.git
   cd website
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
   Configure:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Session secret (generate with `openssl rand -base64 32`)
   - `GAMEPANEL_URL` - Pterodactyl panel URL
   - `GAMEPANEL_API_KEY` - Pterodactyl API key

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Panel Integration

NodeByte supports multiple hosting control panels, allowing you to manage different types of infrastructure from a single dashboard.

### Supported Panels

#### **Pterodactyl Panel**
- **Purpose**: Game server management (Minecraft, Rust, Hytale, etc.)
- **Authentication**: API-based via token
- **Setup**:
  1. Go to your Pterodactyl panel (`Admin → Locations` is a good starting point)
  2. Create a new API token: `Admin → API Credentials → Create New`
  3. Ensure the token has permission to access applications endpoints
  4. Copy the token (format: `ptlc_xxxxxxxxxxxxx`)
  5. In NodeByte setup wizard, enter:
     - **Panel URL**: `https://your-panel.example.com`
     - **API Key**: Your API token from Pterodactyl
     - **API Endpoint**: Usually `/api/application` (default)

#### **Virtfusion Panel**
- **Purpose**: VPS and virtual machine management
- **Authentication**: API key-based
- **Setup**:
  1. Log into your Virtfusion control panel
  2. Generate an API key: `Settings → API → Create New Token`
  3. Copy the API key
  4. In NodeByte setup wizard, enter:
     - **Panel URL**: `https://your-virtfusion.example.com`
     - **API Key**: Your Virtfusion API key
     - **API Endpoint**: Your Virtfusion API path (if custom)

### Multi-Panel Architecture

NodeByte allows you to configure **multiple panels simultaneously**:

- **Game Servers**: Connect your Pterodactyl panel(s) to manage game servers
- **VPS/Infrastructure**: Connect Virtfusion for VPS provisioning
- **User Verification**: The system checks multiple panels during user registration to verify eligibility
- **Unified Dashboard**: Monitor and manage resources across all connected panels

### Setup Wizard

The platform includes an interactive setup wizard that guides you through panel configuration:

1. **Visit Setup Page**: On first boot, you'll be redirected to `/setup`
2. **Configure Site Information**:
   - Site Name
   - Site URL
   - Favicon (optional)
   - Database URL (optional)
3. **Add Game Panels**:
   - Click the "Pterodactyl" tab
   - Enter panel credentials
   - Click "Test" to verify connectivity
   - Save configuration
4. **Add Infrastructure Panels**:
   - Click the "Virtfusion" tab
   - Enter panel credentials
   - Test and save
5. **Complete Setup**: Once site info and at least one panel are configured, click "Complete Setup"

### Partial Setup Support

The setup system supports **incremental configuration**:

- You can configure site information first
- Add panels later as needed
- Test each panel's connection before saving
- Skip optional configuration (database, favicon)
- Complete remaining steps anytime from admin panel

**Progress indicators** show which components are configured:
- ✓ Site Info (required)
- ✓ Pterodactyl (optional but recommended)
- ✓ Virtfusion (optional but recommended)

### Connection Testing

Before saving panel credentials, you can test the connection:

1. Fill in the panel URL and API key
2. Click the "Test" button
3. The system will:
   - Verify the panel is accessible
   - Test API authentication
   - Check API permissions
   - Display connection status and response time
4. Common error messages:
   - "Cannot connect to panel server" - Check URL is correct and panel is online
   - "Authentication failed" - Check API key is correct
   - "Access denied" - API key doesn't have required permissions
   - "Connection timeout" - Panel is down or unreachable

### Panel Data Synchronization

The platform automatically syncs data from configured panels:

- **Nodes**: Server hosting nodes/locations
- **Locations**: Geographic regions
- **Eggs**: Server types and configurations
- **Servers**: Active game server instances
- **Users**: Panel user accounts for registration verification

Sync frequency is configurable in admin settings (default: every hour).

### User Registration with Panels

When users register, the system:

1. Checks if user exists on any configured panel
2. Retrieves user's role/permissions from the panel
3. Validates eligibility based on panel data
4. Automatically syncs user information

This ensures users registering on NodeByte match their panel accounts.

### Adding More Panels

To add additional panels after initial setup:

1. Go to **Admin Panel → Settings**
2. Click the panel type (Pterodactyl, Virtfusion, etc.)
3. Enter credentials
4. Test the connection
5. Save configuration
6. Restart the sync service to pull latest data

### Troubleshooting Panel Connections

**Panel Not Connecting?**
- Verify the panel URL is correct and accessible
- Check firewall allows outbound connections from NodeByte to the panel
- Ensure API key has "Application" permission
- Check API key isn't expired or revoked
- Test the URL directly in a browser

**Missing Data After Sync?**
- Verify API key has read permissions for the endpoint
- Check sync service is running
- Review sync logs in admin panel
- Try manual sync from **Admin → Sync Operations**

**API Key Issues?**
- Regenerate the API key in the panel admin
- API keys are stored encrypted in the database
- Once saved, they cannot be retrieved (only replaced)
- Always test connections after updating credentials

### API Documentation

See the relevant panel's documentation for API details:
- [Pterodactyl API Docs](https://pterodactyl.io/api/overview.html)
- [Virtfusion API Docs](https://docs.virtfusion.com/api)

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin-only endpoints
│   │   ├── auth/                # Authentication routes
│   │   ├── panel/               # Panel integration endpoints
│   │   └── stats/               # Statistics endpoints
│   ├── admin/                   # Admin dashboard pages
│   ├── auth/                    # Authentication pages
│   ├── games/                   # Game-specific pages
│   ├── kb/                      # Knowledge base pages
│   └── layout.tsx               # Root layout
├── packages/                     # Shared packages
│   ├── auth/                    # Authentication utilities
│   ├── core/                    # Core business logic
│   │   ├── constants/           # Application constants
│   │   ├── dispatchers/         # Event dispatchers
│   │   │   ├── notifications.ts # Email/Discord notifications
│   │   │   └── webhooks.ts      # Webhook dispatcher
│   │   ├── hooks/               # React hooks
│   │   ├── lib/                 # Utilities and helpers
│   │   │   ├── sync.ts          # Pterodactyl sync service
│   │   │   ├── pterodactyl.ts   # Panel API wrapper
│   │   │   ├── prisma.ts        # Database client
│   │   │   └── ...
│   │   └── utils.ts
│   ├── i18n/                    # Internationalization
│   ├── kb/                      # Knowledge base utilities
│   └── ui/                      # Shared UI components
├── prisma/                      # Database schema
│   ├── schema.prisma            # Prisma schema
│   └── migrations/              # Database migrations
├── public/                      # Static assets
├── translations/                # Localization files
│   └── messages/                # Language-specific translations
├── docs/                        # Documentation
│   ├── WEBHOOK_DISPATCHER_README.md
│   ├── WEBHOOK_INTEGRATION_GUIDE.md
│   ├── WEBHOOK_NOTIFICATION_COMPLETE.md
│   └── WEBHOOK_QUICK_REFERENCE.ts
└── [config files]
```

## Webhook System

The platform includes a comprehensive webhook notification system for automated Discord notifications.

### Available Webhook Types

| Type | Color | Usage |
|------|-------|-------|
| **GAME_SERVER** | Purple | Server start/stop/crash events |
| **VPS** | Blue | Node resource monitoring (CPU, memory, disk) |
| **SYSTEM** | Yellow | Sync operations, settings changes, maintenance |
| **BILLING** | Green | Invoices, payments, subscription events |
| **SECURITY** | Red | Errors, alerts, security incidents |
| **SUPPORT** | Cyan | Support ticket lifecycle events |
| **CUSTOM** | Gray | Custom/unclassified events |

### Active Integrations

✅ **System Settings Updates** - Automatically sends webhooks when settings are modified
✅ **Sync Completion** - Notified when sync operations complete or fail

### Quick Setup

1. Go to **Admin Panel → Settings → Discord Webhooks**
2. Click "Add Webhook"
3. Enter your Discord webhook URL
4. Select webhook type and description
5. Click "Test" to verify connectivity

See [Webhook Documentation](./docs/WEBHOOK_DISPATCHER_README.md) for detailed integration guide.

## API Documentation

### Authentication
All admin endpoints require authentication via NextAuth session.

### Admin Settings
- `GET /api/admin/settings` - Get current system settings
- `POST /api/admin/settings` - Update settings
- `PUT /api/admin/settings` - Reset API keys
- `POST /api/admin/settings/webhooks` - Create webhook
- `PUT /api/admin/settings/webhooks` - Update webhook
- `DELETE /api/admin/settings/webhooks` - Delete webhook
- `PATCH /api/admin/settings/webhooks` - Test webhook

### Sync Operations
- `GET /api/admin/sync/stats` - Get sync statistics
- `POST /api/admin/sync` - Trigger sync operation

### Panel Data
- `GET /api/panel/servers` - List all servers
- `GET /api/panel/nodes` - List all nodes
- `GET /api/panel/users` - List all users
- `GET /api/panel/stats` - Server statistics

See individual endpoint files in `app/api/` for detailed request/response schemas.

## Configuration

### System Settings (Database)
Settings are stored in the `SystemSettings` table and can be configured via the admin panel or setup wizard:

```typescript
{
  // Game Panel Connections
  pterodactylUrl: string
  pterodactylApiKey: string (secret)
  pterodactylApi: string
  
  // Infrastructure Panel Connections
  virtfusionUrl: string
  virtfusionApiKey: string (secret)
  virtfusionApi: string
  
  // Integrations
  crowdinProjectId: string
  crowdinPersonalToken: string (secret)
  githubToken: string (secret)
  resendApiKey: string (secret)
  
  // Database Configuration
  databaseUrl: string (optional - for connection pooling/switching)
  
  // Features
  registrationEnabled: boolean
  maintenanceMode: boolean
  autoSyncEnabled: boolean
  
  // Notifications
  emailNotifications: boolean
  discordNotifications: boolean
  
  // Webhooks
  discordWebhooks: DiscordWebhook[]
  
  // Site Configuration
  siteName: string
  siteUrl: string
  faviconUrl: string (optional)
  
  // Advanced
  cacheTimeout: number (seconds)
  syncInterval: number (seconds)
  isSetupComplete: boolean
}
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nodebyte

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Game Panel (can also be set in database via setup wizard)
GAMEPANEL_URL=https://pterodactyl.example.com
GAMEPANEL_API_KEY=ptlc_xxxxx

# Infrastructure Panel (optional, set in database)
VIRTFUSION_URL=https://virtfusion.example.com
VIRTFUSION_API_KEY=your-api-key

# Crowdin (optional)
CROWDIN_TOKEN=your-crowdin-token

# GitHub (optional)
GITHUB_TOKEN=ghp_xxxxx

# Resend (optional)
RESEND_API_KEY=re_xxxxx
```

**Note**: After initial setup, panel credentials should be configured through the admin panel or setup wizard rather than environment variables. This allows dynamic switching between different panels without redeploying.

## Database

### Prisma Migrations
Run migrations with:
```bash
npx prisma migrate dev
```

### Database Schema
Key models:
- **User** - User accounts with authentication
- **SystemSettings** - System-wide configuration
- **DiscordWebhook** - Webhook configurations with type and scope
- **Server** - Game server instances
- **Node** - Hosting nodes
- **Location** - Geographic locations
- **Allocation** - IP/port allocations
- **Nest** - Pterodactyl nests (game types)
- **SyncLog** - Sync operation history

See [prisma/schema.prisma](./prisma/schema.prisma) for complete schema.

## Development

### Running Tests
```bash
npm run test
# or
bun test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint
npm run type-check
```

## Contributing

We welcome contributions from the community! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style and standards
- Commit message format
- Pull request process
- Development setup

## Security

For security vulnerabilities, please see [SECURITY.md](./SECURITY.md) for responsible disclosure procedures. **Do not** open public issues for security vulnerabilities.

Key security features:
- Session-based authentication with NextAuth
- Admin-only access control via middleware
- API key masking in UI (shown as `••••••••••••••••••••`)
- Database credential storage instead of .env files
- Webhook URL validation before storage
- CORS and CSRF protection

## License

This project is licensed under the **GNU General Public License v3.0 or later** - see [LICENSE](./LICENSE) file for details.

In summary, you are free to:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Private use

With the condition:
- 📋 Disclose source
- 📋 Include license and copyright notice
- 📋 Use same license for derivative works

## Support

### Documentation
- 📚 [Webhook Dispatcher Guide](./docs/WEBHOOK_DISPATCHER_README.md)
- 📚 [Integration Examples](./docs/WEBHOOK_INTEGRATION_GUIDE.md)
- 📚 [Quick Reference](./docs/WEBHOOK_QUICK_REFERENCE.ts)
- 📚 [Knowledge Base](https://nodebyte.host/kb)

### Community
- 💬 [Discord Server](https://discord.gg/nodebyte)
- 🐦 [Twitter/X](https://x.com/nodebyte)
- 📧 [Email Support](mailto:support@nodebyte.host)

### Issue Tracking
Report bugs and feature requests on [GitHub Issues](https://github.com/NodeByteHosting/website/issues)

## Roadmap

### Current Version (3.2.0)
- ✅ Webhook notification system
- ✅ Settings management with credential storage
- ✅ Multi-language support
- ✅ Knowledge base system

### Planned Features
- 🔄 Client panel (user-scoped webhooks)
- 🔄 Enhanced billing system
- 🔄 Advanced analytics
- 🔄 API key management for users
- 🔄 Two-factor authentication
- 🔄 Audit logging

## Authors

**NodeByte Hosting Team**
- Website: https://nodebyte.host
- Email: hello@nodebyte.host

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth](https://next-auth.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Status

🟢 **Production Ready** - v3.2.0

Fully functional hosting platform with webhook notifications, admin dashboard, and game server management.

---

**Last Updated:** December 22, 2025
