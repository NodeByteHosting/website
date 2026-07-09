# NodeByte Hosting Platform

A modern hosting website built with **Next.js**.

[![License: AGPL-3.0-only](https://img.shields.io/badge/License-AGPL%203.0%20only-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)


## Quick Start

### Prerequisites
- Node.js 22+ or Bun
- Go backend service (see backend repository)
- Pterodactyl Game Panel (for game server hosting)
- Discord Server (for webhooks, optional.


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
- [Discord Server](https://discord.gg/nodebyte)
- [Twitter/X](https://x.com/NodeByteHosting)
- [Email Support](mailto:support@nodebyte.host)

### Issue Tracking
Report bugs and feature requests on [GitHub Issues](https://github.com/NodeByteHosting/website/issues).
