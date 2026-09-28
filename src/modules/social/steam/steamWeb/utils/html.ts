/** Parse in a detached document; never insert Steam HTML into the host page. */
export function parseHTML(html: string): Document {
  return new DOMParser().parseFromString(html.replace(/<img\b[^>]*>/gi, ''), 'text/html');
}

export function encodeForm(values: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    params.set(key, value == null ? '' : String(value));
  }
  return params.toString();
}
