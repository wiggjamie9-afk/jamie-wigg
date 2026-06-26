import { beforeAll, describe, expect, it } from "vitest";
import initializeArgon2 from "@phi-ag/argon2/node";
import {
  base64ToBytes,
  decryptMessage,
  decryptPasscodeWithRecoveryCode,
  decryptPrivateKey,
  encryptMessage,
  encryptPrivateKey,
  generateRecoveryCodes,
  generateSalt,
  generateX25519KeyPair,
  hashPasscode,
  setArgon2Initializer,
} from "./client-e2ee.ts";

// Argon2 ships as WebAssembly. In the browser the default loader fetches the
// emitted wasm asset; under Node/vitest we point it at the local node loader.
beforeAll(() => {
  setArgon2Initializer(() => initializeArgon2());
});

describe("generateX25519KeyPair", () => {
  it("returns a base64 public key and a PEM private key", async () => {
    const { publicKey, privateKey } = await generateX25519KeyPair();
    expect(base64ToBytes(publicKey)).toHaveLength(32);
    expect(privateKey).toContain("-----BEGIN PRIVATE KEY-----");
    expect(privateKey).toContain("-----END PRIVATE KEY-----");
  });

  it("produces a unique key pair each call", async () => {
    const a = await generateX25519KeyPair();
    const b = await generateX25519KeyPair();
    expect(a.publicKey).not.toBe(b.publicKey);
    expect(a.privateKey).not.toBe(b.privateKey);
  });
});

describe("generateSalt", () => {
  it("returns a 16-byte random base64 salt", () => {
    const salt = generateSalt();
    expect(base64ToBytes(salt)).toHaveLength(16);
    expect(salt).not.toBe(generateSalt());
  });
});

describe("hashPasscode", () => {
  it("is deterministic for the same passcode + salt", async () => {
    const salt = generateSalt();
    const a = await hashPasscode("123456", salt);
    const b = await hashPasscode("123456", salt);
    expect(a).toBe(b);
    expect(base64ToBytes(a)).toHaveLength(32);
  });

  it("differs with a different salt", async () => {
    const a = await hashPasscode("123456", generateSalt());
    const b = await hashPasscode("123456", generateSalt());
    expect(a).not.toBe(b);
  });

  it("differs with vs without a pepper", async () => {
    const salt = generateSalt();
    const plain = await hashPasscode("123456", salt);
    const peppered = await hashPasscode("123456", salt, "server-secret");
    expect(plain).not.toBe(peppered);
  });
});

describe("private key encryption", () => {
  it("round-trips a private key through a passcode", async () => {
    const { privateKey } = await generateX25519KeyPair();
    const salt = generateSalt();
    const encrypted = await encryptPrivateKey(privateKey, "123456", salt);
    expect(encrypted).not.toBe(privateKey);
    const decrypted = await decryptPrivateKey(encrypted, "123456", salt);
    expect(decrypted).toBe(privateKey);
  });

  it("round-trips with a pepper", async () => {
    const { privateKey } = await generateX25519KeyPair();
    const salt = generateSalt();
    const pepper = "server-secret";
    const encrypted = await encryptPrivateKey(privateKey, "123456", salt, pepper);
    const decrypted = await decryptPrivateKey(encrypted, "123456", salt, pepper);
    expect(decrypted).toBe(privateKey);
  });

  it("fails to decrypt with the wrong passcode", async () => {
    const { privateKey } = await generateX25519KeyPair();
    const salt = generateSalt();
    const encrypted = await encryptPrivateKey(privateKey, "123456", salt);
    await expect(decryptPrivateKey(encrypted, "000000", salt)).rejects.toThrow();
  });

  it("fails to decrypt with the wrong pepper", async () => {
    const { privateKey } = await generateX25519KeyPair();
    const salt = generateSalt();
    const encrypted = await encryptPrivateKey(privateKey, "123456", salt, "p1");
    await expect(
      decryptPrivateKey(encrypted, "123456", salt, "p2")
    ).rejects.toThrow();
  });
});

describe("message encryption", () => {
  it("lets Alice encrypt for Bob and Bob decrypt", async () => {
    const bob = await generateX25519KeyPair();
    const message = "Hello Bob! \u{1F510} unicode survives.";
    const encrypted = await encryptMessage(message, bob.publicKey);
    const decrypted = await decryptMessage(encrypted, bob.privateKey);
    expect(decrypted).toBe(message);
  });

  it("produces different ciphertext each time (ephemeral keys)", async () => {
    const bob = await generateX25519KeyPair();
    const a = await encryptMessage("same message", bob.publicKey);
    const b = await encryptMessage("same message", bob.publicKey);
    expect(a).not.toBe(b);
  });

  it("cannot be decrypted with the wrong private key", async () => {
    const bob = await generateX25519KeyPair();
    const mallory = await generateX25519KeyPair();
    const encrypted = await encryptMessage("secret", bob.publicKey);
    await expect(decryptMessage(encrypted, mallory.privateKey)).rejects.toThrow();
  });

  it("rejects a tampered ciphertext", async () => {
    const bob = await generateX25519KeyPair();
    const encrypted = await encryptMessage("secret", bob.publicKey);
    const bytes = base64ToBytes(encrypted);
    bytes[bytes.length - 1] ^= 0xff; // flip a bit in the tag
    const tampered = Buffer.from(bytes).toString("base64");
    await expect(decryptMessage(tampered, bob.privateKey)).rejects.toThrow();
  });

  it("rejects a malformed recipient public key", async () => {
    await expect(encryptMessage("hi", "AAAA")).rejects.toThrow();
  });
});

describe("recovery codes", () => {
  it("generates 6 codes that each recover the passcode", async () => {
    const salt = generateSalt();
    const passcode = "123456";
    const { recoveryCodes, recoveryCodesData } = await generateRecoveryCodes(
      passcode,
      salt
    );
    expect(recoveryCodes).toHaveLength(6);
    expect(recoveryCodesData).toHaveLength(6);

    for (let i = 0; i < recoveryCodes.length; i++) {
      const recovered = await decryptPasscodeWithRecoveryCode(
        recoveryCodesData[i].encryptedPasscode,
        recoveryCodes[i],
        salt
      );
      expect(recovered).toBe(passcode);
    }
  });

  it("stores a hash, never the plaintext code", async () => {
    const salt = generateSalt();
    const { recoveryCodes, recoveryCodesData } = await generateRecoveryCodes(
      "123456",
      salt
    );
    for (let i = 0; i < recoveryCodes.length; i++) {
      expect(recoveryCodesData[i].hash).not.toContain(recoveryCodes[i]);
      expect(recoveryCodesData[i].encryptedPasscode).not.toContain(
        recoveryCodes[i]
      );
    }
  });

  it("fails to recover with the wrong code", async () => {
    const salt = generateSalt();
    const { recoveryCodesData } = await generateRecoveryCodes("123456", salt);
    await expect(
      decryptPasscodeWithRecoveryCode(
        recoveryCodesData[0].encryptedPasscode,
        "WRONG-CODE-HERE-XXXXX",
        salt
      )
    ).rejects.toThrow();
  });

  it("uses the human-friendly code format", async () => {
    const { recoveryCodes } = await generateRecoveryCodes("123456", generateSalt());
    for (const code of recoveryCodes) {
      expect(code).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    }
  });
});
