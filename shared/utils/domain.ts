const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/

export function normalizeDomain(input: string): string {
  const value = input.trim().toLowerCase()
  if (!value) return ''
  try {
    const { hostname } = new URL(/^https?:\/\//.test(value) ? value : `https://${value}`)
    return DOMAIN_PATTERN.test(hostname) ? hostname : ''
  }
  catch {
    return ''
  }
}

export function siteOrigin(input: string): string {
  const domain = normalizeDomain(input)
  return domain ? `https://${domain}` : ''
}
