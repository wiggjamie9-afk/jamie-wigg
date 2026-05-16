"use client";

/**
 * Replicate-token panel for /settings (R3).
 *
 * Two distinct concepts here:
 *   - "Stored" — there's an encrypted payload in localStorage. Set once,
 *     persists across reloads.
 *   - "Unlocked" — the derived key + plaintext token live in module memory
 *     for this tab. Required before any code path can actually make a
 *     Replicate request via `getSessionToken()`. Wiped on tab close.
 *
 * UI states we render explicitly:
 *   - No stored token → show Save form (passphrase + token + Save).
 *   - Stored, locked → show Unlock form (passphrase + Unlock) and a "replace"
 *     toggle that brings back the full Save form.
 *   - Stored, unlocked → show "Unlocked for this session" badge + Lock + Clear.
 *
 * Hard rules:
 *   - We NEVER log the token, passphrase, or any derived value. The error
 *     paths (`setError`) all use opaque messages.
 *   - Replicate token format guard is a SOFT warning. Their token format may
 *     drift; blocking on a regex would be a foot-gun.
 */

import { useCallback, useEffect, useState } from "react";
import {
  clearToken,
  getSessionToken,
  hasStoredToken,
  lockSession,
  setToken,
  unlockSession,
} from "../../lib/secrets";

type Status = "no-token" | "locked" | "unlocked";

const TOKEN_HINT_REGEX = /^r8_[A-Za-z0-9]{10,}$/;

