import { useState } from 'react'
import { Popover } from '@headlessui/react'
import { FiCalendar, FiChevronDown } from 'react-icons/fi'
import { format, subDays } from 'date-fns'

const ranges = [
  { name: 'Today', value: 0 },
  { name: 'Yesterday', value: 1 },
  { name: 'Last 7 Days', value: 7 },
  { name: 'Last 30 Days', value: 30 },
  { name: 'Last 90 Days', value: 90 }
]

export default function DateRangePicker({ onChange }: { onChange: (days: number) => void }) {
  const [selectedRange, setSelectedRange] = useState(ranges[2])

  const handleSelect = (range: typeof ranges[0]) => {
    setSelectedRange(range)
    onChange(range.value)
  }

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
        <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
        {selectedRange.name}
        <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-1 bg-white shadow-lg rounded-md p-2 w-48">
        <div className="space-y-1">
          {ranges.map((range) => (
            <button
              key={range.name}
              onClick={() => handleSelect(range)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                selectedRange.value === range.value
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  )
}
