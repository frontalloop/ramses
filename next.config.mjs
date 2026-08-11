/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site is a single pre-rendered page + assets.
  // Kept as .mjs, not .ts: Next resolves CONFIG_FILES in the order
  // next.config.js -> .mjs -> .ts, and loading a .ts config needs the
  // `typescript` package present at build time. On a host that omits
  // devDependencies or injects its own config, a .ts config is the one most
  // likely to be skipped -- and a skipped config means no `output: "export"`,
  // so the build quietly produces .next and no out/ directory.
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
