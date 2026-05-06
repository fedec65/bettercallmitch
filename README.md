# BetterCallMitCH — Swiss Legal Intelligence

Swiss-localized legal intelligence platform built on the open-source BetterCallClaude engine. BetterCallMitCH provides AI-powered document analysis, contract review, BGE (Bundesgerichtsentscheide) research, and cantonal law assistance tailored for the Swiss legal market.

## Contents

- `frontend/` - Next.js application
- `backend/` - Express API, Supabase access, document processing, and migrations
- `backend/migrations/000_one_shot_schema.sql` - one-shot Supabase schema for fresh databases

## Setup

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create local env files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Run `backend/migrations/000_one_shot_schema.sql` in the Supabase SQL editor for a fresh database.

Start the backend:

```bash
npm run dev --prefix backend
```

Start the frontend:

```bash
npm run dev --prefix frontend
```

Open `http://localhost:3000`.

## Swiss Legal Capabilities

BetterCallMitCH integrates the full BetterCallClaude Swiss legal intelligence stack:

- **BGE/ATF/DTF Research** — Search and retrieve Federal Supreme Court decisions via `search_bge` and `get_bge_decision`
- **Cantonal Court Search** — Search all Swiss cantonal and federal courts via `search_swiss_decisions`
- **Citation Verification** — Verify and cross-convert Swiss legal citations across DE/FR/IT/EN via `verify_citation`
- **Federal Legislation** — Query Fedlex federal statutes via SPARQL via `search_federal_legislation`
- **Legal Commentaries** — Access Swiss legal commentaries (Kommentare) via `search_commentary`
- **Case Strategy** — Generate structured litigation strategy with statutory citations via `legal_strategy`
- **Document Drafting** — Draft contracts, court submissions, and opinions in all 4 national languages via `legal_draft`
- **Compliance Analysis** — Analyze documents for compliance with OR, ZGB, DSG, FINMA circulars via `legal_analyze`

### Built-in Workflows

- Swiss Litigation Preparation (Klageschrift drafting)
- Swiss Contract Review (OR compliance analysis)
- Swiss Due Diligence (corporate, regulatory, employment, real estate)
- Swiss Legal Opinion (Gutachten with Gutachtenstil reasoning)
- Swiss Compliance Check (FINMA, GwG, nDSG, employment law)

### Privacy & Compliance

- **Anwaltsgeheimnis scanning** — Automatic attorney-client privilege detection (Art. 321 StGB / Art. 13 BGFA) before sending data to external MCP servers
- **Multi-language support** — German (DE), French (FR), Italian (IT), English (EN) with proper Swiss legal terminology
- **Canton awareness** — All 26 cantons with specific court systems, procedures, and citation formats
- **Gutachtenstil** — Three-step legal reasoning (Obersatz / Untersatz / Schluss) in all outputs

See `COMPLIANCE.md` for data residency recommendations and professional disclaimers.

## Required Services

- Supabase Auth and Postgres (recommend EU region for Swiss data protection)
- S3-compatible object storage, such as Cloudflare R2
- At least one supported model provider key (Claude or Gemini)
- LibreOffice for DOC/DOCX to PDF conversion
- (Optional) Ollama for local privacy-routed translation/summarization

## MCP Servers

BetterCallMitCH connects to 7 remote MCP servers hosted at `mcp.bettercallclaude.ch` (EU). No local Node.js build or API keys are required for these servers. See `backend/src/lib/mcp/client.ts` for the server registry and `backend/src/lib/mcp/tools.ts` for tool schemas.

## Checks

```bash
npm run build --prefix backend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## License

AGPL-3.0-only. See `LICENSE`.
