import { z } from 'zod'

const amount = z.number({ error: 'Required' }).min(0, 'Must be 0 or more')
const percent = amount.max(100, 'Must be at most 100')

export const alternativeFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Required'),
    price: amount,
    downPayment: amount,
    interestRatePercent: percent,
    amortizationMode: z.enum(['auto', 'manual']),
    amortizationPercent: percent,
    applyInterestDeduction: z.boolean(),
    monthlyFee: amount,
    operatingCostMonthly: amount,
    insuranceMonthly: amount,
    propertyFeeYearly: amount,
    otherMonthly: amount,
    oneOffCosts: amount,
    oneOffSpreadYears: amount.int('Whole years only'),
  })
  .refine((v) => v.downPayment <= v.price, {
    message: 'Cannot exceed the price',
    path: ['downPayment'],
  })

export type AlternativeFormValues = z.infer<typeof alternativeFormSchema>
