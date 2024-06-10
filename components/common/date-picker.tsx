import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date'
import { DatePicker as DatePickerUI } from '@nextui-org/react'

type DatePickerProps = {
  className?: string
  label?: string
  name?: string
  isRequired?: boolean
  value?: string
  onChange: (value: string) => void
}

function fromDate (value?: string) {
  return value
    ? parseAbsoluteToLocal(new Date(value).toISOString())
    : null
}

export default function DatePicker ({
  className,
  label,
  name,
  isRequired,
  value,
  onChange
}: DatePickerProps) {
  function handleChange (value: ZonedDateTime) {
    if (onChange && value) {
      onChange(new Date(value.toAbsoluteString()).toISOString().slice(0, 10))
    }
  }
  return (
    <DatePickerUI
      className={`${className}`}
      label={label}
      name={name}
      granularity="day"
      isRequired={isRequired}
      value={fromDate(value)}
      onChange={handleChange}
    />
  )
}
