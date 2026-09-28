export function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Read one JSON value following a quoted property. Handles nested braces and escaped quotes. */
export function jsonProperty(text: string, key: string): unknown {
  const matcher = new RegExp(`"${key}"\\s*:\\s*`, 'g');
  while (matcher.exec(text)) {
    const start = matcher.lastIndex;
    let depth = 0;
    let quoted = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (quoted) {
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === '"') {
          quoted = false;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === '{' || char === '[') {
        depth++;
      } else if (char === '}' || char === ']') {
        depth--;
      }
      if (!quoted && depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          break;
        }
      }
    }
  }
  return undefined;
}
