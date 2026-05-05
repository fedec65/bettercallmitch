# Swiss Compliance & Data Residency

This document describes the Swiss legal compliance features built into Mitch (the Swiss-localized fork of the Mike platform).

## Anwaltsgeheimnis (Attorney-Client Privilege)

Mitch includes built-in Anwaltsgeheimnis protection (Art. 321 StGB / Art. 13 BGFA) ported from BetterCallClaude.

### How it works

Before any content is sent to external MCP servers (Swiss legal databases), the backend scans the request for privilege markers:

- **Strong markers** (always block): `anwaltsgeheimnis`, `mandatsgeheimnis`, `berufsgeheimnis`, `secret professionnel`, `segreto professionale`, `Art. 321 StGB`, `Art. 13 BGFA`, etc.
- **Weak markers** (block with discriminator): `vertraulich`, `confidentiel`, `riservato`, `confidential` — only when combined with client/case context (`mandant`, `klient`, `dossier`, `prozess`, etc.)

When privileged content is detected, the MCP call is blocked and the LLM receives a privacy warning instead of the database result. The user is never exposed to raw database errors — the system explains that the request was blocked under Swiss privilege law.

### Scope

The privacy scanner runs on:
- All MCP tool calls (`search_bge`, `search_swiss_decisions`, `verify_citation`, `search_federal_legislation`, `search_commentary`, `legal_strategy`, `legal_draft`, `legal_analyze`)
- Arguments sent to external HTTP MCP servers at `mcp.bettercallclaude.ch`

Local document tools (`read_document`, `edit_document`, `generate_docx`) are NOT scanned because they do not leave the machine.

## Data Residency

### Current Architecture

| Component | Location | Notes |
|-----------|----------|-------|
| Application backend | User-controlled | Self-hosted or on your own infrastructure |
| Database | User-controlled | Supabase project — choose EU/Swiss region |
| Object storage | User-controlled | S3-compatible (Cloudflare R2, etc.) |
| LLM inference | Provider-dependent | Claude (US), Gemini (US/EU) |
| MCP servers | `mcp.bettercallclaude.ch` | Hosted in EU (Railway) |

### Recommendations for Swiss Law Firms

1. **Host the backend in Switzerland or the EU**
   - Ensure your server infrastructure is physically located in Switzerland or the EU.
   - Popular options: Exoscale (CH), Swisscom (CH), Hetzner (DE/FI), AWS eu-central-1 (DE).

2. **Configure Supabase in the EU**
   - When creating your Supabase project, select `West Europe (Azure)` or `EU Central (AWS)`.
   - This keeps user data and authentication within the EU.

3. **Use Swiss or EU object storage**
   - Cloudflare R2 has edge locations in Zurich (ZRH).
   - Exoscale SOS is fully Swiss-hosted.

4. **LLM Provider Considerations**
   - Claude (Anthropic): Data is processed in the US. Anthropic states they do not train on API inputs, but data leaves Switzerland.
   - Gemini (Google): Data is processed in the US/EU depending on configuration. Review Google Cloud data-processing terms.
   - For strict Anwaltsgeheimnis compliance, consider running a local LLM (e.g., via Ollama) for privileged content and using cloud LLMs only for non-privileged research.

5. **MCP Server Privacy**
   - The 7 HTTP MCP servers (`mcp.bettercallclaude.ch`) are hosted on Railway in the EU.
   - No API keys are required; rate limit is 60 req/min per IP.
   - Requests are logged for rate-limiting purposes but are not stored long-term.
   - The `swiss-caselaw` SSE server connects to `mcp.opencaselaw.ch` (EU-hosted).

## Professional Disclaimer

Mitch is a legal research and analysis tool. All outputs:

- Require professional lawyer review and validation before use.
- Do not constitute legal advice.
- May contain errors, omissions, or outdated information.
- Must be verified against official sources (admin.ch, court databases, official gazettes).
- Must be adapted to the specific circumstances of each case.

Lawyers maintain full professional responsibility for all legal work products. Mitch assists legal professionals but does not replace professional judgment, independent verification, or the duty of care owed to clients.

## Regulatory Frameworks Covered

Mitch has built-in knowledge and tooling for:

- **Civil law**: ZGB, OR, ZPO
- **Criminal law**: StGB, StPO
- **Constitutional law**: BV (Bundesverfassung)
- **Data protection**: nDSG (new Federal Act on Data Protection), GDPR alignment
- **Financial regulation**: FINMA circulars, GwG/AML, FIDLEG/FINIG, FinSA
- **Tax**: Federal and cantonal tax law, DTAs, BEPS
- **Corporate law**: AG, GmbH, M&A, Handelsregister
- **Real estate**: Grundbuch, Lex Koller, zoning
- **Employment**: ArG, BVG, OR employment provisions
- **Competition**: UWG, CartA

## Language Support

| Language | Code | Legal Context |
|----------|------|---------------|
| German | DE | Primary: ZGB, OR, StGB, BGE. Used in ZH, BE, BS, and German-speaking cantons. |
| French | FR | Official: CC, CO, CP, ATF. Used in GE, VD, and French-speaking cantons. |
| Italian | IT | Official: CC, CO, CP, DTF. Used in TI and Italian-speaking regions. |
| English | EN | Working language with Swiss legal term mapping. |

## Contributing

To report compliance issues or suggest additional Swiss legal frameworks, open an issue on GitHub.
