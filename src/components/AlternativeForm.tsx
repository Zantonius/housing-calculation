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
        <TextInput label="Name" {...register('name')} error={formState.errors.name?.message} />

        <Divider label="Purchase & loan" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput control={control} name="price" label="Price" />
          <NumberFieldInput control={control} name="downPayment" label="Down payment" />
          <NumberFieldInput
            control={control}
            name="interestRatePercent"
            label="Interest rate"
            suffix=" %"
            decimalScale={2}
          />
          <Controller
            control={control}
            name="applyInterestDeduction"
            render={({ field }) => (
              <Switch
                mt="xl"
                label="Interest deduction (ränteavdrag)"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
        </SimpleGrid>

        <Stack gap={4}>
          <Text size="sm" fw={500}>
            Amortization
          </Text>
          <Controller
            control={control}
            name="amortizationMode"
            render={({ field }) => (
              <SegmentedControl
                value={field.value}
                onChange={field.onChange}
                data={[
                  { value: 'auto', label: 'Auto (LTV rule)' },
                  { value: 'manual', label: 'Manual' },
                ]}
              />
            )}
          />
          {amortizationMode === 'manual' && (
            <NumberFieldInput
              control={control}
              name="amortizationPercent"
              label="Amortization per year"
              suffix=" %"
              decimalScale={2}
            />
          )}
        </Stack>

        <Divider label="Running costs" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput control={control} name="monthlyFee" label="HOA fee / month" />
          <NumberFieldInput
            control={control}
            name="operatingCostMonthly"
            label="Operating costs / month"
            description="Electricity, heating, water"
          />
          <NumberFieldInput control={control} name="insuranceMonthly" label="Insurance / month" />
          <NumberFieldInput
            control={control}
            name="propertyFeeYearly"
            label="Property fee / year"
            description="Fastighetsavgift"
          />
          <NumberFieldInput control={control} name="otherMonthly" label="Other / month" />
        </SimpleGrid>

        <Divider label="One-off costs" labelPosition="left" />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <NumberFieldInput
            control={control}
            name="oneOffCosts"
            label="One-off costs"
            description="Lagfart, pantbrev, moving etc."
          />
          <NumberFieldInput
            control={control}
            name="oneOffSpreadYears"
            label="Spread over"
            suffix=" years"
            description="0 excludes them from the monthly cost"
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </Group>
      </Stack>
    </form>
  )
}
