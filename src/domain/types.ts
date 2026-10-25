export type AmortizationMode = 'auto' | 'manual'

export interface HousingAlternative {
  id: string
  name: string

  /** Purchase price */
  price: number
  /** Cash paid upfront (kontantinsats) */
  downPayment: number

  /** Annual mortgage interest rate, in percent */
  interestRatePercent: number
  /** 'auto' applies the Swedish loan-to-value amortization rule */
  amortizationMode: AmortizationMode
  /** Annual amortization in percent of the loan, used when mode is 'manual' */
  amortizationPercent: number
  /** Apply Swedish interest tax deduction (ränteavdrag) */
  applyInterestDeduction: boolean

  /** HOA fee (månadsavgift) */
  monthlyFee: number
  /** Electricity, heating, water etc. */
  operatingCostMonthly: number
  insuranceMonthly: number
  /** Property fee (fastighetsavgift), per year */
  propertyFeeYearly: number
  otherMonthly: number

  /** One-off costs such as lagfart and pantbrev */
  oneOffCosts: number
  /** Number of years to spread the one-off costs over */
  oneOffSpreadYears: number
}

export interface MonthlyBreakdown {
  loanAmount: number
  loanToValue: number
  amortizationPercent: number

  interest: number
  interestDeduction: number
  amortization: number
  monthlyFee: number
  operatingCost: number
  insurance: number
  propertyFee: number
  other: number
  oneOff: number

  /** Everything except amortization, which is savings rather than a cost */
  livingCost: number
  /** Total monthly outflow including amortization */
  total: number
}
