/**
 * Tab coordinator — detects a second tab of Studio open on the same origin
 * and notifies consumers so they can show a banner per R14.
 *
 * Pure module — no React. The class is safe to instantiate in any
 * runtime: if `BroadcastChannel` isn't available it silently no-ops, and
 * the consumer (`CapabilityGate`) should gate construction on the
 * capability report anyway.
 *
 * Hello protocol
 * --------------
 * - On construction, this tab broadcasts `{ type: "hello" }`.
 * - When another tab is already open and receives a `hello`, it responds
 *   with its own `{ type: "hello" }`. That second hello reaches the new
 *   tab, which is how both ends learn of each other (the original tab
 *   wouldn't know otherwise — `BroadcastChannel.postMessage` does not echo
 *   back to the sender).
 * - On `close()` (typically tied to `pagehide`), this tab broadcasts
 *   `{ type: "goodbye" }` so the surviving tab can drop the banner if it
 *   was the last duplicate.
 *
 * That handshake means the existing tab also re-announces itself only when
 * it sees a fresh `hello` — it doesn't spam the channel.
 */

export const TAB_CHANNEL_NAME = "rhythmix-studio-tabs";

type TabMessage = { type: "hello" } | { type: "goodbye" };

type OtherTabCallback = () => void;

export class TabCoordinator {
  private channel: BroadcastChannel | null = null;
  private callbacks: Set<OtherTabCallback> = new Set();
  private closed = false;

  constructor(channelName: string = TAB_CHANNEL_NAME) {
    if (typeof BroadcastChannel === "undefined") {
      // No-op fallback. Consumers should have already checked
      // capability-detect.broadcastChannel before constructing us, but we
      // refuse to throw either way — second-tab detection is non-blocking.
      return;
    }

    try {
      this.channel = new BroadcastChannel(channelName);
    } catch {
      this.channel = null;
      return;
    }

    this.channel.addEventListener("message", this.handleMessage);

    // Announce ourselves.
    this.post({ type: "hello" });
  }

  /**
   * Subscribe to "another tab is open" notifications. The callback fires
   * once per `hello` we receive, which is at least once per other tab and
   * may be twice (once for our initial hello → their reply, plus once more
   * if they decide to re-announce). Consumers should be idempotent.
   */
  onOtherTabDetected(callback: OtherTabCallback): void {
    this.callbacks.add(callback);
  }

  /**
   * Tear down the channel. Sends `goodbye` so the surviving tab can drop
   * its banner. Idempotent.
   */
  close(): void {
    if (this.closed) return;
    this.closed = true;

    this.post({ type: "goodbye" });

    if (this.channel) {
      try {
        this.channel.removeEventListener("message", this.handleMessage);
        this.channel.close();
      } catch {
        // Swallow — the page is going away anyway.
      }
      this.channel = null;
    }

    this.callbacks.clear();
  }

  /**
   * Whether this coordinator actually has a working BroadcastChannel.
   * Useful for tests and for consumers that want to surface a "second-tab
   * detection unavailable" hint.
   */
  get isActive(): boolean {
    return this.channel !== null && !this.closed;
  }

  private post(message: TabMessage): void {
    if (!this.channel) return;
    try {
      this.channel.postMessage(message);
    } catch {
      // Channel closed mid-flight; nothing we can do.
    }
  }

  private handleMessage = (event: MessageEvent<TabMessage>): void => {
    const message = event.data;
    if (!message || typeof message !== "object") return;

    if (message.type === "hello") {
      // Re-announce so the *new* tab learns about *us*. We only do this in
      // response to someone else's hello — not on our own — so we don't
      // loop infinitely.
      this.post({ type: "hello" });
      for (const cb of this.callbacks) {
        try {
          cb();
        } catch {
          // Don't let a buggy subscriber kill the others.
        }
      }
    }
    // `goodbye` is informational — we don't act on it directly yet, but the
    // shape is reserved so future consumers can subscribe to it without
    // changing the wire protocol.
  };
}
