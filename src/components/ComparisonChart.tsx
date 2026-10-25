import { Card, Title } from '@mantine/core'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HousingAlternative, MonthlyBreakdown } from '../domain/types'
import { formatSek } from '../format'

interface Props {
  rows: { alternative: HousingAlternative; breakdown: MonthlyBreakdown }[]
}

const SERIES = [
  { key: 'netInterest', label: 'Interest (net)', color: 'var(--mantine-color-blue-6)' },
  { key: 'amortization', label: 'Amortization', color: 'var(--mantine-color-teal-6)' },
  { key: 'fee', label: 'HOA fee', color: 'var(--mantine-color-violet-6)' },
  { key: 'running', label: 'Running costs', color: 'var(--mantine-color-orange-6)' },
  { key: 'oneOff', label: 'One-off (spread)', color: 'var(--mantine-color-gray-6)' },
] as const

export function ComparisonChart({ rows }: Props) {
  const data = rows.map(({ alternative, breakdown: b }) => ({
    name: alternative.name,
    netInterest: Math.round(b.interest - b.interestDeduction),
    amortization: Math.round(b.amortization),
    fee: Math.round(b.monthlyFee),
    running: Math.round(b.operatingCost + b.insurance + b.propertyFee + b.other),
    oneOff: Math.round(b.oneOff),
  }))

  return (
    <Card withBorder radius="md" padding="lg">
      <Title order={2} size="h4" mb="md">
        Monthly cost comparison
      </Title>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
          <Tooltip formatter={(v) => formatSek(Number(v))} />
          <Legend />
          {SERIES.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} stackId="cost" fill={s.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
