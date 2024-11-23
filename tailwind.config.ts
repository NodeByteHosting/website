import type { Config } from "tailwindcss";
import { basePreset } from "./presets/base-preset";
import { markdownPreset } from "./presets/md-preset";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [
    basePreset,
    markdownPreset
  ],
  plugins: [
    nextui(),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ],
};
export default config;
