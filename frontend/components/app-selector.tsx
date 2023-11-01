"use client"

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
import useSWR from "swr"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AppSelector({
  onSelect,
  appId,
}: {
  onSelect: (value: any) => void
  appId?: string
}) {
  const [open, setOpen] = React.useState(false)

  const fetcher = (url: string) =>
    fetch(url).then((r) => {
      return r.json()
    })
  const { data: applications } = useSWR("/api/apps", fetcher)

  const filteredApplications = applications?.filter(
    (app: any) => app?.deployable === true || app?.deployable === undefined
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
          {appId
            ? filteredApplications.find((app: any) => app.id === appId)?.name
            : "Select application..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search application..." />
          <CommandEmpty>No application found.</CommandEmpty>
          <CommandGroup>
            {filteredApplications.map((app: any) => (
              <CommandItem
                key={app.id}
                value={app.id}
                onSelect={(currentValue: any) => {
                  setOpen(false)
                  onSelect(app)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    appId === app.id ? "opacity-100" : "opacity-0"
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
