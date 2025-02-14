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

We welcome contributions! Please view our [Contributing Guidelines](./CONTRIBUTING.md) for steps and information!

### License

This project is licensed under the AGPL-3.0 License. See the [LICENSE](LICENSE) file for details.