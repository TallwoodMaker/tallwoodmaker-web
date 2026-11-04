"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLATFORMS, PLATFORM_LABELS } from "@/config/social";
import { saveSocialStats, type SocialFormState } from "./actions";

const initialState: SocialFormState = { status: "idle" };

const NUMBER_FIELDS = [
  ["followers", "Followers"],
  ["views", "Views"],
  ["saves", "Saves"],
  ["comments", "Comments"],
  ["profile_visits", "Profile visits"],
  ["link_clicks", "Link clicks"],
] as const;

const inputClass =
  "h-11 w-full min-w-0 rounded-[10px] border-[1.5px] border-ink bg-white px-3 text-[16px] text-ink";

/** Weekly social numbers, one platform per save. */
export default function SocialForm({ weekStart }: { weekStart: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    saveSocialStats,
    initialState
  );

  useEffect(() => {
    if (state.status === "saved") router.refresh();
  }, [state, router]);

  return (
    <form
      onSubmit={(event) => {
        // onSubmit (not action=) so the numbers stay filled in on an error.
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      <label className="col-span-1 flex min-w-0 flex-col gap-1 text-[13px] font-semibold">
        Week of (Monday)
        <input type="date" name="week_start" defaultValue={weekStart} required className={inputClass} />
      </label>
      <label className="col-span-1 flex min-w-0 flex-col gap-1 text-[13px] font-semibold">
        Platform
        <select name="platform" defaultValue="instagram" className={`${inputClass} cursor-pointer`}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </label>
      {NUMBER_FIELDS.map(([name, label]) => (
        <label key={name} className="flex min-w-0 flex-col gap-1 text-[13px] font-semibold">
          {label}
          <input type="text" inputMode="numeric" name={name} className={inputClass} />
        </label>
      ))}
      <label className="col-span-2 flex min-w-0 flex-col gap-1 text-[13px] font-semibold sm:col-span-4">
        Best post (link)
        <input type="url" name="best_post_url" placeholder="https://www.instagram.com/p/…" className={inputClass} />
      </label>
      <div className="col-span-2 flex flex-wrap items-center gap-3 sm:col-span-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 cursor-pointer rounded-[10px] bg-ink px-5 text-[15px] font-semibold text-cream disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save week"}
        </button>
        <p role="status" className="text-[14px]">
          {state.status === "saved"
            ? "Saved. Same week + platform again overwrites it."
            : state.status === "error"
              ? state.message
              : ""}
        </p>
      </div>
    </form>
  );
}
