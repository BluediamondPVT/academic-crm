# CRITICAL PROJECT RULES & SAFETY PROTOCOLS

## 🚨 RULE 1: ABSOLUTE ZERO DATA LOSS / BULK DELETION PROHIBITION
1. **NEVER DELETE ANY DATA WITHOUT EXPLICIT PERMISSION**:
   - Never run `deleteMany({})`, `.drop()`, `.dropDatabase()`, `remove()`, or truncate any collection or table.
   - Never write or deploy any seed file or script that wipes existing database records.

2. **MANDATORY 3-STEP CONFIRMATION PROTOCOL**:
   - If the USER ever asks to delete all data, reset the database, or delete bulk records:
     - **DO NOT EXECUTE IMMEDIATELY.**
     - **SHOW A STRONG DANGER ALERT**: Warn the user with full details of what collections will be destroyed and that data recovery will be impossible.
     - **ASK FOR CONFIRMATION 3 SEPARATE TIMES IN SUCCESSION**:
       - Confirmation 1: Ask explicitly with warning.
       - Confirmation 2: If user says yes, ask again to re-confirm with the collection name.
       - Confirmation 3: If user says yes again, ask a third final time ("Type 'DELETE PERMANENTLY' to proceed").
     - Only if the user explicitly confirms all 3 times may bulk deletion be considered.

3. **AUTOMATIC BACKUP BEFORE ANY DESTRUCTIVE ACTION**:
   - Even if 3-step confirmation passes, an automatic local JSON/BSON backup must be exported to a safe folder before performing any deletion.
