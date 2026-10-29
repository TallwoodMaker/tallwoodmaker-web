import { notFound } from "next/navigation";

// Any unknown path inside a locale renders [locale]/not-found.tsx (with the
// localized header and footer) instead of the bare global 404.
export default function CatchAllPage() {
  notFound();
}
