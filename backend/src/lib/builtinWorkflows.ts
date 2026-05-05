export const BUILTIN_WORKFLOWS: { id: string; title: string; prompt_md: string }[] = [
    {
        id: "builtin-cp-checklist",
        title: "Generate CP Checklist",
        prompt_md:
            "## Generate Conditions Precedent Checklist\n\n" +
            "Review the uploaded credit agreement or financing document and generate a comprehensive " +
            "Conditions Precedent (CP) checklist.\n\n" +
            "You MUST use the generate_docx tool to produce the checklist as a downloadable Word document. " +
            "You MUST pass landscape: true to the generate_docx tool — the document must be in landscape orientation. " +
            "Do not display the checklist inline — generate the .docx file and provide the download link.\n\n" +
            "Structure the document as follows:\n" +
            "- For each category of conditions (e.g. Corporate, Financial, Legal, Security), add a section with a heading\n" +
            "- Under each category heading, include a table with exactly these four columns in this order:\n" +
            "  1. Index — sequential number within the category (1, 2, 3…)\n" +
            "  2. Clause Number — the clause or schedule reference from the agreement\n" +
            "  3. Clause — a concise description of the condition precedent\n" +
            "  4. Status — leave blank (empty string) for the user to fill in\n\n" +
            "Use the table field in the section object (not content) for each category's rows.\n\n" +
            "Before finalizing, double-check that every table is formatted correctly: each table must have exactly the four columns above in the same order, headers must match exactly (Index, Clause Number, Clause, Status), every row must have the same number of cells as the headers, the Index column must be sequential starting from 1 within each category, and no cells should contain stray markdown, newlines, or placeholder text (use an empty string for Status).",
    },
    {
        id: "builtin-credit-summary",
        title: "Credit Agreement Summary",
        prompt_md:
            "## Credit Agreement Summary\n\n" +
            "Review the uploaded credit agreement and produce a comprehensive legal summary covering the following topics. " +
            "For each section, identify the key provisions, quote the relevant clause or schedule references, and flag any unusual, onerous, or non-market terms.\n\n" +
            "1. **Lenders** — All lenders or members of the lender syndicate, including their full legal name and role (e.g. mandated lead arranger, original lender, agent bank)\n" +
            "2. **Borrowers** — All borrowers, including their full legal name and jurisdiction of incorporation\n" +
            "3. **Guarantors** — All guarantors, including their full legal name and the scope of their guarantee obligation\n" +
            "4. **Other Parties** — Any other material parties (e.g. facility agent, security agent, hedge counterparties, issuing bank) and their roles\n" +
            "5. **Date of Agreement** — Date of the credit agreement\n" +
            "6. **Facilities** — Each facility available (e.g. Revolving Credit Facility, Term Loan A, Term Loan B, Term Loan C), the facility type, tranche name, and any key structural features\n" +
            "7. **Amount** — Total committed amount across all facilities, the currency, and breakdown by tranche if applicable\n" +
            "8. **Purpose** — Stated purpose for which borrowings may be used and any restrictions on use of proceeds\n" +
            "9. **Interest** — Applicable reference rate (e.g. SOFR, EURIBOR, base rate), the margin, any margin ratchet mechanism, and how interest periods are structured\n" +
            "10. **Commitment Fee** — Commitment or utilisation fees, the applicable rate, how they are calculated, and the basis (e.g. undrawn commitment, average utilisation)\n" +
            "11. **Repayment Schedule** — Repayment profile for each facility, whether by scheduled instalments or bullet repayment, and the repayment dates and amounts\n" +
            "12. **Maturity** — Final maturity date for each facility\n" +
            "13. **Security** — Each class of security granted or required (e.g. share pledges, fixed and floating charges, real estate mortgages, account pledges) and the assets or entities over which security is taken\n" +
            "14. **Guarantees** — Guarantee obligations, the guarantors, the scope of the guarantee, and any limitations (e.g. up-stream guarantee limitations, guarantor coverage test)\n" +
            "15. **Financial Covenants** — Each financial covenant, the metric (e.g. leverage ratio, interest cover, cashflow cover), the applicable test, testing frequency, and any equity cure rights\n" +
            "16. **Events of Default** — Each event of default, noting any grace periods, materiality thresholds, or cross-default provisions\n" +
            "17. **Assignment** — Restrictions or permissions on assignment or transfer (e.g. white/blacklists, borrower consent for lender transfers; restrictions on borrower assignment)\n" +
            "18. **Change of Control** — What constitutes a change of control, what obligations it triggers (e.g. mandatory prepayment, cancellation, lender consent), and any cure period\n" +
            "19. **Prepayment Fee** — Any prepayment fees, make-whole premiums, or soft-call protections, the applicable fee, the period during which it applies, and any exceptions (e.g. prepayment from insurance proceeds or asset disposals)\n" +
            "20. **Governing Law** — Governing law of the agreement\n" +
            "21. **Dispute Resolution** — Whether disputes go to litigation or arbitration, the chosen forum or seat, and any submission to jurisdiction provisions\n\n" +
            "Deliver the summary inline in your chat response — do NOT call generate_docx. Only produce a downloadable Word document if the user explicitly asks for one.",
    },
    {
        id: "builtin-sha-summary",
        title: "Shareholder Agreement Summary",
        prompt_md:
            "## Shareholder Agreement Summary\n\n" +
            "Review the uploaded shareholder agreement and produce a comprehensive legal summary covering the following topics. " +
            "For each section, identify the key provisions, quote the relevant clause references, and flag any unusual, onerous, or market-standard deviations.\n\n" +
            "1. **Parties & Shareholdings** — Full legal names, roles, share classes held, and percentage interests (on a fully diluted basis if stated)\n" +
            "2. **Share Classes & Rights** — For each class: voting rights, dividend rights, liquidation preference, conversion or redemption features\n" +
            "3. **Board Composition & Governance** — Board size, director appointment rights (and the shareholding thresholds required to maintain them), quorum, and casting vote\n" +
            "4. **Reserved Matters** — Decisions requiring a special majority, unanimity, or a specific shareholder's consent; note the threshold and whose consent is required for each\n" +
            "5. **Pre-emption on New Shares** — Who holds pre-emption rights, procedure, timeline, and any carve-outs (e.g. employee option schemes)\n" +
            "6. **Transfer Restrictions** — Lock-up periods, prohibited transfers, permitted transfers (e.g. to affiliates), and any board or shareholder approval requirements\n" +
            "7. **Right of First Refusal / Pre-emption on Transfer** — Trigger, procedure, pricing mechanics, and any exceptions\n" +
            "8. **Drag-Along Rights** — Who holds the right, threshold to trigger, conditions (e.g. minimum price, independent valuation), and minority protections\n" +
            "9. **Tag-Along Rights** — Who holds the right, triggering threshold, exercise procedure, and price terms\n" +
            "10. **Anti-Dilution Protections** — Type (full ratchet, weighted average), trigger events, calculation mechanics, and exceptions\n" +
            "11. **Dividend Policy** — Any obligation or target to pay dividends, preferential dividend rights, and restrictions on distributions\n" +
            "12. **Exit & Liquidity** — Agreed exit routes (trade sale, IPO, drag sale), timelines, and liquidation preferences on exit\n" +
            "13. **Deadlock** — Deadlock definition, escalation and resolution mechanisms (e.g. Russian roulette, put/call options), and consequences if unresolved\n" +
            "14. **Non-Compete & Non-Solicitation** — Who is bound, scope of activities and geography, duration, and carve-outs\n" +
            "15. **Governing Law & Dispute Resolution** — Applicable law, forum, arbitration or litigation, and any mandatory escalation steps\n\n" +
            "Generate the summary as a downloadable Word document.",
    },
    {
        id: "builtin-swiss-litigation-prep",
        title: "Swiss Litigation Preparation",
        prompt_md:
            "## Swiss Litigation Preparation\n\n" +
            "Prepare a comprehensive litigation dossier for a Swiss civil or commercial dispute. Follow these steps in order:\n\n" +
            "1. **Research applicable BGE precedent** — Use the `search_bge` tool to find relevant Federal Supreme Court (Bundesgericht / Tribunal fédéral) case law on the legal issues raised. Search for the most recent and on-point BGE rulings. Note the BGE reference (e.g. 4A_123/2023), the ruling date, and the key legal principle established.\n" +
            "2. **Analyze cantonal procedure and court competence** — Identify the competent cantonal court (Kantonsgericht / Tribunal cantonal) based on the subject matter, the amount in dispute (Streitwert), and the territorial jurisdiction. Reference the applicable cantonal procedural law (e.g. ZPO/ZG, KP/KC, or cantonal-specific codes). Determine whether simplified proceedings (vereinfachtes Verfahren / procédure simplifiée) apply.\n" +
            "3. **Assess risk and Streitwert** — Estimate the realistic Streitwert for court-fee and attorney-fee purposes under the Swiss tariff system (Kostenordnung / Ordonnance sur les frais et dépens). Assess the procedural and substantive risk profile (e.g. clear-cut vs. disputed facts, favourable vs. unfavourable BGE precedent). Flag any risks of cost liability (Kostenfolge / suite des frais) or adverse-party cost exposure.\n" +
            "4. **Draft Klageschrift structure** — Outline the complete structure of the statement of claim (Klage / action) with the following mandatory sections, each annotated with what content should go inside:\n" +
            "   - **Rubrum** — Full names and addresses of the parties, their representatives, and the competent court\n" +
            "   - **Rechtsbegehren** — Precise prayers for relief (Klagebegehren / conclusions), numbered and with specific quantum or performance requests\n" +
            "   - **Sachverhalt** — Chronological statement of facts, cross-referenced to documentary evidence; distinguish between established facts and allegations\n" +
            "   - **Rechtliche Würdigung** — Systematic legal analysis in Gutachtenstil: Obersatz (legal rule), Untersatz (application to facts), Schluss (interim or final conclusion for each issue)\n" +
            "   - **Beweismittel** — Numbered list of all proposed evidence (documents, witness testimony, expert reports, inspections) with a brief description of the probative purpose of each item\n" +
            "   - **Beilagen** — Annex list correlating each exhibit to the relevant factual or legal point in the Klageschrift\n\n" +
            "You MUST use the `generate_docx` tool to produce the final litigation-prep document as a downloadable Word document. Structure the document with clear headings for each of the four steps above. Under step 4, present each Klageschrift section as a dedicated sub-section with explanatory notes. Cite every BGE ruling and statutory reference with full citation format (e.g. BGE 138 III 123; Art. 45 ZPO). Do not display the full draft inline — generate the .docx file and provide the download link.",
    },
    {
        id: "builtin-swiss-contract-review",
        title: "Swiss Contract Review",
        prompt_md:
            "## Swiss Contract Review\n\n" +
            "Review the uploaded contract under Swiss private law, specifically the Swiss Code of Obligations (OR / CO). Deliver a structured review memo covering the topics below.\n\n" +
            "1. **Applicable OR articles** — Identify the OR articles that directly govern the contract type (e.g. Art. 184 ff. OR for purchase, Art. 394 ff. OR for mandate, Art. 253 ff. OR for lease). For each article, state whether the provision is mandatory (zwingend / impératif) or dispositive (nachgiebig / supplétif) and how the contract deviates from or mirrors the statutory default.\n" +
            "2. **Mandatory vs dispositive provisions** — Flag any clauses that override mandatory OR provisions (which are void) and note where the parties have validly opted out of dispositive provisions. Pay special attention to:\n" +
            "   - Form requirements (e.g. Art. 216 OR for real-estate contracts)\n" +
            "   - Limitation of liability and exclusion clauses (Art. 100 OR, Art. 101 OR, Art. 199 OR)\n" +
            "   - Termination and notice periods (e.g. Art. 404 OR for mandate, Art. 346g OR for employment)\n" +
            "   - Consumer-protection rules (Art. 8 ff. of the Federal Act against Unfair Competition, UWG, if B2C)\n" +
            "3. **Risks** — For each identified risk, describe the contractual language that creates it, the legal consequence under Swiss law, and the probability and severity of the risk.\n" +
            "4. **Missing clauses** — List standard or recommended clauses that are absent and that would improve legal certainty or protect the client's interests. Examples include: governing-law and jurisdiction clause, force-majeure clause, confidentiality clause, IP assignment or licence clause, limitation-of-liability cap, dispute-resolution escalation clause.\n" +
            "5. **Non-standard terms** — Highlight any unusual, market-atypical, or one-sided terms (e.g. excessive penalty clauses under Art. 163 OR, unilateral modification rights, broad indemnities without monetary cap).\n" +
            "6. **DSG / data-protection compliance** — If the contract involves personal-data processing, assess compliance with the Federal Act on Data Protection (nDSG / LPD, applicable since 1 September 2023). Check for: lawful basis, data-transfer safeguards (Art. 16 nDSG), data-subject rights, processor obligations, and cross-border transfer mechanisms.\n" +
            "7. **UWG / unfair-competition compliance** — If the contract is B2C or contains advertising/distribution provisions, check for compliance with the UWG (e.g. misleading terms, prohibited tying, unlawful prize promotions).\n\n" +
            "Format the memo with clear headings and sub-headings. Cite specific OR articles, nDSG articles, and UWG articles for every legal conclusion. Deliver the memo inline in your chat response unless the user asks for a Word document.",
    },
    {
        id: "builtin-swiss-due-diligence",
        title: "Swiss Due Diligence",
        prompt_md:
            "## Swiss Legal Due Diligence\n\n" +
            "Conduct a comprehensive Swiss legal due-diligence review on the uploaded documents (or the company/entity described by the user). Produce a DD report structured as follows.\n\n" +
            "1. **Corporate structure** — Verify the entity's registration in the Swiss Commercial Register (Handelsregister / Registre du commerce): legal name, UID number, registered address, legal form (AG, GmbH, etc.), share capital, authorised signatories, and any entries under \"Verzicht auf Eintragung\" or remarks. Check for any pending capital increases, mergers, or conversions.\n" +
            "2. **Regulatory compliance** — Assess compliance with the relevant Swiss regulatory framework:\n" +
            "   - **FINMA** — If the target is a bank, insurer, securities dealer, asset manager, or fintech: check FINMA authorisation status, applicable circulars (e.g. FINMA Circular 2023/1 on operational risks), and any enforcement history.\n" +
            "   - **GwG / AML** — Verify anti-money-laundering obligations under the GwG (e.g. Art. 6 ff. GwG for identification and due diligence, Art. 24 ff. GwG for reporting). Check whether the entity has an AML officer and adequate internal controls.\n" +
            "   - **FIDLEG / FinSA** — If financial services are provided, assess compliance with FIDLEG (conduct-of-business rules) and FinSA (client segmentation, suitability, documentation obligations).\n" +
            "3. **Employment law** — Review employment contracts and policies for compliance with:\n" +
            "   - Swiss Labour Act (ArG / LT) and related ordinances (ArGV)\n" +
            "   - BVG / LPP (occupational pension) compliance, including minimum BVG coordination deduction and employer contributions\n" +
            "   - Working-time regulations, holiday entitlements (Art. 329a OR), and notice periods (Art. 335c OR)\n" +
            "   - Flag any material litigation or claims from employees or former employees\n" +
            "4. **Data protection (nDSG)** — Assess the entity's privacy governance: privacy policy, data-processing agreements, data-breach response plan, record of processing activities, and cross-border transfer safeguards.\n" +
            "5. **Real estate** — If the target holds Swiss real estate:\n" +
            "   - Verify Grundbuch (land register) extracts: ownership, easements, mortgages, and building restrictions\n" +
            "   - Assess Lex Koller (Bewilligungspflicht für Erwerb von Grundstücken durch Personen im Ausland) applicability and any granted exemptions\n" +
            "   - Check zoning and building permits\n" +
            "6. **Litigation check** — Use the `search_swiss_decisions` tool to search for litigation history involving the company name (or its key subsidiaries/affiliates). Report any pending or concluded civil, administrative, or criminal proceedings, including the court, the subject matter, and the outcome if available.\n" +
            "7. **Risk ratings** — For each of the six areas above, assign a risk rating: **Green** (low / no material issues), **Yellow** (moderate / manageable with conditions), or **Red** (high / material issue that could affect the transaction). Provide a one-sentence justification for each rating.\n\n" +
            "Conclude with an executive summary highlighting the top 3–5 red or yellow risks and recommended conditions precedent or remedial actions. You MUST use the `generate_docx` tool to produce the DD report as a downloadable Word document unless the user explicitly asks for inline text only.",
    },
    {
        id: "builtin-swiss-legal-opinion",
        title: "Swiss Legal Opinion (Gutachten)",
        prompt_md:
            "## Swiss Legal Opinion (Gutachten / Avis de droit)\n\n" +
            "Draft a formal Swiss legal opinion on the legal question provided by the user. The opinion must be rigorous, well-structured, and suitable for use in court, arbitration, or a transaction.\n\n" +
            "### Structure\n\n" +
            "1. **Fragestellung** — State the precise legal question(s) clearly and narrowly. If there are subsidiary or alternative questions, list them as sub-items (a), (b), (c).\n" +
            "2. **Sachverhalt** — Summarise the material facts as provided by the user. Distinguish between established facts, facts alleged by one party, and hypothetical facts. Flag any gaps or ambiguities in the factual basis.\n" +
            "3. **Rechtliche Grundlagen** — Identify and cite the governing statutory provisions (e.g. OR, ZGB, BG, nDSG, FINMA laws), the most relevant Federal Supreme Court precedents (BGE), and any leading academic doctrine (Kommentare, Lehrbücher). You MUST use the `search_federal_legislation` tool to verify the current text of any federal statute cited, and the `search_bge` tool to verify the current status and citation of any BGE ruling referenced.\n" +
            "4. **Rechtliche Würdigung** — Conduct a systematic legal analysis using the classic Gutachtenstil method:\n" +
            "   - **Obersatz** — State the abstract legal rule derived from statute, BGE, and doctrine.\n" +
            "   - **Untersatz** — Apply the rule to the concrete facts of the case, addressing counter-arguments and distinguishing unfavourable precedent where necessary.\n" +
            "   - **Schluss** — Draw an interim or final conclusion for each sub-issue before moving to the next.\n" +
            "   Repeat Obersatz–Untersatz–Schluss for each distinct legal issue.\n" +
            "5. **Ergebnis** — Provide a clear, unambiguous conclusion that directly answers the Fragestellung. Include any necessary caveats (e.g. \"under the facts as stated\", \"subject to further evidence on X\", \"provided that the BGE ruling in Y is not overturned\").\n\n" +
            "### Requirements\n\n" +
            "- Cite every statute and BGE with full, formal citations (e.g. Art. 328 Abs. 1 OR; BGE 138 III 281 E. 3.2).\n" +
            "- If the factual basis is insufficient to give a definitive answer, say so explicitly and explain what additional facts or documents are needed.\n" +
            "- You MUST use the `generate_docx` tool to produce the opinion as a downloadable Word document. Do not deliver the full text inline.",
    },
    {
        id: "builtin-swiss-compliance-check",
        title: "Swiss Compliance Check",
        prompt_md:
            "## Swiss Compliance Check\n\n" +
            "Assess the compliance of the uploaded document (or the situation described by the user) against the relevant Swiss regulatory frameworks. Produce a compliance matrix with the following structure.\n\n" +
            "### Regulatory Areas to Cover\n\n" +
            "1. **FINMA regulation** — If the entity or transaction involves banking, insurance, securities dealing, asset management, or fintech:\n" +
            "   - Identify the applicable FINMA Circulars (e.g. Circular 2023/1 on operational risks, Circular 2017/2 on governance, Circular 2018/3 on outsourcing for banks and insurers).\n" +
            "   - Check capital adequacy (CIRCA/CISO for banks, SST for insurers), liquidity ratios, and risk-management requirements.\n" +
            "   - Flag any missing FINMA notifications, licence conditions, or remedial orders.\n" +
            "2. **GwG / AML obligations** — Under the Anti-Money Laundering Act (GwG / LBA):\n" +
            "   - Verify whether customer due diligence (KYC/Sorgfaltspflichten, Art. 6 ff. GwG) has been performed and documented.\n" +
            "   - Check for beneficial-ownership identification, ongoing monitoring, and politically-exposed-person (PEP) screening.\n" +
            "   - Assess suspicious-transaction reporting (STR / SAR) procedures and whether there is a compliance officer.\n" +
            "3. **nDSG / DSG data protection** — Under the revised Federal Act on Data Protection (nDSG, in force since 1 September 2023):\n" +
            "   - Assess lawful basis for processing (Art. 6 nDSG), purpose limitation (Art. 4 nDSG), and data-minimisation compliance.\n" +
            "   - Check for privacy-policy updates, data-processing agreements with processors (Art. 9 nDSG), and data-breach notification procedures (Art. 24 nDSG).\n" +
            "   - Verify cross-border data-transfer safeguards (Art. 16 nDSG) and the presence of a data-protection officer if required.\n" +
            "4. **Employment law** — Check compliance with:\n" +
            "   - ArG / LT and ArGV ordinances (working time, rest periods, night and Sunday work, youth employment)\n" +
            "   - BVG / LPP (minimum occupational-pension benefits, employer contributions, coordination deduction)\n" +
            "   - Equal-pay provisions (Art. 4 GlG / LGal) and anti-discrimination rules\n" +
            "   - COVID-related or other special ordinances if still applicable\n" +
            "5. **Consumer protection (if B2C)** — Under the UWG and related consumer-protection rules:\n" +
            "   - Check for unfair contract terms (e.g. unreasonable disadvantage under Art. 8 UWG), prohibited tied selling, and misleading advertising.\n" +
            "   - Verify withdrawal rights (e.g. Art. 40a ff. OR for distance contracts), cooling-off periods, and mandatory information duties.\n\n" +
            "### Output Format\n\n" +
            "For each regulatory area, provide:\n" +
            "- **Requirement** — The specific rule or obligation\n" +
            "- **Status** — Compliant / Partially Compliant / Non-Compliant / Not Applicable\n" +
            "- **Evidence** — Reference to the document or facts that support the status\n" +
            "- **Gap** — Description of the deficiency, if any\n" +
            "- **Remediation** — Concrete, actionable steps to close the gap, with a suggested timeline\n\n" +
            "You MUST use the `search_federal_legislation` tool to verify the current text of any federal statute or ordinance cited. You MUST use the `generate_docx` tool to produce the compliance matrix as a downloadable Word document unless the user explicitly requests inline text.",
    },
];
