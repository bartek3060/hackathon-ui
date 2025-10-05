import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

const dbPath = path.resolve(process.cwd(), "data/zus.db")
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)

db.exec(`
CREATE TABLE IF NOT EXISTS corpus (
  id TEXT PRIMARY KEY,
  url TEXT,
  title TEXT,
  text TEXT,
  lang TEXT,
  lastModified TEXT
);
`)

