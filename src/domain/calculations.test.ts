import { describe, expect, it } from 'vitest'
import {
  amortizationRateForLtv,
  calculateMonthlyCost,
  yearlyInterestDeduction,
} from './calculations'
import { createAlternative } from './defaults'

describe('amortizationRateForLtv', () => {
  it.each([
    [0.85, 2],
    [0.71, 2],
    [0.7, 1],
    [0.51, 1],
    [0.5, 0],
    [0, 0],
  ])('LTV %f → %f %%', (ltv, expected) => {
    expect(amortizationRateForLtv(ltv)).toBe(expected)
  })
})

describe('yearlyInterestDeduction', () => {
  it('gives 30 % up to 100 000', () => {
    expect(yearlyInterestDeduction(50_000)).toBe(15_000)
    expect(yearlyInterestDeduction(100_000)).toBe(30_000)
  })

  it('gives 21 % above 100 000', () => {
    expect(yearlyInterestDeduction(150_000)).toBeCloseTo(30_000 + 10_500)
  })

  it('is zero for no interest', () => {
    expect(yearlyInterestDeduction(0)).toBe(0)
  })
})

describe('calculateMonthlyCost', () => {
  const base = createAlternative({
    price: 3_000_000,
    downPayment: 450_000,
    interestRatePercent: 4,
    amortizationMode: 'auto',
    applyInterestDeduction: true,
    monthlyFee: 4_000,
    operatingCostMonthly: 500,
    insuranceMonthly: 200,
    propertyFeeYearly: 1_200,
    otherMonthly: 100,
    oneOffCosts: 60_000,
    oneOffSpreadYears: 5,
  })

  it('calculates the full breakdown', () => {
    const r = calculateMonthlyCost(base)

    expect(r.loanAmount).toBe(2_550_000)
    expect(r.loanToValue).toBeCloseTo(0.85)
    expect(r.amortizationPercent).toBe(2)

    // 2 550 000 × 4 % = 102 000 / year
    expect(r.interest).toBeCloseTo(8_500)
    // 30 000 + 2 000 × 0.21 = 30 420 / year
    expect(r.interestDeduction).toBeCloseTo(2_535)
    // 2 550 000 × 2 % = 51 000 / year
    expect(r.amortization).toBeCloseTo(4_250)
    expect(r.propertyFee).toBeCloseTo(100)
    expect(r.oneOff).toBeCloseTo(1_000)

    const living = 8_500 - 2_535 + 4_000 + 500 + 200 + 100 + 100 + 1_000
    expect(r.livingCost).toBeCloseTo(living)
    expect(r.total).toBeCloseTo(living + 4_250)
  })

  it('uses manual amortization when selected', () => {
    const r = calculateMonthlyCost({
      ...base,
      amortizationMode: 'manual',
      amortizationPercent: 3,
    })
    expect(r.amortizationPercent).toBe(3)
    expect(r.amortization).toBeCloseTo((2_550_000 * 0.03) / 12)
  })

  it('skips the deduction when disabled', () => {
    expect(
      calculateMonthlyCost({ ...base, applyInterestDeduction: false }).interestDeduction,
    ).toBe(0)
  })

  it('handles a fully paid property', () => {
    const r = calculateMonthlyCost({ ...base, downPayment: 3_000_000 })
    expect(r.loanAmount).toBe(0)
    expect(r.interest).toBe(0)
    expect(r.amortization).toBe(0)
  })

  it('ignores one-off costs when spread over 0 years', () => {
    expect(calculateMonthlyCost({ ...base, oneOffSpreadYears: 0 }).oneOff).toBe(0)
  })
})
