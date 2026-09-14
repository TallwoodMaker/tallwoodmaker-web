import "server-only";

/**
 * Admin gate for /admin/premium-content. Deliberately independent of
 * src/lib/subscribers.ts — admin access is about who runs the site, not
 * billing status, so it's checked by email against ADMIN_EMAIL rather than
 * an active subscription.
 */
export function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}
