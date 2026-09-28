/** Format timestamps and ISO dates in local time, matching the existing UI. */
export const formatDateTime = (value: number | string | Date): string => {
  // Date-only ISO strings must be interpreted locally, rather than as UTC.
  const local = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/.exec(value);
  const date = local ?
    new Date(Number(local[1]), Number(local[2]) - 1, Number(local[3]), Number(local[4] || 0), Number(local[5] || 0), Number(local[6] || 0), Number((local[7] || '').slice(0, 3).padEnd(3, '0'))) :
    new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid Date';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
