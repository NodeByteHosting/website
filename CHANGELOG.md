# Changelog

All notable changes to the NodeByte Hosting website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.0] - 2025-12-24

### Added
- **GitHub Token Management**: Move GitHub personal access token from environment variables to secure database storage
  - GitHub token section in admin settings with show/hide toggle
  - Token is hidden with asterisks and cannot be viewed once set
  - Warning alert about token protection and immutability
  - Fallback to `GITHUB_TOKEN` environment variable for backward compatibility
- **SystemSettings Database Table**: Extended Prisma model for storing system-wide configuration including credentials and notification settings
- **Admin Settings API**: Complete GET/POST endpoints for retrieving and updating all system settings with database fallback support
- **Pterodactyl Configuration Management**: Editable Pterodactyl URL, API Key, and API endpoint in admin settings panel
- **Crowdin Integration Settings**: Project ID and Personal Token configuration for translation management
- **Email Notifications System**: Resend API integration with database-backed credential storage
  - Conditional API key input that appears only when email notifications are enabled
  - Helper functions for common notification templates
- **Discord Webhook Management**: Support for multiple Discord webhooks with add/remove functionality
  - Manage webhook names and URLs directly from admin panel
  - Conditional section that displays only when Discord notifications are enabled
  - Separate webhook entries with individual delete buttons
- **Notification Library**: Comprehensive notifications module (`packages/core/lib/notifications.ts`)
  - `sendEmailNotification()` - Send emails via Resend API
  - `sendDiscordNotification()` - Send to configured Discord webhooks with embed support
  - `sendNotification()` - Combined email and Discord notification sender
  - Helper functions for common notification types (server status, sync updates, maintenance, user registration)
- **Maintenance Mode Page**: Beautiful `/maintenance` page with animated UI for when site is under maintenance
  - Accessible by all users; admins can bypass maintenance mode
  - Contact support button with styling
- **Sync Service Database Credentials**: Updated sync library to fetch Pterodactyl credentials from database
  - Fallback to environment variables for backward compatibility
  - Respects `syncInterval` setting from database
- **Middleware Authentication & Access Control**:
  - Maintenance mode: Redirects all non-admin users to `/maintenance` when enabled
  - Registration disabled: Prevents access to `/auth/register` when registration is disabled
  - All checks performed via database settings with proper fallback
- **System Features Toggle**: Enable/disable registration, maintenance mode, and auto-sync from database
- **Notification Settings**: Database-backed email and Discord webhook notification configuration with credential storage
- **Advanced Settings**: Cache timeout and sync interval configuration with persistent database storage
- **Admin Users Table Responsive Design**: Mobile-optimized table layout with email displayed under username on small screens
- **Connection Testing**: Updated test endpoint to use database credentials with validation before sending requests
- **Webhook Dispatcher Service**: Comprehensive Discord webhook notification system (`packages/core/dispatchers/webhooks.ts`)
  - Event-specific dispatch functions: `dispatchSettingsUpdate()`, `dispatchServerStateChange()`, `dispatchSyncCompletion()`, `dispatchSystemAlert()`, `dispatchSupportTicket()`, `dispatchNodeAlert()`, `dispatchBillingEvent()`
  - Non-blocking asynchronous webhook delivery with parallel execution
  - Type-safe webhook routing by event type (GAME_SERVER, VPS, SYSTEM, BILLING, SECURITY, SUPPORT, CUSTOM)
  - Webhook delivery tracking with `testSuccessAt` timestamp updates
  - Rich Discord embeds with color-coding by event type
  - Automatic webhook selection based on event type and scope (ADMIN, USER, PUBLIC)
  - Per-webhook error reporting and detailed delivery statistics
- **Webhook Integration**: Automatic webhook triggers for system events
  - Settings updates automatically send SYSTEM webhooks with changed field names
  - Sync operations automatically send SYSTEM webhooks with sync summary and duration
  - Admin panel webhook management with test functionality
  - Webhook creation, editing, deletion via REST API (`/api/admin/settings/webhooks`)
- **Webhook Documentation**: Complete guides and examples (`docs/` folder)
  - `WEBHOOK_DISPATCHER_README.md` - Architecture and feature overview
  - `WEBHOOK_INTEGRATION_GUIDE.md` - Integration examples for all event types
  - `WEBHOOK_QUICK_REFERENCE.ts` - Copy-paste code samples
