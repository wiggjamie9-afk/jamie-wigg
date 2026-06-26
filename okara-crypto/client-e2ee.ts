/**
 * Okara Crypto — client-e2ee
 *
 * Pure TypeScript/JavaScript end-to-end encryption primitives built on
 * X25519 key exchange, Argon2id password hashing, and AES-256-GCM
 * authenticated encryption. Designed to run browser-native on top of the
 * Web Crypto API (`crypto.subtle`), with X25519 supplied by `@noble/curves`
 * and Argon2id by `@phi-ag/argon2` (WebAssembly).
 *
 * Security parameters (see README.md):
 *   - X25519            Curve25519 ECDH key agreement
 *   - Argon2id          128 MiB, 4 iterations, 2 lanes, 32-byte output
 *   - AES-256-GCM       Authenticated encryption (96-bit IV, 128-bit tag)
 *   - HKDF-SHA512       Shared-secret -> AES key derivation
 *   - PBKDF2-SHA256     Recovery-code key derivation (100k iterations)
 *   - HMAC-SHA256       Optional server-side pepper applied to the passcode
 *
 * Built by okara.ai for secure LLM Chat applications. MIT licensed.
 */

import { x25519 } from "@noble/curves/ed25519.js";
import Argon2, {
  Argon2Type,
  Argon2Version,
} from "@phi-ag/argon2";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

/** Argon2id memory cost in KiB (128 MiB). */
const ARGON2_MEMORY_KIB = 128 * 1024;
/** Argon2id iterations (time cost). */
const ARGON2_ITERATIONS = 4;
/** Argon2id parallelism (lanes). */
const ARGON2_PARALLELISM = 2;

/** Symmetric key length in bytes (AES-256). */
const KEY_LENGTH = 32;
/** Salt length in bytes. */
const SALT_LENGTH = 16;
/** AES-GCM IV length in bytes (96 bits, the GCM standard). */
const IV_LENGTH = 12;
/** AES-GCM authentication tag length in bytes (128 bits). */
const TAG_LENGTH = 16;
/** Raw X25519 key length in bytes. */
const X25519_KEY_LENGTH = 32;
/** PBKDF2 iterations for recovery-code key derivation. */
const PBKDF2_ITERATIONS = 100_000;
/** Number of recovery codes generated per account. */
const RECOVERY_CODE_COUNT = 6;

/** Context string mixed into HKDF when deriving per-message AES keys. */
const MESSAGE_HKDF_INFO = "okara-e2ee/x25519-aes256gcm/v1";

/**
 * Fixed PKCS#8 PrivateKeyInfo prefix for an X25519 (OID 1.3.101.110)
 * 32-byte secret key. The raw key follows these 16 bytes for a 48-byte DER.
 */
const X25519_PKCS8_PREFIX = new Uint8Array([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x6e, 0x04,
  0x22, 0x04, 0x20,
]);

/* -------------------------------------------------------------------------- */
/*  Public types                                                              */
/* -------------------------------------------------------------------------- */

/** A freshly generated X25519 key pair. */
export interface X25519KeyPair {
  /** Base64-encoded 32-byte raw public key. */
  publicKey: string;
  /** PEM-formatted (PKCS#8) private key. */
  privateKey: string;
}

/** One stored recovery-code record (safe to persist server-side). */
export interface RecoveryCodeRecord {
  /** Base64 SHA-256 hash of the recovery code, for lookup/verification. */
  hash: string;
  /** AES-256-GCM ciphertext (base64) of the user's passcode. */
  encryptedPasscode: string;
}

/** Result of {@link generateRecoveryCodes}. */
export interface RecoveryCodesResult {
  /** Plaintext codes to display to the user exactly once. */
  recoveryCodes: string[];
  /** Records to persist (hashed + encrypted; never the plaintext code). */
  recoveryCodesData: RecoveryCodeRecord[];
}

/* -------------------------------------------------------------------------- */
/*  Runtime plumbing (crypto + argon2 initialisation)                         */
/* -------------------------------------------------------------------------- */

/** Resolve the Web Crypto SubtleCrypto, with a clear error if unavailable. */
function subtle(): SubtleCrypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c?.subtle) {
    throw new Error(
      "Web Crypto API (crypto.subtle) is not available in this environment."
    );
  }
  return c.subtle;
}

