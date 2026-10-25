import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createAlternative } from '../domain/defaults'
import type { HousingAlternative } from '../domain/types'

interface AlternativesState {
  alternatives: HousingAlternative[]
  add: (alt: HousingAlternative) => void
  update: (id: string, changes: Partial<HousingAlternative>) => void
  duplicate: (id: string) => void
  remove: (id: string) => void
}

export const useAlternatives = create<AlternativesState>()(
  persist(
    (set) => ({
      alternatives: [
        createAlternative({ name: 'Apartment, city' }),
        createAlternative({
          name: 'House, suburb',
          price: 5_200_000,
          downPayment: 1_200_000,
          monthlyFee: 0,
          operatingCostMonthly: 2_500,
          insuranceMonthly: 400,
          propertyFeeYearly: 10_000,
          oneOffCosts: 110_000,
        }),
      ],
      add: (alt) => set((s) => ({ alternatives: [...s.alternatives, alt] })),
      update: (id, changes) =>
        set((s) => ({
          alternatives: s.alternatives.map((a) => (a.id === id ? { ...a, ...changes } : a)),
        })),
      duplicate: (id) =>
        set((s) => {
          const source = s.alternatives.find((a) => a.id === id)
          if (!source) return s
          const copy = { ...source, id: crypto.randomUUID(), name: `${source.name} (copy)` }
          return { alternatives: [...s.alternatives, copy] }
        }),
      remove: (id) =>
        set((s) => ({ alternatives: s.alternatives.filter((a) => a.id !== id) })),
    }),
    { name: 'housing-alternatives', version: 1 },
  ),
)
