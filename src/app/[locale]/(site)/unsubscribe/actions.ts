"use server";

import { unsubscribeByToken } from "@/lib/unsubscribe";

export type UnsubscribeState = { status: "idle" | "done" | "invalid" | "error" };

export async function unsubscribe(
  _prev: UnsubscribeState,
  formData: FormData
): Promise<UnsubscribeState> {
  const result = await unsubscribeByToken(String(formData.get("token") ?? ""));
  return { status: result === "ok" ? "done" : result };
}
