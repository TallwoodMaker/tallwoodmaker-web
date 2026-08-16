import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function addToWaitlist(email: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("waitlist")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) throw error;
}
