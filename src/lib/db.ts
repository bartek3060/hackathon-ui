import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

const isVercel = process.env.VERCEL === "1"

let dbPath: string

if (isVercel) {
  dbPath = path.join(process.cwd(), "data/zus.db")
} else {
  dbPath = path.resolve(process.cwd(), "data/zus.db")
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  }
}

const dbExists = fs.existsSync(dbPath)

export const db = dbExists 
  ? new Database(dbPath, { readonly: isVercel, fileMustExist: isVercel })
  : createEmptyDb()

function createEmptyDb() {
  const tempDb = new Database(dbPath)
  tempDb.exec(`
    CREATE TABLE IF NOT EXISTS corpus (
      id TEXT PRIMARY KEY,
      url TEXT,
      title TEXT,
      text TEXT,
      lang TEXT,
      lastModified TEXT
    );
  `)
  return tempDb
}

