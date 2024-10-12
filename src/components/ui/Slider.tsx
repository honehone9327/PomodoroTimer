// src/components/ui/Slider.tsx

import React from 'react'

interface SliderProps {
  id: string
  min: number
  max: number
  step?: number
  value: number[]
  onValueChange: (value: number[]) => void
  className?: string
}

const Slider: React.FC<SliderProps> = ({
  id,
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value)])
  }

  return (
    <input
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={`w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  )
}

export { Slider }