- **Incremental Sync Progress Logging**: Sync functions now emit progress updates to database during operation
  - Real-time item counts: `itemsTotal`, `itemsSynced`, `itemsFailed` updated after each batch
  - Last message updates in `metadata.lastMessage` for live progress display
  - Implemented for locations, nodes, allocations, nests/eggs, servers, and database syncs
- **Allocation Sync Batching**: Prevent long blocking operations by batching allocation processing
  - Configurable batch size via `SYNC_ALLOCATION_BATCH_SIZE` env variable (default: 100)
  - Progress updates after each batch for real-time feedback
  - Significantly improves sync responsiveness for large node allocations
- **Sync Cancellation Support**: Allow admins to cancel running sync operations
  - Sync functions check `metadata.cancelRequested` flag and abort gracefully
  - New `/api/admin/sync/cancel` endpoint sets cancellation flag on running sync log
  - Cancelled syncs marked as FAILED with "Cancelled by user" message
- **Sync Logs Endpoint**: New `/api/admin/sync/logs` API endpoint for fetching sync audit history
  - Cursor-based pagination support for efficient browsing of large log histories
  - Returns `nextCursor` for client-side pagination
  - Configurable limit parameter (max 100 entries)
  - Admin-only access with authentication check
- **Auto-Sync Scheduler**: Background scheduler for automatic periodic sync operations
  - Reads `auto_sync_enabled` and `sync_interval` from system config
  - Idempotent scheduler prevents duplicate runs if already executing
  - Configurable via admin UI without code changes
  - Scheduler started automatically on server render in `app/layout.tsx`
- **Sync Logs Admin Page**: New dedicated admin page at `/admin/sync/logs` for sync operation audit
  - Displays recent sync runs with status badges (Running, Completed, Failed, Pending)
  - Real-time scheduler status indicator with last run timestamp
  - Full-text search across sync messages and operation types
  - Configurable result limit (1-100 entries per page)
  - Cursor-based pagination with "Load More" button
  - Mobile-responsive card-based layout
- **Sync Logs Pagination**: Server-side cursor-based pagination for sync logs endpoint
  - Efficient pagination using cursor (lastId) approach
  - Next cursor included in response for seamless client-side browsing
  - Prevents N+1 queries and improves performance with large datasets
- **Scheduler Settings API**: New `/api/admin/sync/settings` endpoint for managing auto-sync configuration
  - GET endpoint returns current `auto_sync_enabled` and `sync_interval` settings
  - POST endpoint allows updating scheduler configuration with validation
  - Admin-only access with system admin role check
- **Scheduler Controls in Admin UI**: Admin users can now configure auto-sync directly from Sync Logs page
  - Toggle switch for enabling/disabling automatic sync
  - Numeric input for configuring sync interval in seconds
  - Save button to persist configuration to database
  - Loading states and error handling with toast notifications
- **Sync Logs Sidebar Navigation**: Added "Sync Logs" link to admin panel navigation
  - Appears as separate menu item from main Sync page
  - Accessible to all admin users
- **Sync Logs Translation Keys**: Complete internationalization for Sync Logs page
  - Added `admin.syncLogs` translation section with all UI strings
  - Includes status labels, button text, field labels, and descriptions
  - Supports multiple languages via translation system
- **Servers Admin Panel Schema Fix**: Updated servers API and UI to use Prisma schema correctly
  - Changed from non-existent direct fields (memory, disk, cpu) to ServerProperty key-value pairs
  - Servers API now fetches properties array instead of individual fields
  - Server page displays resource info by extracting values from properties
  - Graceful handling of missing properties (shows nothing if not available)

### Changed
- **GitHub Release API**: Updated to fetch GitHub token from database first, then fallback to environment variable
- **Admin Users Table**: Restructured table with fixed layout to prevent content overflow on mobile
- **Admin Users Status Badges**: Full badge text now displays on mobile with vertical stacking when multiple badges present
- **Admin Settings Page**: Completely redesigned with four tabs (Connections, Features, Notifications, Advanced)
  - Pterodactyl section now includes editable URL and API fields with external link button
  - New Crowdin section for translation management configuration
  - New GitHub section for token management with security warnings
  - Features tab with all toggles (Registration, Maintenance Mode, Auto-sync)
  - Notifications tab with conditional email and Discord sections with proper styling
  - Advanced tab with cache timeout and sync interval selectors
