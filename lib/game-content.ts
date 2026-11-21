import { LOCATIONS } from "./products";

export const GAME_INCLUDED = [
  {
    text: "Start, stop, install mods and edit files from your browser. No Linux knowledge needed.",
    title: "Easy web panel",
  },
  {
    text: "A crash or bad update never costs you progress. Restore from the panel.",
    title: "Automatic daily backups",
  },
  {
    text: "Every plan comes with a MySQL database for plugins, web stores and Discord sync.",
    title: "MySQL database included",
  },
  {
    text: "No bandwidth caps or overage fees, however busy your server gets.",
    title: "Unmetered bandwidth",
  },
  {
    text: "Attack traffic is filtered before it reaches your server.",
    title: "DDoS protection",
  },
  {
    text: `Host in ${LOCATIONS.join(" or ")}, chosen at checkout.`,
    title: "Two locations",
  },
];

export const GAME_FAQ = [
  {
    answer:
      "No. Every game uses the same plans. Choose the plan with the memory and storage you need, then pick your game at checkout.",
    question: "Do I need a different plan for each game?",
  },
  {
    answer:
      "Small vanilla servers for a few friends run well on 2 to 4 GB. Modded servers and bigger communities need more, so start with 6 GB or above. You can move up a plan later.",
    question: "How much memory do I need?",
  },
  {
    answer:
      "Yes. Upgrade from the client area whenever your server needs more room.",
    question: "Can I upgrade later?",
  },
  {
    answer: "Most servers are ready within a minute of payment.",
    question: "How quickly is my server ready?",
  },
];
