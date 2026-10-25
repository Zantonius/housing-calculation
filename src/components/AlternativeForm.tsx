import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Divider,
  Group,
  NumberInput,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core'
import { Controller, useForm, useWatch, type Control } from 'react-hook-form'
import {
  alternativeFormSchema,
  type AlternativeFormValues,
} from '../domain/schema'

type NumberField = {
  [K in keyof AlternativeFormValues]: AlternativeFormValues[K] extends number ? K : never
}[keyof AlternativeFormValues]

interface NumberFieldProps {
  control: Control<AlternativeFormValues>
  name: NumberField
  label: string
  suffix?: string
  description?: string
  decimalScale?: number
  disabled?: boolean
}

function NumberFieldInput({
  control,
  name,
  label,
  suffix = ' kr',
  description,
  decimalScale = 0,
  disabled,
}: NumberFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberInput
          label={label}
          description={description}
          suffix={suffix}
          thousandSeparator=" "
          decimalSeparator=","
          decimalScale={decimalScale}
          min={0}
          hideControls
          disabled={disabled}
          value={Number.isNaN(field.value) ? '' : field.value}
          onChange={(v) => field.onChange(typeof v === 'number' ? v : NaN)}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

interface Props {
  initialValues: AlternativeFormValues
  submitLabel: string
  onSubmit: (values: AlternativeFormValues) => void
  onCancel: () => void
}

export function AlternativeForm({ initialValues, submitLabel, onSubmit, onCancel }: Props) {
  const { control, register, handleSubmit, formState } = useForm<AlternativeFormValues>({
    resolver: zodResolver(alternativeFormSchema),
    defaultValues: initialValues,
    mode: 'onBlur',
  })
  const amortizationMode = useWatch({ control, name: 'amortizationMode' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <TextInput label="Namn" {...register('name')} error={formState.errors.name?.message} />

        <Divider label="Köp & lån" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput control={control} name="price" label="Pris" />
          <NumberFieldInput control={control} name="downPayment" label="Kontantinsats" />
          <NumberFieldInput
            control={control}
            name="interestRatePercent"
            label="Ränta"
            suffix=" %"
            decimalScale={2}
          />
          <Controller
            control={control}
            name="applyInterestDeduction"
            render={({ field }) => (
              <Switch
                mt="xl"
                label="Ränteavdrag"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
        </SimpleGrid>

        <Stack gap={4}>
          <Text size="sm" fw={500}>
            Amortering
          </Text>
          <Controller
            control={control}
            name="amortizationMode"
            render={({ field }) => (
              <SegmentedControl
                value={field.value}
                onChange={field.onChange}
                data={[
                  { value: 'auto', label: 'Auto (amorteringskrav)' },
                  { value: 'manual', label: 'Manuell' },
                ]}
              />
            )}
          />
          {amortizationMode === 'manual' && (
            <NumberFieldInput
              control={control}
              name="amortizationPercent"
              label="Amortering per år"
              suffix=" %"
              decimalScale={2}
            />
          )}
        </Stack>

        <Divider label="Löpande kostnader" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput control={control} name="monthlyFee" label="Månadsavgift" />
          <NumberFieldInput
            control={control}
            name="operatingCostMonthly"
            label="Driftkostnad / mån"
            description="El, värme, vatten"
          />
          <NumberFieldInput control={control} name="insuranceMonthly" label="Försäkring / mån" />
          <NumberFieldInput
            control={control}
            name="propertyFeeYearly"
            label="Fastighetsavgift / år"
          />
          <NumberFieldInput control={control} name="otherMonthly" label="Övrigt / mån" />
        </SimpleGrid>

        <Divider label="Engångskostnader" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput
            control={control}
            name="oneOffCosts"
            label="Engångskostnader"
            description="Lagfart, pantbrev, flytt m.m."
          />
          <NumberFieldInput
            control={control}
            name="oneOffSpreadYears"
            label="Fördela över"
            suffix=" år"
            description="0 = räknas inte in i månadskostnaden"
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  )
}