- **Pterodactyl Sync Service**: Now reads credentials from database first, then falls back to environment variables
- **API Route Authentication**: Settings test endpoint changed from GET to POST to support credential testing with user-provided values
- **Settings Persistence**: All configuration now properly persists to database across page reloads
- **Translation File Structure**: Reorganized monolithic `templates/en.json` into modular files for better maintainability
  - Split into 5 focused modules: `common.json`, `home.json`, `pages.json`, `auth.json`, `admin.json`
  - Translation loader merges all modular files at runtime
  - Crowdin configuration updated to sync from `templates/en/*.json` pattern
  - GitHub workflow updated to monitor modular files instead of single file
  - No breaking changes - all translation keys available exactly as before
- **Sync Logs Page UI**: Redesigned for consistency with other admin pages and improved mobile responsiveness
  - Header with title and Refresh button stacks vertically on mobile
  - Scheduler status section moved to dedicated Settings card
  - Better form control styling with Switch component for toggles
  - Mobile-optimized search and filter fields with proper spacing
  - Scroll area with divide separators for log list
  - Status badges now include animated icons (spinner, checkmark, X)
  - Log entry layout is flexible for mobile (stacks) and desktop (side-by-side)
- **Egg Property Upsert**: Fixed to properly handle composite unique key `[eggId, key, panelType]`
  - Replaced invalid composite upsert with findFirst/update/create pattern
  - Properly handles nullable panelType field in searches and filters
  - Prevents Prisma validation errors on sync
- **Server User Lookup**: Fixed to use `findFirst` instead of `findUnique` for `pterodactylId` field
  - `pterodactylId` is not unique on User model, changed to proper first-match pattern
  - Prevents Prisma validation errors when syncing server owners

### Fixed
- **Admin Users Table Mobile Overflow**: Fixed table content breaking off-screen on mobile devices
- **Admin Users Email Display**: Email now shown under username on mobile instead of separate column
- **User menu now properly detects admin users on mobile**
- **Settings Credentials**: Passwords and API keys no longer accidentally logged or exposed in responses
- **GitHub Token Security**: GitHub token now stored in database instead of .env file, no longer visible in git history
- **Incorrect footer links**: The `About NodeByte` section was incorrectly linking to `/changelog` instead of `/about`
- **Egg Property Upsert Validation Error**: Fixed Prisma validation error when upserting egg properties (was using non-existent `eggId_key` unique)
- **Server Owner Lookup Validation Error**: Fixed Prisma validation error when looking up servers by pterodactylId (field is not unique)
- **Servers Admin Panel Display**: Fixed servers table to properly display resource data from database schema

### Security
- **GitHub Token Protection**: Token is encrypted-ready in database and cannot be viewed once set (hidden with asterisks)
- **Credential Encryption Ready**: Database structure prepared for future encryption of sensitive fields (API keys, tokens)
- **Admin-Only Access**: All settings management restricted to authenticated admin users via middleware
- **Environment Variable Fallback**: System gracefully handles missing database settings by falling back to environment variables
- **Token Immutability**: Warning displayed to admins that GitHub token cannot be changed after initial setup without manual database intervention
- **Webhook URL Validation**: Discord webhook URLs validated before storage to prevent invalid configurations
- **Webhook Scope Control**: Webhooks can be scoped to ADMIN/USER/PUBLIC to control event distribution
- **Webhook Delivery Tracking**: Successful webhook deliveries logged with timestamp for audit trail
- **Webhook Error Isolation**: Individual webhook failures don't impact other webhooks or main application
- **Sync Cancellation Security**: Cancel endpoint restricted to admin users with proper authentication checks
- **User Role Management**: Only system admins can modify user roles via new role management endpoint
  - Safety check prevents self-demotion of system admin status
  - Role updates require authentication and authorization verification

## Removed
- **Dockerfile**: was using it to force docker to pull the latest version of our translations, but the `nixpacks.toml` now does this instead


## [3.1.0] - 2025-12-22

### Added

