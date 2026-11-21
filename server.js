/*
 * Minimal zero-dependency static file server for Render.
 * Serves the repository root so index.html, css/ and js/ are public.
 */
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    let pathname = decodeURIComponent(parsed.pathname);
    if (pathname === "/" || pathname === "") pathname = "/index.html";

    const relative = path.normalize(pathname).replace(/^[/\\]+/, "");
    const filePath = path.resolve(ROOT, relative);

    // Block path traversal outside the project root.
    if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
      send(res, 403, "Forbidden");
      return;
    }

    const info = await fs.stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "public, max-age=0",
    });
    res.end(data);
  } catch {
    send(res, 500, "Server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Serving ${ROOT} on port ${PORT}`);
});
