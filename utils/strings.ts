export function capitalize (s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

export function toDateString (date?: string | Date | null): string {
  return date !== null
    ? (date instanceof Date ? date.toISOString() : date ?? '').slice(0, 10)
    : ''
}

export function toHumanReadableString (date: Date | null): string {
  return date ? new Date(date).toDateString() : 'Unknown release'
}
