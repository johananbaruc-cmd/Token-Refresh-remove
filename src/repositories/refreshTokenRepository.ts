// src/repositories/refreshTokenRepository.ts
import { randomUUID } from "node:crypto";
import type { AppDatabase } from "../db/database"; 

export interface RefreshTokenRecord {
  token: string;
  userId: number;
  userKind: "user" | "student";
  expiresAt: number;
}

export class RefreshTokenRepository {
  private db: AppDatabase;

  constructor(db: AppDatabase) {
    this.db = db;
  }

  create(userId: number, userKind: "user" | "student", expiresInSeconds: number): RefreshTokenRecord {
    const token = randomUUID();
    // Guardar la fecha de expiración en formato UNIX Timestamp (segundos)
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const stmt = this.db.prepare(`
      INSERT INTO refresh_tokens (user_id, user_kind, token, expires_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(userId, userKind, token, expiresAt);

    return { token, userId, userKind, expiresAt };
  }

  isValid(token: string): { valid: boolean; userId?: number; userKind?: "user" | "student" } {
    const stmt = this.db.prepare(`
      SELECT user_id as userId, user_kind as userKind, expires_at as expiresAt
      FROM refresh_tokens
      WHERE token = ?
    `);

    const record = stmt.get(token) as { userId: number; userKind: "user" | "student"; expiresAt: number } | undefined;

    // Obtener la hora actual en segundos para comparar de forma precisa con SQLite
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (!record || nowInSeconds > record.expiresAt) {
      if (record) this.delete(token); // Limpiar el token si ya expiró
      return { valid: false };
    }

    return { valid: true, userId: record.userId, userKind: record.userKind };
  }

  delete(token: string): void {
    const stmt = this.db.prepare(`DELETE FROM refresh_tokens WHERE token = ?`);
    stmt.run(token);
  }

  deleteByUserId(userId: number, userKind: "user" | "student"): void {
    const stmt = this.db.prepare(`
      DELETE FROM refresh_tokens 
      WHERE user_id = ? AND user_kind = ?
    `);
    stmt.run(userId, userKind);
  }
}