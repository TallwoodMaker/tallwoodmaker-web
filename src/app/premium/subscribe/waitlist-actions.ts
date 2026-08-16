"use server";

import { addToWaitlist } from "@/lib/waitlist";

export type WaitlistState = {
  status: "idle" | "joined" | "error";
  message?: string;
};

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    await addToWaitlist(email);
  } catch {
    return {
      status: "error",
      message: "Couldn't join the waitlist. Please try again.",
    };
  }

  return { status: "joined" };
}
