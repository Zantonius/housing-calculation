import { Button, Container, Group, Modal, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useMemo, useState } from 'react'
import { AlternativeCard } from './components/AlternativeCard'
import { AlternativeForm } from './components/AlternativeForm'
import { ComparisonChart } from './components/ComparisonChart'
import { calculateMonthlyCost } from './domain/calculations'
import { createAlternative } from './domain/defaults'
import type { AlternativeFormValues } from './domain/schema'
import type { HousingAlternative } from './domain/types'
import { useAlternatives } from './store/alternatives'

type Editing = { mode: 'new'; draft: HousingAlternative } | { mode: 'edit'; id: string } | null

export default function App() {
  const { alternatives, add, update, duplicate, remove } = useAlternatives()
  const [editing, setEditing] = useState<Editing>(null)

  const rows = useMemo(
    () => alternatives.map((a) => ({ alternative: a, breakdown: calculateMonthlyCost(a) })),
    [alternatives],
  )

  const editTarget =
    editing?.mode === 'new'
      ? editing.draft
      : editing?.mode === 'edit'
        ? alternatives.find((a) => a.id === editing.id)
        : undefined

  const handleSubmit = (values: AlternativeFormValues) => {
    if (editing?.mode === 'new') add({ ...editing.draft, ...values })
    if (editing?.mode === 'edit') update(editing.id, values)
    setEditing(null)
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1}>Boendekalkyl</Title>
            <Text c="dimmed">Jämför den totala månadskostnaden för olika boendealternativ.</Text>
          </div>
          <Button onClick={() => setEditing({ mode: 'new', draft: createAlternative() })}>
            Lägg till alternativ
          </Button>
        </Group>

        {rows.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Inga alternativ än. Lägg till ett för att komma igång.
          </Text>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {rows.map(({ alternative, breakdown }) => (
                <AlternativeCard
                  key={alternative.id}
                  alternative={alternative}
                  breakdown={breakdown}
                  onEdit={() => setEditing({ mode: 'edit', id: alternative.id })}
                  onDuplicate={() => duplicate(alternative.id)}
                  onRemove={() => remove(alternative.id)}
                />
              ))}
            </SimpleGrid>
            <ComparisonChart rows={rows} />
          </>
        )}

        <Text size="xs" c="dimmed">
          Auto-amortering följer amorteringskravet (2 % vid belåningsgrad över 70 %, 1 % över
          50 %). Ränteavdraget är 30 % på räntekostnader upp till 100 000 kr per år och 21 %
          därutöver. Uppgifterna sparas bara i den här webbläsaren.
        </Text>
      </Stack>

      <Modal
        opened={editTarget !== undefined}
        onClose={() => setEditing(null)}
        title={editing?.mode === 'new' ? 'Lägg till alternativ' : 'Redigera alternativ'}
        size="lg"
      >
        {editTarget && (
          <AlternativeForm
            key={editTarget.id}
            initialValues={editTarget}
            submitLabel={editing?.mode === 'new' ? 'Lägg till' : 'Spara'}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </Container>
  )
}
