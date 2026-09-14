import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { listAllContent } from "@/lib/premiumContent";
import SignInForm from "./SignInForm";
import ContentForm from "./ContentForm";
import ContentList from "./ContentList";

export const metadata: Metadata = {
  title: "Premium Content Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPremiumContentPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; error?: string }>;
}) {
  const { edit, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return (
      <section className="container-page section-px flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-2xl font-bold">Admin sign-in</h1>
        {error === "link_expired" && (
          <p className="max-w-[380px] text-[15px] text-link">
            That link expired or was already used. Request a new one below.
          </p>
        )}
        <SignInForm />
      </section>
    );
  }

  if (!isAdmin(user.email)) {
    return (
      <section className="container-page section-px flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="text-ink-muted">
          {user.email} doesn&apos;t have access to this page.
        </p>
      </section>
    );
  }

  const entries = await listAllContent();
  const editingEntry = edit
    ? (entries.find((entry) => entry.id === edit) ?? null)
    : null;

  return (
    <section className="container-page section-px py-[clamp(24px,5vw,64px)]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Premium Content</h1>
        <Link href="/premium" className="text-sm text-link">
          View member page →
        </Link>
      </div>

      <div className="mb-10 rounded-md border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">
          {editingEntry ? `Edit "${editingEntry.title}"` : "Add new entry"}
        </h2>
        <ContentForm key={editingEntry?.id ?? "new"} editing={editingEntry} />
        {editingEntry && (
          <Link
            href="/admin/premium-content"
            className="mt-3 inline-block text-sm text-ink-muted"
          >
            Cancel edit
          </Link>
        )}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Existing entries</h2>
      <ContentList entries={entries} />
    </section>
  );
}