/** Fill a Uint8Array with cryptographically secure random bytes. */
function randomBytes(length: number): Uint8Array {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c?.getRandomValues) {
    throw new Error("crypto.getRandomValues is not available.");
  }
  return c.getRandomValues(new Uint8Array(length));
}

/** A function that returns an initialised Argon2 instance. */
export type Argon2Initializer = () => Promise<Argon2>;

let argon2Instance: Argon2 | null = null;
let argon2Initializer: Argon2Initializer | null = null;

/**
 * Override how the Argon2id WebAssembly module is loaded. Call this once at
 * startup in non-bundler environments (e.g. Node, Deno, custom wasm hosting):
 *
 * ```ts
 * import initialize from "@phi-ag/argon2/node";
 * setArgon2Initializer(() => initialize());
 * ```
 */
export function setArgon2Initializer(init: Argon2Initializer): void {
  argon2Initializer = init;
  argon2Instance = null;
}

/** Lazily initialise (and cache) the Argon2id WebAssembly instance. */
async function getArgon2(): Promise<Argon2> {
  if (argon2Instance) return argon2Instance;

  if (!argon2Initializer) {
    // Default: browser-native loader. Modern bundlers (Vite, webpack 5) rewrite
    // `new URL(<asset>, import.meta.url)` to the emitted wasm asset URL.
    argon2Initializer = async () => {
      const { default: initialize } = await import("@phi-ag/argon2/fetch");
      const wasmUrl = new URL(
        "@phi-ag/argon2/argon2.wasm",
        import.meta.url
      ).href;
      return initialize(wasmUrl);
    };
  }

  try {
    argon2Instance = await argon2Initializer();
  } catch (err) {
    throw new Error(
      "Failed to initialise the Argon2id WebAssembly module. In Node/Deno or " +
        "custom hosting, call setArgon2Initializer() with a loader (e.g. " +
        '`import initialize from "@phi-ag/argon2/node"`) before hashing. ' +
        `Cause: ${(err as Error).message}`
    );
  }
  return argon2Instance;
}

/* -------------------------------------------------------------------------- */
/*  Encoding helpers                                                          */
/* -------------------------------------------------------------------------- */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** Encode bytes as a standard (non-URL-safe) base64 string. */
export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  // Node fallback.
  return Buffer.from(bytes).toString("base64");
}

/** Decode a standard base64 string to bytes. */
export function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, "base64"));
}

/** Lowercase hex encoding. */
function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/** Concatenate any number of byte arrays. */
function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

/**
 * Return a tight ArrayBuffer view of a Uint8Array. Web Crypto rejects
 * SharedArrayBuffer-backed and offset views in some engines, so we copy when
 * the view does not cover its whole buffer.
 */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  if (bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) {
    return bytes.buffer as ArrayBuffer;
  }
  return bytes.slice().buffer as ArrayBuffer;
}

/* -------------------------------------------------------------------------- */
/*  PEM / PKCS#8 helpers for X25519 private keys                              */
/* -------------------------------------------------------------------------- */

