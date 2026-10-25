const currency = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
})

const percent = new Intl.NumberFormat('sv-SE', {
  style: 'percent',
  maximumFractionDigits: 1,
})

export const formatSek = (value: number) => currency.format(value)
export const formatPercent = (fraction: number) => percent.format(fraction)
