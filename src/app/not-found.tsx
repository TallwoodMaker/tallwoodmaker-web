import Link from "next/link";
import "./globals.css";

// Only reached for requests the locale proxy doesn't handle (it covers every
// page URL), so a bare English fallback is enough here.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream p-6 text-center font-sans text-ink">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <Link href="/" className="font-semibold underline">
          Back to the homepage
        </Link>
      </body>
    </html>
  );
}
