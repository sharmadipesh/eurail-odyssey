import { type NextRequest } from "next/server";

// Same-origin proxy so the R2 clips download with a real Content-Disposition.
// The public R2 host sends no CORS headers, so a client-side blob fetch would
// fail and the browser would ignore the `download` attribute on a cross-origin
// <a>. Both the folder and filename are whitelisted to avoid open-proxy abuse.
const HOST = "https://pub-15da519210e34e4684d96a0ee4f478a3.r2.dev";
const DIRS = new Set([
  "moodboard",
  "window",
  "section-7",
  "section-8",
  "section-9",
  "section-10",
  "section-11",
  "section-12",
  "section-13",
  "section-14",
  "section-15",
  "section-16",
  "section-17",
  "section-18",
  "section-19",
  "section-21",
]);

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file") ?? "";
  const dir = req.nextUrl.searchParams.get("dir") ?? "moodboard";

  // Resolve to a whitelisted upstream path — never forward arbitrary paths.
  // Either `<n>.mp4|png` inside a known folder, or a root-level `section-<n>.mp4|png`.
  let path: string | null = null;
  if (/^\d+\.(mp4|png)$/.test(file) && DIRS.has(dir)) {
    path = `${dir}/${file}`;
  } else if (/^section-\d+\.(mp4|png)$/.test(file)) {
    path = file;
  }
  if (!path) {
    return new Response("Bad request", { status: 400 });
  }

  const upstream = await fetch(`${HOST}/${path}`);
  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
