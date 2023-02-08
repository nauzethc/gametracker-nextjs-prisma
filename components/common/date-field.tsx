import { useState, useEffect } from 'react'

type DateFieldProps = {
  className?: string,
  locale?: string,
  format?: 'short'|'medium'|'long'|'full'
  value?: string | Date | null,
  defaultValue?: string
}

export default function DateField ({
  className = '',
  locale,
  format = 'short',
  value,
  defaultValue = ''
}: DateFieldProps) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    if (value) {
      setFormattedDate(
        new Intl.DateTimeFormat(locale, { dateStyle: format })
          .format(new Date(value))
      )
    } else {
      setFormattedDate(defaultValue)
    }
  }, [locale, format, value, defaultValue])

  return <span className={className}>{formattedDate}</span>
}
