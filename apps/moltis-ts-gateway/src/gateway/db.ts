// SQLite-backed session + chat-history storage (better-sqlite3).
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export interface Session {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
}
export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: number;
}

export class Store {
  private db: Database.Database;

  constructor(dataDir: string) {
    mkdirSync(dataDir, { recursive: true });
    this.db = new Database(join(dataDir, "moltis.sqlite"));
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);
    `);
  }

  createSession(title = "New chat"): Session {
    const now = Date.now();
    const s: Session = { id: randomUUID(), title, created_at: now, updated_at: now };
    this.db
      .prepare("INSERT INTO sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)")
      .run(s.id, s.title, s.created_at, s.updated_at);
    return s;
  }

  listSessions(): Session[] {
    return this.db
      .prepare("SELECT * FROM sessions ORDER BY updated_at DESC")
      .all() as Session[];
  }

  getSession(id: string): Session | undefined {
    return this.db.prepare("SELECT * FROM sessions WHERE id = ?").get(id) as Session | undefined;
  }

  addMessage(sessionId: string, role: Message["role"], content: string): Message {
    const now = Date.now();
    const m: Message = { id: randomUUID(), session_id: sessionId, role, content, created_at: now };
    this.db
      .prepare("INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(m.id, m.session_id, m.role, m.content, m.created_at);
    this.db.prepare("UPDATE sessions SET updated_at = ? WHERE id = ?").run(now, sessionId);
    return m;
  }

  getMessages(sessionId: string): Message[] {
    return this.db
      .prepare("SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC")
      .all(sessionId) as Message[];
  }

  close(): void {
    this.db.close();
  }
}