- **Authentication System**: NextAuth v5 integration with credentials provider
- **User Registration**: Registration form with email, username, password fields
- **User Login**: Login form with email/password authentication
- **User Menu**: Dropdown menu showing user info, panel link, admin link, and logout
- **Session Management**: Server-side and client-side session handling
- **Admin Dashboard**: Complete admin panel with Pterodactyl sync statistics
- **Admin Sync Page**: Detailed sync management with live terminal-style logging
- **Admin Users Page**: User management with search, filters, sorting, and pagination
- **Admin Servers Page**: Server listing with status indicators, resource display, and owner info
- **Admin Settings Page**: System configuration with connection testing (WIP alert for other features)
- **Admin Route Protection**: Middleware-based admin authentication checking database directly
- **Admin Panel Responsive**: Mobile-first design with slide-out drawer navigation
- **Admin User Controls**: Language selector, theme toggle, user menu, and back-to-site button in admin panel
- **Admin API Endpoints**: REST endpoints for users, servers, and settings management
- **Pterodactyl Sync Service**: Background sync of users, servers, nodes, locations, allocations, nests, eggs
- **Database Schema**: Prisma models for Users, Servers, Nodes, Locations, Allocations, Nests, Eggs, and more
- **Sync API Endpoints**: GET for stats, POST for triggering syncs with target selection
- **Layout Chrome Component**: Client-side component for conditional nav/footer visibility
- **Language Selector Improvements**: Search functionality, region grouping, ScrollArea for 30 languages
- **Currency Selector Improvements**: Country flag icons using country-flag-icons library
- **Knowledge Base System**: Complete documentation system with markdown support
- **KB Markdown Processing**: Uses remark/rehype pipeline with GFM, syntax highlighting, auto-linking headings
- **KB Categories**: Organized articles by category with metadata and icons
- **KB Article Cards**: Article previews with reading time, tags, and author info
- **KB Search**: Full-text search across all KB articles with relevance scoring
- **KB Table of Contents**: Sticky sidebar TOC with scroll spy highlighting
- **KB Sidebar Navigation**: Collapsible category navigation with article links
- **KB Breadcrumbs**: Navigation breadcrumbs for category and article pages
- **KB Previous/Next Navigation**: Article-to-article navigation within categories
- **KB Navigation Link**: Added Knowledge Base link to desktop and mobile navigation
- **Tailwind Typography**: Added `@tailwindcss/typography` plugin for prose styling
- **Getting Started Articles**: Introduction, Quick Start Guide, Game Panel Tutorial
- **Minecraft Guides**: Server Software selection guide, Installing Plugins guide
- **Rust Guides**: Getting Started with Rust, Oxide/uMod Installation guide
- **Billing Guides**: WHMCS Client Portal overview and account management
- **Syntax Highlighting**: Code block styling for documentation with hljs classes
- **Theme Toggle**: Categorized theme selector with Base, Cool Tones, Warm Tones, and Nature categories
- **Theme Swatches**: Color preview swatches for each theme option
- **Navigation Dropdowns**: Services and Resources dropdown menus with hover-to-open functionality
- **Animated Chevrons**: Chevron icons rotate based on dropdown open/closed state
- **Hero Stats**: Animated statistics cards displaying uptime, latency, and support availability
- **SLA Counter**: Animated number counter displaying 99.6% SLA guarantee
- **Features Highlights**: Feature cards now include detailed highlight lists with checkmark icons
- **About Stats Grid**: Statistics section showing SLA, latency, support hours, and server count
- **FAQ Search**: Search input for filtering FAQ questions
- **FAQ CTA Section**: "Still have questions?" section with contact and Discord buttons
- **Games Section Icons**: Dedicated icons for each game server type (Minecraft, Rust, Hytale, Coming Soon)
- **Games Feature Lists**: Each game card now displays key features with checkmark icons
- **Games Banner Images**: Minecraft and Rust cards now use banner images from public directory
- **Hytale Hosting**: Added Hytale game server hosting card to the games section
- **Footer Status Indicator**: Live status indicator linking to status page
- **Footer Link Categories**: Organized footer links with category icons
- **Contact Page Redesign**: Complete redesign with support channels, email grid, and social links
- **Contact Social Links**: Follow us section with X, GitHub, Discord, and Trustpilot links
- **Contact Discord Notice**: Important notice about Discord support limitations moved to prominent position
- **Dynamic Logo Component**: SVG logo that respects theme accent colors and light/dark mode
- **Currency System**: Multi-currency support with GBP as base currency (USD, EUR, CAD, AUD)
- **Currency Selector**: Global currency dropdown in navigation (desktop and mobile)
- **Price Component**: Auto-converting price display component using selected currency
- **Internationalization**: Added `next-intl` for multi-language support
- **Language Selector**: Global language dropdown with flag icons in navigation
- **Translation Files**: English, German, French, and Spanish translations
- **External Translations**: Support for loading translations from external GitHub repo
- **Crowdin Integration**: Configuration for community translation contributions
- **Dedicated Game Pages**: Individual pages for Minecraft, Rust, and Hytale hosting
- **Game Hero Component**: Reusable hero section for game pages with banners and features
- **Game Features Component**: Reusable features grid with icon mapping for server components
- **Game Pricing Component**: Reusable pricing cards with currency conversion
- **Game FAQ Component**: Reusable FAQ accordion for game-specific questions

