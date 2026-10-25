import type { HousingAlternative } from './types'

export function createAlternative(
  overrides: Partial<HousingAlternative> = {},
): HousingAlternative {
  return {
    id: crypto.randomUUID(),
    name: 'New alternative',
    price: 3_000_000,
    downPayment: 450_000,
    interestRatePercent: 3.5,
    amortizationMode: 'auto',
    amortizationPercent: 2,
    applyInterestDeduction: true,
    monthlyFee: 4_000,
    operatingCostMonthly: 500,
    insuranceMonthly: 150,
    propertyFeeYearly: 0,
    otherMonthly: 0,
    oneOffCosts: 0,
    oneOffSpreadYears: 5,
    ...overrides,
  }
}
