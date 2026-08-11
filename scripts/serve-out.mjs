// Serves the static export in out/ over HTTP.
//
// The site is a fully pre-rendered single page, so `next start` is neither
// possible (it refuses to run with output: "export") nor needed. This is the
// production start command for hosts that insist on running a Node process,
// and it applies the same cache policy as public/.htaccess: hashed assets are
// immutable, HTML is always revalidated so a redeploy can never leave a cached
// document pointing at chunks that were replaced.

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const port = Number(process.env.PORT) || 3016;
const host = process.env.HOST || "0.0.0.0";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/** Resolve a URL path to a file inside out/, or null if it escapes or is missing. */
async function resolve(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = normalize(join(root, decoded));
  if (candidate !== root && !candidate.startsWith(root + sep)) return null;

  try {
    const info = await stat(candidate);
    if (info.isDirectory()) return resolve(join(decoded, "index.html").split(sep).join("/"));
    return { path: candidate, size: info.size };
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const found = (await resolve(req.url || "/")) ?? (await resolve("/404.html"));

  if (!found) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = extname(found.path).toLowerCase();
  const immutable = found.path.includes(join(root, "_next", "static"));

  res.writeHead(found.path.endsWith("404.html") ? 404 : 200, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": found.size,
    "Cache-Control": immutable
      ? "public, max-age=31536000, immutable"
      : "no-cache, must-revalidate",
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(found.path).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Serving out/ on http://${host}:${port}`);
});
