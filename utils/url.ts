export function toString (value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value.pop() : value
}

export function toNumber (value: string | string[] | undefined): number | undefined {
  const num = (Array.isArray(value) ? value.pop() : value)
  return num !== undefined ? Number(num) : num
}
