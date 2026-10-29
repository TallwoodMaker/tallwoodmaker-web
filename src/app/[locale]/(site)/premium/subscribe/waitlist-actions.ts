"use server";

import { getTranslations } from "next-intl/server";
import { addToWaitlist } from "@/lib/waitlist";

export type WaitlistState = {
  status: "idle" | "joined" | "error";
  message?: string;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const t = await getTranslations();
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: t("leadForm.invalidEmail") };
  }

  try {
    await addToWaitlist(email);
  } catch (error) {
    console.error("Failed to join waitlist:", error);
    return {
      status: "error",
      message: t("subscribe.waitlist.error"),
    };
  }

  return { status: "joined" };
}
