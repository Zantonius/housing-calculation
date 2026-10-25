import { z } from 'zod'

const amount = z.number({ error: 'Obligatoriskt' }).min(0, 'Måste vara 0 eller mer')
const percent = amount.max(100, 'Får vara högst 100')

export const alternativeFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Obligatoriskt'),
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
    oneOffSpreadYears: amount.int('Ange hela år'),
  })
  .refine((v) => v.downPayment <= v.price, {
    message: 'Får inte överstiga priset',
    path: ['downPayment'],
  })

export type AlternativeFormValues = z.infer<typeof alternativeFormSchema>
