## NodeByte Hosting
Fast, reliable, scalable and secure hosting services for your business or gaming experience.

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

---

### Legal Pages
Our legal pages are set up in a rather interesting manner:

- You can add/update the content of our legal pages in [content/legal](./content/legal/)
- The files are then looped through using our [api](./src/app/(pages)/api/legal/)
- The content is then generated and converted to html in the [legal pages](./src/app/(pages)/legal/)