/** Wrap a raw 32-byte X25519 secret key as a PEM-encoded PKCS#8 private key. */
function rawSecretToPem(rawSecret: Uint8Array): string {
  if (rawSecret.length !== X25519_KEY_LENGTH) {
    throw new Error("X25519 secret key must be 32 bytes.");
  }
  const der = concatBytes(X25519_PKCS8_PREFIX, rawSecret);
  const b64 = bytesToBase64(der);
  const lines = b64.match(/.{1,64}/g) ?? [b64];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join(
    "\n"
  )}\n-----END PRIVATE KEY-----`;
}

/** Extract the raw 32-byte X25519 secret key from a PEM-encoded PKCS#8 key. */
function pemToRawSecret(pem: string): Uint8Array {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  if (!body) {
    throw new Error("Invalid PEM private key: empty body.");
  }
  const der = base64ToBytes(body);
  if (der.length !== X25519_PKCS8_PREFIX.length + X25519_KEY_LENGTH) {
    throw new Error("Invalid X25519 PKCS#8 private key length.");
  }
  for (let i = 0; i < X25519_PKCS8_PREFIX.length; i++) {
    if (der[i] !== X25519_PKCS8_PREFIX[i]) {
      throw new Error("Unrecognised PKCS#8 prefix; expected X25519 private key.");
    }
  }
  return der.slice(X25519_PKCS8_PREFIX.length);
}

/* -------------------------------------------------------------------------- */
/*  Low-level symmetric helpers                                              */
/* -------------------------------------------------------------------------- */

/** Import 32 raw bytes as a non-extractable AES-256-GCM CryptoKey. */
async function importAesKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  if (keyBytes.length !== KEY_LENGTH) {
    throw new Error("AES-256 key must be 32 bytes.");
  }
  return subtle().importKey(
    "raw",
    toArrayBuffer(keyBytes),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * AES-256-GCM encrypt `plaintext` with `keyBytes`, returning
 * `base64(iv || ciphertext || tag)`.
 */
async function aesGcmEncrypt(
  keyBytes: Uint8Array,
  plaintext: Uint8Array
): Promise<string> {
  const key = await importAesKey(keyBytes);
  const iv = randomBytes(IV_LENGTH);
  const cipher = new Uint8Array(
    await subtle().encrypt(
      { name: "AES-GCM", iv: toArrayBuffer(iv), tagLength: TAG_LENGTH * 8 },
      key,
      toArrayBuffer(plaintext)
    )
  );
  // Web Crypto appends the tag; store as iv || ciphertext || tag (tag already
  // trails `cipher`, so iv || cipher is exactly that layout).
  return bytesToBase64(concatBytes(iv, cipher));
}

/** Reverse {@link aesGcmEncrypt}. */
async function aesGcmDecrypt(
  keyBytes: Uint8Array,
  payloadB64: string
): Promise<Uint8Array> {
  const payload = base64ToBytes(payloadB64);
  if (payload.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error("Ciphertext too short.");
  }
  const iv = payload.slice(0, IV_LENGTH);
  const cipher = payload.slice(IV_LENGTH);
  const key = await importAesKey(keyBytes);
  const plain = await subtle().decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv), tagLength: TAG_LENGTH * 8 },
    key,
    toArrayBuffer(cipher)
  );
  return new Uint8Array(plain);
}

/* -------------------------------------------------------------------------- */
/*  Key derivation                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Apply the optional server-side pepper. When a pepper is supplied, the
 * passcode is run through HMAC-SHA256 (keyed by the pepper) and the resulting
 * digest (hex) becomes the Argon2id password. Without a pepper, the passcode
 * is used directly.
 */
async function applyPepper(
  passcode: string,
  pepper?: string
): Promise<string> {
  if (!pepper) return passcode;
  const key = await subtle().importKey(
    "raw",
    toArrayBuffer(textEncoder.encode(pepper)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await subtle().sign(
    "HMAC",
    key,
    toArrayBuffer(textEncoder.encode(passcode))
  );
  return bytesToHex(new Uint8Array(mac));
}

/**
 * Derive a raw 32-byte key from a passcode using Argon2id. Internal helper
 * shared by {@link hashPasscode}, {@link encryptPrivateKey} and
 * {@link decryptPrivateKey}.
 */
async function deriveKeyFromPasscode(
  passcode: string,
  saltBytes: Uint8Array,
  pepper?: string
): Promise<Uint8Array> {
  const argon2 = await getArgon2();
  const password = await applyPepper(passcode, pepper);
  const { hash } = argon2.hash(password, {
    salt: saltBytes,
    hashLength: KEY_LENGTH,
    timeCost: ARGON2_ITERATIONS,
    memoryCost: ARGON2_MEMORY_KIB,
    parallelism: ARGON2_PARALLELISM,
    type: Argon2Type.Argon2id,
    version: Argon2Version.Version13,
  });
  return new Uint8Array(hash);
}

/** Derive `length` bytes via PBKDF2-SHA256 from `password` and `salt`. */
async function pbkdf2(
  password: string,
  saltBytes: Uint8Array,
  length: number
): Promise<Uint8Array> {
  const baseKey = await subtle().importKey(
    "raw",
    toArrayBuffer(textEncoder.encode(password)),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await subtle().deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: toArrayBuffer(saltBytes),
      iterations: PBKDF2_ITERATIONS,
    },
    baseKey,
    length * 8
  );
  return new Uint8Array(bits);
}

/** Derive a 32-byte AES key from an X25519 shared secret via HKDF-SHA512. */
async function hkdfSharedSecret(sharedSecret: Uint8Array): Promise<Uint8Array> {
  const baseKey = await subtle().importKey(
    "raw",
    toArrayBuffer(sharedSecret),
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );
  const bits = await subtle().deriveBits(
    {
      name: "HKDF",
      hash: "SHA-512",
      salt: new Uint8Array(0),
      info: toArrayBuffer(textEncoder.encode(MESSAGE_HKDF_INFO)),
    },
    baseKey,
    KEY_LENGTH * 8
  );
  return new Uint8Array(bits);
}

/* -------------------------------------------------------------------------- */
/*  Public API: key pairs                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Generate an X25519 key pair.
 *
 * @returns `publicKey` (base64 raw 32 bytes) and `privateKey` (PEM PKCS#8).
 */
export async function generateX25519KeyPair(): Promise<X25519KeyPair> {
  const { secretKey, publicKey } = x25519.keygen();
  return {
    publicKey: bytesToBase64(new Uint8Array(publicKey)),
    privateKey: rawSecretToPem(new Uint8Array(secretKey)),
  };
}

/* -------------------------------------------------------------------------- */
/*  Public API: salts & passcode hashing                                      */
/* -------------------------------------------------------------------------- */

/** Generate a fresh random salt, base64-encoded. */
export function generateSalt(): string {
  return bytesToBase64(randomBytes(SALT_LENGTH));
}

/**
 * Hash a passcode with Argon2id (optionally peppered) and return the
 * base64-encoded 32-byte derived key. Use this when you need to store a
 * verifier or transmit a derived key to a server.
 *
 * @param passcode  The user's passcode (e.g. a 6-digit PIN).
 * @param salt      Base64 salt from {@link generateSalt}.
 * @param pepper    Optional server secret mixed in via HMAC-SHA256.
 */
export async function hashPasscode(
  passcode: string,
  salt: string,
  pepper?: string
): Promise<string> {
  const key = await deriveKeyFromPasscode(passcode, base64ToBytes(salt), pepper);
  return bytesToBase64(key);
}

/* -------------------------------------------------------------------------- */
/*  Public API: private-key encryption at rest                                */
/* -------------------------------------------------------------------------- */

/**
 * Encrypt a PEM private key with a passcode-derived (Argon2id) AES-256-GCM key.
 * Returns `base64(iv || ciphertext || tag)`, safe to store alongside the salt.
 */
export async function encryptPrivateKey(
  privateKey: string,
  passcode: string,
  salt: string,
  pepper?: string
): Promise<string> {
  const key = await deriveKeyFromPasscode(passcode, base64ToBytes(salt), pepper);
  return aesGcmEncrypt(key, textEncoder.encode(privateKey));
}

/** Reverse {@link encryptPrivateKey}, returning the original PEM private key. */
export async function decryptPrivateKey(
  encryptedKey: string,
  passcode: string,
  salt: string,
  pepper?: string
): Promise<string> {
  const key = await deriveKeyFromPasscode(passcode, base64ToBytes(salt), pepper);
  const plain = await aesGcmDecrypt(key, encryptedKey);
  return textDecoder.decode(plain);
}

/* -------------------------------------------------------------------------- */
/*  Public API: message encryption (X25519 + HKDF + AES-GCM)                   */
/* -------------------------------------------------------------------------- */

/**
 * Encrypt a message for a recipient using their X25519 public key.
 *
 * A fresh ephemeral key pair is generated per message; the shared secret is
 * derived via ECDH, expanded with HKDF-SHA512, and used to AES-256-GCM encrypt
 * the plaintext. The output is `base64(ephemeralPublicKey || iv || ciphertext
 * || tag)`.
 *
 * @param plaintext           The message to encrypt.
 * @param recipientPublicKey  Base64 raw 32-byte public key (from
 *                            {@link generateX25519KeyPair}).
 */
export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: string
): Promise<string> {
  const recipientPub = base64ToBytes(recipientPublicKey);
  if (recipientPub.length !== X25519_KEY_LENGTH) {
    throw new Error("Recipient public key must be a 32-byte X25519 key.");
  }

  const ephemeral = x25519.keygen();
  const sharedSecret = new Uint8Array(
    x25519.getSharedSecret(ephemeral.secretKey, recipientPub)
  );
  const aesKey = await hkdfSharedSecret(sharedSecret);
  const sealed = await aesGcmEncrypt(aesKey, textEncoder.encode(plaintext));

  // Prepend the ephemeral public key so the recipient can derive the secret.
  return bytesToBase64(
    concatBytes(new Uint8Array(ephemeral.publicKey), base64ToBytes(sealed))
  );
}

/**
 * Decrypt a message produced by {@link encryptMessage} using the recipient's
 * PEM private key.
 */
export async function decryptMessage(
  encrypted: string,
  recipientPrivateKey: string
): Promise<string> {
  const blob = base64ToBytes(encrypted);
  if (blob.length < X25519_KEY_LENGTH + IV_LENGTH + TAG_LENGTH) {
    throw new Error("Encrypted message is too short.");
  }
  const ephemeralPub = blob.slice(0, X25519_KEY_LENGTH);
  const sealed = blob.slice(X25519_KEY_LENGTH);

  const recipientSecret = pemToRawSecret(recipientPrivateKey);
  const sharedSecret = new Uint8Array(
    x25519.getSharedSecret(recipientSecret, ephemeralPub)
  );
  const aesKey = await hkdfSharedSecret(sharedSecret);
  const plain = await aesGcmDecrypt(aesKey, bytesToBase64(sealed));
  return textDecoder.decode(plain);
}

/* -------------------------------------------------------------------------- */
/*  Public API: recovery codes                                                */
/* -------------------------------------------------------------------------- */

/** Unambiguous alphabet (no 0/O/1/I) for human-readable recovery codes. */
const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Generate one formatted recovery code, e.g. `K4M9N-PQR7T-WXY3Z-...`. */
function generateRecoveryCode(): string {
  const groups = 4;
  const groupLen = 5;
  const bytes = randomBytes(groups * groupLen);
  const chars: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    chars.push(RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length]);
  }
  const out: string[] = [];
  for (let g = 0; g < groups; g++) {
    out.push(chars.slice(g * groupLen, (g + 1) * groupLen).join(""));
  }
  return out.join("-");
}

/** Base64 SHA-256 of a string, used to index/verify recovery codes. */
async function sha256Base64(value: string): Promise<string> {
  const digest = await subtle().digest(
    "SHA-256",
    toArrayBuffer(textEncoder.encode(value))
  );
  return bytesToBase64(new Uint8Array(digest));
}

/**
 * Generate {@link RECOVERY_CODE_COUNT} recovery codes. Each code's PBKDF2-SHA256
 * derived key encrypts the user's passcode with AES-256-GCM, so any single code
 * can later recover the passcode. The returned `recoveryCodes` must be shown to
 * the user once; persist `recoveryCodesData` (hashed + encrypted) instead.
 *
 * @param passcode  The passcode to escrow under each recovery code.
 * @param salt      Base64 salt (typically the account's key-derivation salt).
 */
export async function generateRecoveryCodes(
  passcode: string,
  salt: string
): Promise<RecoveryCodesResult> {
  const saltBytes = base64ToBytes(salt);
  const recoveryCodes: string[] = [];
  const recoveryCodesData: RecoveryCodeRecord[] = [];

  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const code = generateRecoveryCode();
    const key = await pbkdf2(code, saltBytes, KEY_LENGTH);
    const encryptedPasscode = await aesGcmEncrypt(
      key,
      textEncoder.encode(passcode)
    );
    recoveryCodes.push(code);
    recoveryCodesData.push({
      hash: await sha256Base64(code),
      encryptedPasscode,
    });
  }

  return { recoveryCodes, recoveryCodesData };
}

/**
 * Recover a passcode from a stored {@link RecoveryCodeRecord.encryptedPasscode}
 * and the matching recovery code.
 *
 * @param encryptedPasscode  The stored AES-GCM ciphertext (base64).
 * @param recoveryCode       The plaintext recovery code the user supplied.
 * @param salt               The same base64 salt used at generation time.
 */
export async function decryptPasscodeWithRecoveryCode(
  encryptedPasscode: string,
  recoveryCode: string,
  salt: string
): Promise<string> {
  const key = await pbkdf2(recoveryCode, base64ToBytes(salt), KEY_LENGTH);
  const plain = await aesGcmDecrypt(key, encryptedPasscode);
  return textDecoder.decode(plain);
}
