"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONSENT,
  readStoredConsent,
  writeStoredConsent,
  type ConsentState,
} from "@/lib/consent";

type ConsentChoice = { analytics: boolean; marketing: boolean };

type ConsentContextValue = {
  consent: ConsentState;
  ready: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (choice: ConsentChoice) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [ready, setReady] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Deferred via queueMicrotask rather than calling setState synchronously
    // in the effect body — same pattern as CountdownTimer, satisfies
    // react-hooks/set-state-in-effect.
    queueMicrotask(() => {
      const stored = readStoredConsent();
      if (stored) {
        setConsent({
          necessary: true,
          analytics: stored.analytics,
          marketing: stored.marketing,
        });
        setHasDecision(true);
      }
      setReady(true);
    });
  }, []);

  const persist = useCallback((choice: ConsentChoice) => {
    const stored = writeStoredConsent(choice);
    setConsent({
      necessary: true,
      analytics: stored.analytics,
      marketing: stored.marketing,
    });
    setHasDecision(true);
    setShowPreferences(false);
  }, []);

  const acceptAll = useCallback(
    () => persist({ analytics: true, marketing: true }),
    [persist]
  );
  const rejectNonEssential = useCallback(
    () => persist({ analytics: false, marketing: false }),
    [persist]
  );
  const savePreferences = useCallback(
    (choice: ConsentChoice) => persist(choice),
    [persist]
  );
  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);

  const value: ConsentContextValue = {
    consent,
    ready,
    showBanner: ready && !hasDecision,
    showPreferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    openPreferences,
    closePreferences,
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
