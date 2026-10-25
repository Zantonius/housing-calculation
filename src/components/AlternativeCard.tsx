import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import type { HousingAlternative, MonthlyBreakdown } from '../domain/types'
import { formatPercent, formatSek } from '../format'

interface Props {
  alternative: HousingAlternative
  breakdown: MonthlyBreakdown
  onEdit: () => void
  onDuplicate: () => void
  onRemove: () => void
}

function Row({ label, value, dimmed }: { label: string; value: string; dimmed?: boolean }) {
  return (
    <Group justify="space-between" gap="xs" wrap="nowrap">
      <Text size="sm" c={dimmed ? 'dimmed' : undefined}>
        {label}
      </Text>
      <Text size="sm" c={dimmed ? 'dimmed' : undefined} ff="monospace">
        {value}
      </Text>
    </Group>
  )
}

export function AlternativeCard({ alternative, breakdown: b, onEdit, onDuplicate, onRemove }: Props) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="sm">
        <div>
          <Title order={3} size="h4">
            {alternative.name}
          </Title>
          <Text size="sm" c="dimmed">
            {formatSek(alternative.price)} · loan {formatSek(b.loanAmount)} (
            {formatPercent(b.loanToValue)})
          </Text>
        </div>

        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
            Total per month
          </Text>
          <Text size="xl" fw={700}>
            {formatSek(b.total)}
          </Text>
          <Text size="sm" c="dimmed">
            {formatSek(b.livingCost)} excl. amortization
          </Text>
        </div>

        <Stack gap={2}>
          <Row label="Interest" value={formatSek(b.interest)} />
          {b.interestDeduction > 0 && (
            <Row label="Interest deduction" value={`−${formatSek(b.interestDeduction)}`} dimmed />
          )}
          <Row
            label={`Amortization (${b.amortizationPercent} %)`}
            value={formatSek(b.amortization)}
          />
          <Row label="HOA fee" value={formatSek(b.monthlyFee)} />
          <Row label="Operating costs" value={formatSek(b.operatingCost)} />
          <Row label="Insurance" value={formatSek(b.insurance)} />
          {b.propertyFee > 0 && <Row label="Property fee" value={formatSek(b.propertyFee)} />}
          {b.other > 0 && <Row label="Other" value={formatSek(b.other)} />}
          {b.oneOff > 0 && <Row label="One-off (spread)" value={formatSek(b.oneOff)} />}
        </Stack>

        <Group gap="xs" mt="xs">
          <Button size="xs" onClick={onEdit}>
            Edit
          </Button>
          <Button size="xs" variant="default" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button size="xs" variant="subtle" color="red" onClick={onRemove}>
            Remove
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
