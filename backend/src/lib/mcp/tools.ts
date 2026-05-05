export const MCP_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "search_bge",
      description:
        "Search Swiss Federal Supreme Court (BGE) decisions. Returns matching decisions with metadata.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Search query or keywords",
          },
          article_ref: {
            type: "string",
            description: "Specific article or law reference to filter by",
          },
          date_from: {
            type: "string",
            description: "Start date (YYYY-MM-DD)",
          },
          date_to: {
            type: "string",
            description: "End date (YYYY-MM-DD)",
          },
          section: {
            type: "string",
            description: "BGE section or chamber to filter by",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_bge_decision",
      description:
        "Retrieve the full text of a specific BGE decision by its reference.",
      parameters: {
        type: "object" as const,
        properties: {
          reference: {
            type: "string",
            description: "BGE reference number (e.g., 'BGE 138 II 123')",
          },
        },
        required: ["reference"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_swiss_decisions",
      description:
        "Search across Swiss court decisions from various cantonal and federal courts.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Search query or keywords",
          },
          court: {
            type: "string",
            description: "Specific court name or abbreviation to filter by",
          },
          date_from: {
            type: "string",
            description: "Start date (YYYY-MM-DD)",
          },
          date_to: {
            type: "string",
            description: "End date (YYYY-MM-DD)",
          },
          language: {
            type: "string",
            description: "Language of the decisions (e.g., 'de', 'fr', 'it')",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "verify_citation",
      description:
        "Verify and format a legal citation according to Swiss standards.",
      parameters: {
        type: "object" as const,
        properties: {
          citation: {
            type: "string",
            description: "The citation string to verify and format",
          },
          target_language: {
            type: "string",
            description: "Target language for formatting (e.g., 'de', 'fr', 'it', 'en')",
          },
        },
        required: ["citation"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_federal_legislation",
      description:
        "Search Swiss federal legislation using Fedlex via SPARQL.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Search query or keywords",
          },
          language: {
            type: "string",
            description: "Language for results (e.g., 'de', 'fr', 'it', 'en')",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_commentary",
      description:
        "Search legal commentaries from Onlinekommentar.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Search query or keywords",
          },
          language: {
            type: "string",
            description: "Language for results (e.g., 'de', 'fr', 'it')",
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "legal_strategy",
      description:
        "Generate a structured legal case strategy for a given question and jurisdiction.",
      parameters: {
        type: "object" as const,
        properties: {
          question: {
            type: "string",
            description: "The legal question or case description",
          },
          jurisdiction: {
            type: "string",
            description: "Applicable jurisdiction (e.g., 'CH', 'ZH')",
          },
          language: {
            type: "string",
            description: "Output language (e.g., 'de', 'fr', 'it', 'en')",
          },
        },
        required: ["question"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "legal_draft",
      description:
        "Draft Swiss legal documents (e.g., contracts, motions, appeals).",
      parameters: {
        type: "object" as const,
        properties: {
          document_type: {
            type: "string",
            description: "Type of document to draft (e.g., 'contract', 'motion', 'appeal')",
          },
          language: {
            type: "string",
            description: "Language of the document (e.g., 'de', 'fr', 'it')",
          },
          parties: {
            type: "array",
            items: { type: "string" },
            description: "Names of the parties involved",
          },
          subject: {
            type: "string",
            description: "Subject matter or purpose of the document",
          },
          key_terms: {
            type: "string",
            description: "Key terms, conditions, or requirements to include",
          },
        },
        required: ["document_type", "subject"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "legal_analyze",
      description:
        "Analyze a legal document for compliance, risks, and improvement suggestions.",
      parameters: {
        type: "object" as const,
        properties: {
          text: {
            type: "string",
            description: "The legal document text to analyze",
          },
          document_type: {
            type: "string",
            description: "Type of document (e.g., 'contract', 'motion', 'appeal')",
          },
          language: {
            type: "string",
            description: "Language of the document (e.g., 'de', 'fr', 'it', 'en')",
          },
        },
        required: ["text"],
      },
    },
  },
];
