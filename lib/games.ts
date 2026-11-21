export interface Game {
  guides: { href: string; label: string }[];
  highlights: { text: string; title: string }[];
  image: string;
  intro: string;
  name: string;
  slug: string;
  tagline: string;
}

export const GAMES: Game[] = [
  {
    guides: [
      {
        href: "/kb/games/minecraft/server-software",
        label: "Choosing server software",
      },
      {
        href: "/kb/games/minecraft/installing-plugins",
        label: "Installing plugins",
      },
      { href: "/kb/games/minecraft/installing-mods", label: "Installing mods" },
      { href: "/kb/games/minecraft/diagnosing-lag", label: "Diagnosing lag" },
    ],
    highlights: [
      {
        text: "Run Paper, Spigot, Forge, Fabric or vanilla, and switch versions from the panel.",
        title: "Any server software",
      },
      {
        text: "Install plugins and modpacks, and edit configs in the browser file manager.",
        title: "Plugins and mods",
      },
      {
        text: "Daily backups mean a bad plugin update never costs you a world.",
        title: "Automatic backups",
      },
    ],
    image: "/games/minecraft.png",
    intro:
      "Survival, SMPs, minigame networks or modpacks. Start small and move up a plan as your community grows.",
    name: "Minecraft",
    slug: "minecraft",
    tagline: "Minecraft server hosting",
  },
  {
    guides: [
      { href: "/kb/games/rust/getting-started", label: "Getting started" },
      { href: "/kb/games/rust/oxide-installation", label: "Installing Oxide" },
      { href: "/kb/games/rust/enabling-rust+", label: "Enabling Rust+" },
      {
        href: "/kb/games/rust/connect-to-server",
        label: "Connecting to your server",
      },
    ],
    highlights: [
      {
        text: "Install Oxide (uMod) in a few clicks and add the plugins your players expect.",
        title: "Oxide ready",
      },
      {
        text: "Pair the Rust+ companion app so players can check on their base from their phone.",
        title: "Rust+ support",
      },
      {
        text: "Add extra ports from the panel for query and RCON tools.",
        title: "Extra ports",
      },
    ],
    image: "/games/rust.png",
    intro:
      "Vanilla, modded or a weekly-wipe community. Plans have the memory Rust needs for big maps and busy servers.",
    name: "Rust",
    slug: "rust",
    tagline: "Rust server hosting",
  },
  {
    guides: [
      {
        href: "/kb/games/hytale/setting-up-hytale",
        label: "Setting up Hytale",
      },
      {
        href: "/kb/games/hytale/add-mods-and-plugins",
        label: "Adding mods and plugins",
      },
      {
        href: "/kb/games/hytale/setting-server-password",
        label: "Setting a password",
      },
    ],
    highlights: [
      {
        text: "Set your server name, password and MOTD straight from the panel.",
        title: "Easy setup",
      },
      {
        text: "Add mods and plugins as the Hytale modding scene grows.",
        title: "Mods and plugins",
      },
      {
        text: "Daily backups keep your world safe while you experiment.",
        title: "Automatic backups",
      },
    ],
    image: "/games/hytale.png",
    intro:
      "Get a Hytale server running for your friends or community, with room to grow as the game does.",
    name: "Hytale",
    slug: "hytale",
    tagline: "Hytale server hosting",
  },
  {
    guides: [{ href: "/kb/games/quick-start", label: "Quick start guide" }],
    highlights: [
      {
        text: "Palworld is memory hungry, so pick a plan with headroom for your player count.",
        title: "Room to grow",
      },
      {
        text: "Edit world settings and config files from the browser file manager.",
        title: "Full config access",
      },
      {
        text: "Daily backups protect your Pals and bases.",
        title: "Automatic backups",
      },
    ],
    image: "/games/palworld.png",
    intro:
      "A dedicated Palworld world that stays up when you log off, so your friends can keep building.",
    name: "Palworld",
    slug: "palworld",
    tagline: "Palworld server hosting",
  },
];

export const gameBySlug = (slug: string) =>
  GAMES.find((game) => game.slug === slug);
