import type { HousingAlternative, MonthlyBreakdown } from './types'

const DEDUCTION_THRESHOLD = 100_000
const DEDUCTION_RATE_LOW = 0.3
const DEDUCTION_RATE_HIGH = 0.21

/**
 * Swedish amortization requirement based on loan-to-value:
 * above 70 % → 2 % per year, above 50 % → 1 % per year, otherwise none.
 */
export function amortizationRateForLtv(loanToValue: number): number {
  if (loanToValue > 0.7) return 2
  if (loanToValue > 0.5) return 1
  return 0
}

/**
 * Swedish interest deduction: 30 % of yearly interest up to 100 000 kr,
 * 21 % on the part above that.
 */
export function yearlyInterestDeduction(yearlyInterest: number): number {
  if (yearlyInterest <= 0) return 0
  const low = Math.min(yearlyInterest, DEDUCTION_THRESHOLD)
  const high = Math.max(0, yearlyInterest - DEDUCTION_THRESHOLD)
  return low * DEDUCTION_RATE_LOW + high * DEDUCTION_RATE_HIGH
}

export function calculateMonthlyCost(alt: HousingAlternative): MonthlyBreakdown {
  const loanAmount = Math.max(0, alt.price - alt.downPayment)
  const loanToValue = alt.price > 0 ? loanAmount / alt.price : 0

  const amortizationPercent =
    alt.amortizationMode === 'auto'
      ? amortizationRateForLtv(loanToValue)
      : alt.amortizationPercent

  const yearlyInterest = loanAmount * (alt.interestRatePercent / 100)
  const interest = yearlyInterest / 12
  const interestDeduction = alt.applyInterestDeduction
    ? yearlyInterestDeduction(yearlyInterest) / 12
    : 0
  const amortization = (loanAmount * (amortizationPercent / 100)) / 12

  const propertyFee = alt.propertyFeeYearly / 12
  const oneOff =
    alt.oneOffSpreadYears > 0 ? alt.oneOffCosts / (alt.oneOffSpreadYears * 12) : 0

  const livingCost =
    interest -
    interestDeduction +
    alt.monthlyFee +
    alt.operatingCostMonthly +
    alt.insuranceMonthly +
    propertyFee +
    alt.otherMonthly +
    oneOff

  return {
    loanAmount,
    loanToValue,
    amortizationPercent,
    interest,
    interestDeduction,
    amortization,
    monthlyFee: alt.monthlyFee,
    operatingCost: alt.operatingCostMonthly,
    insurance: alt.insuranceMonthly,
    propertyFee,
    other: alt.otherMonthly,
    oneOff,
    livingCost,
    total: livingCost + amortization,
  }
}
