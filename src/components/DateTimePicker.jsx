import { useState } from 'react'

function DateTimePicker({ label, value, onChange, minDate }) {
  const formatDateTimeLocal = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleChange = (e) => {
    const dateValue = e.target.value
    if (dateValue) {
      onChange(new Date(dateValue).toISOString())
    } else {
      onChange('')
    }
  }

  return (
    <div className="date-time-picker">
      <label>{label}</label>
      <input
        type="datetime-local"
        value={formatDateTimeLocal(value)}
        onChange={handleChange}
        min={minDate ? formatDateTimeLocal(minDate) : undefined}
        required
      />
    </div>
  )
}

export default DateTimePicker
