import * as general from "./prompts/general";
import * as researcher from "./prompts/researcher";
import * as litigator from "./prompts/litigator";
import * as drafter from "./prompts/drafter";
import * as strategist from "./prompts/strategist";
import * as cantonal_specialist from "./prompts/cantonal_specialist";
import * as citation_verifier from "./prompts/citation_verifier";
import * as federal_analyst from "./prompts/federal_analyst";
import * as adversarial_advocate from "./prompts/adversarial_advocate";
import * as adversarial_adversary from "./prompts/adversarial_adversary";
import * as adversarial_judge from "./prompts/adversarial_judge";
import * as document_analyst from "./prompts/document_analyst";
import * as translator from "./prompts/translator";
import * as summarizer from "./prompts/summarizer";
import * as cas_specialist from "./prompts/cas_specialist";
import * as compliance_officer from "./prompts/compliance_officer";
import * as corporate_lawyer from "./prompts/corporate_lawyer";
import * as employment_lawyer from "./prompts/employment_lawyer";
import * as real_estate_lawyer from "./prompts/real_estate_lawyer";
import * as tax_advisor from "./prompts/tax_advisor";

export interface AgentDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    prompt: string;
    preferredTools?: string[];
}

export interface AgentInfo {
    id: string;
    name: string;
    description: string;
    icon: string;
}

const AGENT_DEFS: AgentDef[] = [
    {
        id: "general",
        name: "General",
        description: "Swiss legal generalist for all areas of law",
        icon: "Scale",
        prompt: general.prompt,
        preferredTools: general.preferredTools,
    },
    {
        id: "researcher",
        name: "Researcher",
        description: "Precedent research, BGE/ATF/DTF analysis, doctrine",
        icon: "Search",
        prompt: researcher.prompt,
        preferredTools: researcher.preferredTools,
    },
    {
        id: "litigator",
        name: "Litigator",
        description: "Civil, criminal, and administrative procedure",
        icon: "Gavel",
        prompt: litigator.prompt,
        preferredTools: litigator.preferredTools,
    },
    {
        id: "drafter",
        name: "Drafter",
        description: "Contracts, opinions, court submissions in DE/FR/IT/EN",
        icon: "FileText",
        prompt: drafter.prompt,
        preferredTools: drafter.preferredTools,
    },
    {
        id: "strategist",
        name: "Strategist",
        description: "Case strategy, risk assessment, cost-benefit analysis",
        icon: "Target",
        prompt: strategist.prompt,
        preferredTools: strategist.preferredTools,
    },
    {
        id: "cantonal_specialist",
        name: "Cantonal Specialist",
        description: "Cantonal law, courts, procedures, and fee schedules",
        icon: "MapPin",
        prompt: cantonal_specialist.prompt,
        preferredTools: cantonal_specialist.preferredTools,
    },
    {
        id: "citation_verifier",
        name: "Citation Verifier",
        description: "Citation format checking and cross-language verification",
        icon: "BookCheck",
        prompt: citation_verifier.prompt,
        preferredTools: citation_verifier.preferredTools,
    },
    {
        id: "federal_analyst",
        name: "Federal Analyst",
        description: "Federal statute analysis and systematic interpretation",
        icon: "Landmark",
        prompt: federal_analyst.prompt,
        preferredTools: federal_analyst.preferredTools,
    },
    {
        id: "adversarial_advocate",
        name: "Advocate",
        description: "Builds the strongest case for your position",
        icon: "Shield",
        prompt: adversarial_advocate.prompt,
        preferredTools: adversarial_advocate.preferredTools,
    },
    {
        id: "adversarial_adversary",
        name: "Adversary",
        description: "Challenges your position with counterarguments",
        icon: "Swords",
        prompt: adversarial_adversary.prompt,
        preferredTools: adversarial_adversary.preferredTools,
    },
    {
        id: "adversarial_judge",
        name: "Judicial Analyst",
        description: "Synthesizes arguments and renders balanced assessment",
        icon: "Scale",
        prompt: adversarial_judge.prompt,
        preferredTools: adversarial_judge.preferredTools,
    },
    {
        id: "document_analyst",
        name: "Document Analyst",
        description: "Clause extraction, compliance scanning, risk identification",
        icon: "FileSearch",
        prompt: document_analyst.prompt,
        preferredTools: document_analyst.preferredTools,
    },
    {
        id: "translator",
        name: "Translator",
        description: "Legal translation DE/FR/IT/EN with terminology precision",
        icon: "Languages",
        prompt: translator.prompt,
        preferredTools: translator.preferredTools,
    },
    {
        id: "summarizer",
        name: "Summarizer",
        description: "Multi-document consolidation and output synthesis",
        icon: "ListCollapse",
        prompt: summarizer.prompt,
        preferredTools: summarizer.preferredTools,
    },
    {
        id: "cas_specialist",
        name: "CAS Specialist",
        description: "Court of Arbitration for Sport proceedings and jurisprudence",
        icon: "Trophy",
        prompt: cas_specialist.prompt,
        preferredTools: cas_specialist.preferredTools,
    },
    {
        id: "compliance_officer",
        name: "Compliance Officer",
        description: "FINMA, AML, data protection, and regulatory compliance",
        icon: "ClipboardCheck",
        prompt: compliance_officer.prompt,
        preferredTools: compliance_officer.preferredTools,
    },
    {
        id: "corporate_lawyer",
        name: "Corporate Lawyer",
        description: "AG/GmbH, M&A, governance, and securities",
        icon: "Building2",
        prompt: corporate_lawyer.prompt,
        preferredTools: corporate_lawyer.preferredTools,
    },
    {
        id: "employment_lawyer",
        name: "Employment Lawyer",
        description: "Contracts, termination, social security, and pensions",
        icon: "Users",
        prompt: employment_lawyer.prompt,
        preferredTools: employment_lawyer.preferredTools,
    },
    {
        id: "real_estate_lawyer",
        name: "Real Estate Lawyer",
        description: "Property, land registry, zoning, and Lex Koller",
        icon: "Home",
        prompt: real_estate_lawyer.prompt,
        preferredTools: real_estate_lawyer.preferredTools,
    },
    {
        id: "tax_advisor",
        name: "Tax Advisor",
        description: "Federal, cantonal, and international taxation",
        icon: "Calculator",
        prompt: tax_advisor.prompt,
        preferredTools: tax_advisor.preferredTools,
    },
];

const AGENT_MAP = new Map(AGENT_DEFS.map((a) => [a.id, a]));

export function getAgent(id: string): AgentDef {
    return AGENT_MAP.get(id) ?? AGENT_DEFS[0];
}

export function listAgents(): AgentInfo[] {
    return AGENT_DEFS.map(({ id, name, description, icon }) => ({
        id,
        name,
        description,
        icon,
    }));
}

export function buildAgentSystemPrompt(
    basePrompt: string,
    agentId: string,
): string {
    const agent = getAgent(agentId);
    return `${basePrompt}\n\n---\nAGENT MODE: ${agent.name.toUpperCase()}\n${agent.prompt}\n---\n`;
}
