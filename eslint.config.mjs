import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "shots/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // The hero canvas and the logo are intentionally plain <img>/<canvas>:
      // the site is a static export with images: { unoptimized: true }.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
