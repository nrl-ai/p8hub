"use client"
import useSWR from "swr"
import * as React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/default/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


export function AppSelector({ onSelect }: { onSelect: (value: any) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const fetcher = (url: string) =>
    fetch(url).then(r => {
      return r.json();
    });
  const { data: applications } = useSWR(
    "/api/apps",
    fetcher,
    {
      onSuccess: (data, key, config) => {
        console.log(data)
        setValue(data[0].id)
        onSelect(data[0])
      }
    }
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? applications.find((app: any) => app.id === value)?.name
            : "Select application..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search application..." />
          <CommandEmpty>No application found.</CommandEmpty>
          <CommandGroup>
            {applications.map((app: any) => (
              <CommandItem
                key={app.id}
                value={app.id}
                onSelect={(currentValue: any) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  onSelect(app)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === app.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {app.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
