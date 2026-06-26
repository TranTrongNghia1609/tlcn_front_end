import React, { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboBox({
  options,
  placeholder = "Select...",
  defaultValue,
  value: controlledValue,
  onChange,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(controlledValue ?? defaultValue ?? "")

  // Sync internal state when controlled value changes from parent
  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== value) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn("h-7 bg-transparent flex justify-between items-center gap-2", className)}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.logo && (
              <img src={selectedOption.logo} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
            )}
            <span className="text-sm truncate">{selectedOption?.label || placeholder}</span>
          </div>
          <ChevronsUpDown className="opacity-50 h-4 w-4 ml-1 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    setOpen(false)
                    onChange?.(currentValue)
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {option.logo && (
                    <img src={option.logo} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                  )}
                  <span>{option.label}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 flex-shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
