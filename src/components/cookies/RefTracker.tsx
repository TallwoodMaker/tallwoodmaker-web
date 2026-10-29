"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "./ConsentContext";
import { REF_COOKIE, REF_MAX_AGE, isRef, type Ref } from "@/config/ref";

function writeRefCookie(value: string, maxAge: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${REF_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

/**
 * Stores ?ref=ig|tt|yt in the twm_ref cookie (30 days) — but only once the
 * visitor has accepted analytics cookies. Until then the value is kept in
 * memory only, so accepting the banner later on the same visit (even after
 * client-side navigation away from the ?ref= URL) still records it.
 * Withdrawing analytics consent deletes the cookie. Renders nothing.
 */
export default function RefTracker() {
  const { ready, consent } = useConsent();
  const pendingRef = useRef<Ref | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(location.search).get("ref");
    if (isRef(ref)) pendingRef.current = ref;
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (consent.analytics) {
      if (pendingRef.current) {
        writeRefCookie(pendingRef.current, REF_MAX_AGE);
        pendingRef.current = null;
      }
    } else if (document.cookie.includes(`${REF_COOKIE}=`)) {
      writeRefCookie("", 0);
    }
  }, [ready, consent.analytics]);

  return null;
}