### Changed
- **Packages**: Updated next.js to version `16.0.10` to address the latest CVE
- **Project Structure**: Reorganized codebase into `packages/` directory for better modularity
  - `packages/core/` - Shared hooks (`use-currency`, `use-locale`, `use-mobile`, `use-toast`) and utilities (`currency`, `translations`, `utils`)
  - `packages/i18n/` - Internationalization configuration and request handling
  - `packages/ui/` - All UI components, layouts, and shadcn/ui primitives
- **Navigation**: Replaced NavigationMenu with DropdownMenu components for improved reliability
- **Navigation Mobile**: Redesigned with accordion-style dropdowns (only one open at a time)
- **Navigation Settings**: Added Language, Currency, and Theme selectors to mobile menu
- **Layout Structure**: Moved Navigation and Footer to root layout for site-wide consistency
- **Layout Providers**: Added `CurrencyProvider`, `LocaleProvider`, and `NextIntlClientProvider`
- **Layout Chrome**: Nav/footer visibility now handled by client component using `usePathname()` for proper client-side navigation support
- **Translation Loading**: Changed from dynamic imports to static imports for all 30 locale files (bundler compatibility)
- **Admin Panel Layout**: Redesigned with responsive sidebar that becomes a drawer on mobile
- **Admin Dashboard**: Responsive stat cards with 2-column grid on mobile
- **Theme Toggle Layout**: Themes now displayed in organized grid layouts by category
- **Hero Section**: Complete redesign with gradient text, glassmorphism cards, and Trustpilot integration
- **Features Section**: Redesigned with badge header, gradient text, and enhanced card styling
- **About Section**: Redesigned with stats grid, value proposition cards, and gradient headers
- **FAQ Section**: Redesigned with animated accordions, search functionality, and cleaner single-column layout
- **Games Section**: Redesigned with banner images, feature lists, and consistent card heights
- **Contact Page**: Redesigned with gradient background, animated orbs, and organized support channels
- **Footer**: Complete redesign with two-section layout, categorized links, and dynamic Logo component
- **Footer Logo**: Now uses dynamic Logo component that respects theme colors
- **Card Styling**: Unified glassmorphism effect (`bg-card/30 backdrop-blur-sm border-border/50`) across all components
- **Button Styling**: Consistent rounded button styles with proper hover states
- **Section Spacing**: Standardized padding (`py-24 sm:py-32`) across all homepage sections
- **Pricing Display**: All prices now stored in GBP and auto-convert based on user's currency preference

### Fixed

- **Hydration Error**: Resolved React hydration mismatch in `layout.tsx` caused by `colorScheme` style attribute
- **Navigation Dropdowns**: Fixed dropdown content not loading and alignment issues
- **Theme Persistence**: Themes now properly persist across page reloads
- **Mobile Menu Bleed-through**: Fixed Discord button bleeding through mobile navigation overlay
- **Server Component Serialization**: Fixed icon props passing between Server and Client components using string-based icon mapping
- **i18n Client/Server Split**: Separated shared locale config from server-only request handling to prevent build errors
- **Translation System**: Fixed translations not switching languages due to wrong import path and dynamic import issues
- **Admin Nav/Footer Visibility**: Fixed nav/footer sometimes showing on admin pages or staying hidden after leaving admin

### Removed

- **HeroGraphic Sidebar**: Removed from FAQ section for cleaner layout
- **colorScheme Logic**: Removed from layout.tsx to prevent hydration errors
- **Inline Pricing Currency**: Removed currency selector from individual pricing sections (now global in nav)

## [3.0.0] - Initial Rewrite

Initial Next.js 15 website with App Router, shadcn/ui components, and multi-theme support.

---

[3.1.0]: https://github.com/NodeByteHosting/website/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/NodeByteHosting/website/releases/tag/v3.0.0
