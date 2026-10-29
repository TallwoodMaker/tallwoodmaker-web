import { applyLeadRetention } from "@/lib/leadRetention";

/**
 * Daily Vercel cron (vercel.json). Vercel sends
 * "Authorization: Bearer $CRON_SECRET"; anything else is rejected, and the
 * endpoint refuses to run at all if CRON_SECRET isn't configured.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await applyLeadRetention();
    console.log("Lead retention:", result);
    return Response.json(result);
  } catch (error) {
    console.error("Lead retention failed:", error);
    return new Response("Retention failed", { status: 500 });
  }
}
