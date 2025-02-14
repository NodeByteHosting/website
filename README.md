## NodeByte Hosting

Fast, reliable, scalable, and secure hosting services for your business or gaming experience.

[![Build](https://github.com/NodeByteHosting/website/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/NodeByteHosting/website/actions/workflows/build.yml)

---

### Project Details

This is the official website for NodeByte Hosting, featuring a rich and user-friendly dashboard, client portal, and more.

### Table of Contents

- [Getting Started](#getting-started)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)

### Getting Started

Some things you need to know before you host the website:

- This website was primarily made using [bun](https://bun.sh/). No guarantees are made that it will work with yarn or npm.
- Please maintain our page and API layout, as this is what works best with the new app router.

### Environment Variables

To run this project, you will need to set up the following environment variables. Rename the `.env.template` file to `.env` and fill out the values inside it:

| Variable Name       | Description                                               | Required |
|---------------------|-----------------------------------------------------------|----------|
| `TAWK_TO_EMBED_URL` | The embed URL for Tawk.to live chat integration.          | No       |
| `GITHUB_API_URL`    | Base url for contacting the GitHub API.                   | Yes      |
| `GITHUB_PAT`        | Personal Access Token for GitHub API access.              | Yes      |
| `ERROR_HOOK_ID`     | Discord webhook ID for error notifications.               | No       |
| `ERROR_HOOK_TOKEN`  | Discord webhook token for error notifications.            | No       |
| `UR_API_KEY`        | API key for UptimeRobot monitoring.                       | Yes      |

- `TAWK_TO_EMBED_URL`: This value should be filled out if you would like to test/update our live chat.
- `GITHUB_API_URL`: This value is provided with the env template and is required for the Knowledge Base and Legal Pages.
- `GITHUB_PAT`: Personal Access Token for GitHub API access required for Knowledge Base and Legal Pages.
- `ERROR_HOOK_ID`: Discord webhook ID for error notifications (this is optional but recommended).
- `ERROR_HOOK_TOKEN`: Discord webhook token for error notifications (this is optional but recommended).
- `UR_API_KEY`: API key for UptimeRobot monitoring, this is required for the status page to work.

### Commands

#### Build/Compile the Site

```sh
bun run build
```

#### Build the Blog/Docs Pages

**REQUIRED IN DEVELOPMENT**

```sh
bun run build:assets
```

#### Install Dependencies

```sh
bun install
```

#### Run the Site

```sh
bun start
```

#### Run the Site (in Development)

```sh
bun run dev
```

### Contributing

We welcome all contributions! Please view our Contributing Guide for more info:
- [CONTRIBUTING.md](./CONTRIBUTING.md)

### License

This project is licensed under the AGPL-3.0 License, For more details see:
- [LICENSE.md](./LICENSE)