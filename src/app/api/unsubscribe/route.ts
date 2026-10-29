import { unsubscribeByToken } from "@/lib/unsubscribe";

/**
 * One-click unsubscribe (RFC 8058) for the List-Unsubscribe-Post header:
 * mail clients POST here directly. Only POST unsubscribes — link scanners
 * that prefetch GET URLs must never be able to do it.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const result = await unsubscribeByToken(token);
  return new Response(null, {
    status: result === "ok" ? 200 : result === "invalid" ? 400 : 500,
  });
}