export function ReplicateTokenPanel() {
  const [status, setStatus] = useState<Status>("no-token");
  const [passphrase, setPassphrase] = useState("");
  const [token, setTokenInput] = useState("");
  const [unlockPassphrase, setUnlockPassphrase] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Refresh status from storage on mount AND whenever the user takes an
  // action — both `hasStoredToken()` and `getSessionToken()` are cheap.
  const refresh = useCallback(() => {
    const stored = hasStoredToken();
    const session = getSessionToken();
    if (!stored) setStatus("no-token");
    else if (session) setStatus("unlocked");
    else setStatus("locked");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearMessages = () => {
    setError(null);
    setInfo(null);
  };

  // ---- Save (encrypt + persist) ---------------------------------------

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearMessages();
      if (!passphrase || !token) {
        setError("Both passphrase and token are required.");
        return;
      }
      if (!TOKEN_HINT_REGEX.test(token)) {
        // Soft warning — still proceed.
        setInfo(
          "Heads-up: Replicate tokens usually start with `r8_`. Saving anyway.",
        );
      }
      setBusy(true);
      try {
        await setToken(token, passphrase);
        // Wipe the local input copies as soon as encryption finishes. The
        // React state is in-memory only, but no reason to keep it lingering.
        setTokenInput("");
        setPassphrase("");
        setShowReplace(false);
        refresh();
        setInfo((prev) => prev ?? "Token saved. Unlock it to use this tab.");
      } catch {
        setError("Couldn't save token. WebCrypto may be unavailable.");
      } finally {
        setBusy(false);
      }
    },
    [passphrase, token, refresh],
  );

  // ---- Unlock (decrypt into memory for this tab) ----------------------

  const handleUnlock = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearMessages();
      if (!unlockPassphrase) {
        setError("Enter your passphrase.");
        return;
      }
      setBusy(true);
      try {
        const ok = await unlockSession(unlockPassphrase);
        setUnlockPassphrase("");
        if (!ok) {
          setError("Couldn't unlock — passphrase doesn't match.");
        } else {
          setInfo("Unlocked for this tab. Locks again when you close the tab.");
        }
        refresh();
      } catch {
        setError("Couldn't unlock the stored token.");
      } finally {
        setBusy(false);
      }
    },
    [unlockPassphrase, refresh],
  );

  // ---- Lock (wipe in-memory copy) -------------------------------------

  const handleLock = useCallback(() => {
    clearMessages();
    lockSession();
    refresh();
    setInfo("Locked. You'll need your passphrase again for this tab.");
  }, [refresh]);

  // ---- Clear (destroy the encrypted payload entirely) -----------------

  const handleClear = useCallback(() => {
    clearMessages();
    const ok = window.confirm(
      "Clear your stored Replicate token? You'll need to paste it again to render.",
    );
    if (!ok) return;
    clearToken();
    setShowReplace(false);
    refresh();
    setInfo("Token cleared.");
  }, [refresh]);

  // ---- Render ---------------------------------------------------------

  return (
    <section
      aria-labelledby="replicate-token-heading"
      className="rounded-[var(--radius-rhythmix-lg)] border border-rhythmix-border-strong bg-rhythmix-surface p-5 sm:p-6"
    >
      <header className="mb-4">
        <h2
          id="replicate-token-heading"
          className="font-rhythmix-display text-lg font-bold text-rhythmix-text"
        >
          Replicate API token
        </h2>
        <p className="mt-1 text-sm text-rhythmix-text-soft">
          Encrypted with a passphrase you set, then stored on this device.
          We never send your token to our servers.
        </p>
      </header>

      <StatusBadge status={status} />

      {/* "No token" → Save form */}
      {status === "no-token" || showReplace ? (
        <form className="mt-4 space-y-3" onSubmit={handleSave}>
          <Field
            label="Passphrase"
            type="password"
            value={passphrase}
            onChange={setPassphrase}
            placeholder="Pick something you'll remember"
            autoComplete="new-password"
          />
          <Field
            label="Replicate token"
            type="password"
            value={token}
            onChange={setTokenInput}
            placeholder="r8_..."
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy}
              className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-4 py-2 text-sm font-semibold text-rhythmix-text hover:bg-rhythmix-pink disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            >
              {busy ? "Encrypting…" : "Save token"}
            </button>
            {status !== "no-token" ? (
              <button
                type="button"
                onClick={() => setShowReplace(false)}
                className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      {/* "Locked" → Unlock form (and Replace toggle) */}
      {status === "locked" && !showReplace ? (
        <form className="mt-4 space-y-3" onSubmit={handleUnlock}>
          <Field
            label="Passphrase"
            type="password"
            value={unlockPassphrase}
            onChange={setUnlockPassphrase}
            placeholder="Your passphrase"
            autoComplete="current-password"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy}
              className="min-h-[44px] rounded-[var(--radius-rhythmix-md)] bg-rhythmix-magenta px-4 py-2 text-sm font-semibold text-rhythmix-text hover:bg-rhythmix-pink disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rhythmix-cyan transition-colors duration-[var(--duration-rhythmix-fast)] ease-[var(--ease-rhythmix-out)]"
            >
              {busy ? "Unlocking…" : "Unlock for this session"}
            </button>
            <button
              type="button"
              onClick={() => setShowReplace(true)}
              className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Replace token
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[44px] rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Clear token
            </button>
          </div>
        </form>
      ) : null}

      {/* "Unlocked" → Lock + Clear */}
      {status === "unlocked" && !showReplace ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleLock}
            className="min-h-[44px] rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            Lock session
          </button>
          <button
            type="button"
            onClick={() => setShowReplace(true)}
            className="min-h-[44px] rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Replace token
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[44px] rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Clear token
          </button>
        </div>
      ) : null}

      <Messages error={error} info={info} />
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; tone: string }> = {
    "no-token": {
      label: "No token set",
      tone: "border-neutral-200 bg-neutral-50 text-neutral-700",
    },
    locked: {
      label: "Token stored — locked",
      tone: "border-amber-200 bg-amber-50 text-amber-900",
    },
    unlocked: {
      label: "Token stored — unlocked for this session",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
  };
  const { label, tone } = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}

function Field(props: {
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  spellCheck?: boolean;
}) {
  const { label, type, value, onChange, placeholder, autoComplete, spellCheck } = props;
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-medium text-neutral-800">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        spellCheck={spellCheck ?? true}
        className="mt-1 block w-full min-h-[44px] rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
    </label>
  );
}

function Messages({
  error,
  info,
}: {
  error: string | null;
  info: string | null;
}) {
  if (!error && !info) return null;
  return (
    <div className="mt-3 space-y-2">
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          {info}
        </p>
      ) : null}
    </div>
  );
}
