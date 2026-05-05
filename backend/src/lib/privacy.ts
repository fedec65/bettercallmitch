/**
 * Anwaltsgeheimnis (attorney-client privilege) detection module.
 *
 * Ports the privilege scanning logic from BetterCallClaude into the Mike backend.
 * Scans text/content for Swiss legal privilege markers before content is sent
 * to external MCP servers.
 */

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface ScanResult {
  isPrivileged: boolean;
  category?: string;
  reason?: string;
}

export interface PrivacyContext {
  path?: string;
  toolName?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Patterns                                   */
/* -------------------------------------------------------------------------- */

interface StrongPattern {
  regex: RegExp;
  category: string;
  label: string;
}

interface WeakPattern {
  regex: RegExp;
  word: string;
}

/** Strong patterns – always trigger privilege detection when found. */
const STRONG_PATTERNS: StrongPattern[] = [
  // German
  {
    regex: /(?<!\w)anwaltsgeheimnis(?!\w)/iu,
    category: 'anwaltsgeheimnis',
    label: 'German attorney-client privilege',
  },
  {
    regex: /(?<!\w)mandatsgeheimnis(?!\w)/iu,
    category: 'mandatsgeheimnis',
    label: 'German mandate secrecy',
  },
  {
    regex: /(?<!\w)berufsgeheimnis(?!\w)/iu,
    category: 'berufsgeheimnis',
    label: 'German professional secrecy',
  },
  {
    regex: /(?<!\w)geschaeftsgeheimnis(?!\w)/iu,
    category: 'geschaeftsgeheimnis',
    label: 'German business secret',
  },
  {
    regex: /(?<!\w)streng\s+vertraulich(?!\w)/iu,
    category: 'streng-vertraulich',
    label: 'German strictly confidential',
  },

  // French
  {
    regex: /(?<!\w)secret\s+professionnel(?!\w)/iu,
    category: 'secret-professionnel',
    label: 'French professional secrecy',
  },
  {
    regex: /(?<!\w)secret\s+d'affaires(?!\w)/iu,
    category: 'secret-d-affaires',
    label: 'French business secret',
  },
  {
    regex: /(?<!\w)strictement\s+confidentiel(?!\w)/iu,
    category: 'strictement-confidentiel',
    label: 'French strictly confidential',
  },

  // Italian
  {
    regex: /(?<!\w)segreto\s+professionale(?!\w)/iu,
    category: 'segreto-professionale',
    label: 'Italian professional secrecy',
  },
  {
    regex: /(?<!\w)segreto\s+commerciale(?!\w)/iu,
    category: 'segreto-commerciale',
    label: 'Italian business secret',
  },
  {
    regex: /(?<!\w)segreto\s+del\s+mandato(?!\w)/iu,
    category: 'segreto-del-mandato',
    label: 'Italian mandate secrecy',
  },
  {
    regex: /(?<!\w)strettamente\s+riservato(?!\w)/iu,
    category: 'strettamente-riservato',
    label: 'Italian strictly confidential',
  },

  // Legal articles
  {
    regex: /(?<!\w)Art\.\s*321\s+StGB(?!\w)/iu,
    category: 'Art.321-StGB',
    label: 'Swiss Penal Code Art. 321',
  },
  {
    regex: /(?<!\w)Art\.\s*13\s+BGFA(?!\w)/iu,
    category: 'Art.13-BGFA',
    label: 'Federal Lawyers Act Art. 13',
  },
  {
    regex: /(?<!\w)Art\.\s*162\s+StGB(?!\w)/iu,
    category: 'Art.162-StGB',
    label: 'Swiss Penal Code Art. 162',
  },
  {
    regex: /(?<!\w)Art\.\s*47\s+BankG(?!\w)/iu,
    category: 'Art.47-BankG',
    label: 'Banking Act Art. 47',
  },
  {
    regex: /(?<!\w)Art\.\s*35\s+FINMAG(?!\w)/iu,
    category: 'Art.35-FINMAG',
    label: 'FINMAG Art. 35',
  },
];

/** Weak patterns – trigger only when combined with a discriminator. */
const WEAK_PATTERNS: WeakPattern[] = [
  { regex: /(?<!\w)vertraulich(?!\w)/iu, word: 'vertraulich' },
  { regex: /(?<!\w)confidentiel(?!\w)/iu, word: 'confidentiel' },
  { regex: /(?<!\w)riservato(?!\w)/iu, word: 'riservato' },
  { regex: /(?<!\w)confidential(?!\w)/iu, word: 'confidential' },
];

/** Path-hint discriminators. */
const PATH_DISCRIMINATORS: RegExp[] = [
  /(?<!\w)klient(?!\w)/iu,
  /(?<!\w)mandant(?!\w)/iu,
  /(?<!\w)client(?!\w)/iu,
  /(?<!\w)case(?!\w)/iu,
  /(?<!\w)dossier(?!\w)/iu,
  /(?<!\w)fall(?!\w)/iu,
  /(?<!\w)akten(?!\w)/iu,
  /(?<!\w)privileged(?!\w)/iu,
  /(?<!\w)matter(?!\w)/iu,
  /(?<!\w)case-files(?!\w)/iu,
];

/** Content discriminators. */
const CONTENT_DISCRIMINATORS: RegExp[] = [
  /(?<!\w)mandant(?!\w)/iu,
  /(?<!\w)klient(?!\w)/iu,
  /(?<!\w)dossier(?!\w)/iu,
  /(?<!\w)aktenzeichen(?!\w)/iu,
  /(?<!\w)case\s+number(?!\w)/iu,
  /(?<!\w)prozess(?!\w)/iu,
  /(?<!\w)proc[eè]s(?!\w)/iu,
  /(?<!\w)procedura(?!\w)/iu,
];

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function testRegex(content: string, regex: RegExp): boolean {
  return regex.test(content);
}

/* -------------------------------------------------------------------------- */
/*                                 Core API                                   */
/* -------------------------------------------------------------------------- */

/**
 * Classify content based on privilege markers.
 *
 * Strong patterns always return their category when matched.
 * Weak patterns require either:
 *   - a path-hint discriminator,
 *   - a content discriminator, or
 *   - 2+ co-occurring weak patterns.
 *
 * @param content   The text to scan.
 * @param pathHint  Optional path hint used for path discriminators.
 * @returns A category string if privileged content is detected, otherwise `null`.
 */
export function classify(content: string, pathHint?: string): string | null {
  // 1. Strong patterns always trigger.
  for (const { regex, category } of STRONG_PATTERNS) {
    if (testRegex(content, regex)) {
      return category;
    }
  }

  // 2. Count matched weak pattern types.
  const matchedWeak = WEAK_PATTERNS.filter(({ regex }) =>
    testRegex(content, regex)
  );
  const weakCount = matchedWeak.length;

  if (weakCount === 0) {
    return null;
  }

  // 3. Two or more weak patterns co-occurring trigger.
  if (weakCount >= 2) {
    return 'co-occurring-weak-patterns';
  }

  // 4. Path-hint discriminators.
  if (pathHint) {
    for (const regex of PATH_DISCRIMINATORS) {
      if (testRegex(pathHint, regex)) {
        return 'weak-with-path-discriminator';
      }
    }
  }

  // 5. Content discriminators.
  for (const regex of CONTENT_DISCRIMINATORS) {
    if (testRegex(content, regex)) {
      return 'weak-with-content-discriminator';
    }
  }

  return null;
}

/**
 * Scan content for attorney-client privilege markers.
 *
 * @param content  The text to scan.
 * @param context  Optional context (path / toolName) for discriminators.
 * @returns Scan result with `isPrivileged`, `category`, and `reason`.
 */
export function scanForPrivilege(
  content: string,
  context?: PrivacyContext
): ScanResult {
  const pathParts = [context?.path, context?.toolName].filter(
    (p): p is string => typeof p === 'string' && p.length > 0
  );
  const pathHint = pathParts.length > 0 ? pathParts.join(' ') : undefined;

  const category = classify(content, pathHint);

  if (!category) {
    return { isPrivileged: false };
  }

  // Build a human-readable reason.
  const matchedStrong = STRONG_PATTERNS.find(({ regex }) =>
    testRegex(content, regex)
  );
  if (matchedStrong) {
    return {
      isPrivileged: true,
      category,
      reason: `Strong privilege marker detected: ${matchedStrong.label}`,
    };
  }

  const matchedWeakWords = WEAK_PATTERNS.filter(({ regex }) =>
    testRegex(content, regex)
  ).map(({ word }) => word);

  if (matchedWeakWords.length >= 2) {
    return {
      isPrivileged: true,
      category,
      reason: `Multiple weak privilege markers co-occurring: ${matchedWeakWords.join(', ')}`,
    };
  }

  const matchedWeak = WEAK_PATTERNS.find(({ regex }) =>
    testRegex(content, regex)
  );
  if (matchedWeak) {
    return {
      isPrivileged: true,
      category,
      reason: `Weak privilege marker "${matchedWeak.word}" detected with discriminator`,
    };
  }

  // Fallback – should not be reachable when category is non-null.
  return {
    isPrivileged: true,
    category,
    reason: 'Privileged content detected',
  };
}

/* -------------------------------------------------------------------------- */
/*                              Express Middleware                            */
/* -------------------------------------------------------------------------- */

/** Minimal Express-compatible request shape. */
interface PrivacyRequest {
  body?: unknown;
  path: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** Minimal Express-compatible response shape. */
interface PrivacyResponse {
  status(code: number): PrivacyResponse;
  json(body: unknown): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** Minimal Express-compatible next function. */
type PrivacyNext = (err?: unknown) => void;

/**
 * Express-compatible middleware that scans outgoing request bodies for
 * privileged content and blocks the request (403) when detected.
 *
 * Usage:
 *   app.use(privacyCheckMiddleware);
 */
export function privacyCheckMiddleware(
  req: PrivacyRequest,
  res: PrivacyResponse,
  next: PrivacyNext
): void {
  try {
    const body = req.body;
    const content =
      typeof body === 'string' ? body : JSON.stringify(body ?? '');
    const result = scanForPrivilege(content, { path: req.path });

    if (result.isPrivileged) {
      res.status(403).json({
        error: 'Privileged content blocked by privacy policy',
        category: result.category,
        reason: result.reason,
      });
      return;
    }
  } catch {
    // Scanning errors should not break the request pipeline.
  }

  next();
}
