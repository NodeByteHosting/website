## NodeByte Hosting
Fast, reliable, scalable and secure hosting services for your business or gaming experience.

[![Build](https://github.com/NodeByteHosting/website/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/NodeByteHosting/website/actions/workflows/build.yml)

---

### Project Details
This is the official website for NodeByte Hosting, a feature rich and user friendly dashboard,
client portal and more.

### Getting Started
Some things you need to know before you host the website:

- This website was primarily made using [bun](https://bun.sh/) no guarantees are made that it will work with yarn or npm.
- Please maintain our page and api layout, this is what works best with the new app router.

#### Commands

##### Build/Compile the site
```sh
bun run build
```

##### Build the Blog/Docs Pages
**REQUIRED IN DEVELOPMENT**
```sh
bun run build:assets
```

##### Install dependencies
```sh
bun install
```

##### Run the site
```sh
bun start
```

##### Run the site (in development)
```sh
bun run dev
```