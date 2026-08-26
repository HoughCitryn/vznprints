export function GET() {
  return new Response("<!doctype html><html lang=\"en\"><head><meta name=\"robots\" content=\"noindex\"><title>Gone</title></head><body><h1>410 Gone</h1></body></html>", {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
