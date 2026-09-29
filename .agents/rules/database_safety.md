# Strict Database Safety & Confirmation Rule

## 🚨 MANDATORY PROTOCOL: ZERO UNAPPROVED DELETIONS
- The AI assistant is strictly prohibited from running any command, API, script, or query that deletes multiple records, drops collections, or wipes data (`deleteMany`, `drop`, `truncate`, `remove`).
- If bulk deletion is requested by the user:
  1. Show a **CRITICAL DANGER WARNING** detailing what data is at risk.
  2. Ask for confirmation **3 separate times consecutively**.
  3. Require explicit write-in confirmation.
  4. Always take an automatic local backup before touching any database records.
