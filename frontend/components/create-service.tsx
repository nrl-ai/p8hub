"use client"
import { useRef } from "react"
import { Button } from "@/registry/default/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { AppSelector } from "@/components/app-selector"

export function CreateService() {
  const nameField = useRef<HTMLInputElement>(null)
  const descriptionField = useRef<HTMLInputElement>(null)

  const onAppSelect = (app: any) => {
    nameField.current?.focus()
    if (!nameField.current || !descriptionField.current) return
    nameField.current.value = app.name
    descriptionField.current.value = app.description
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Create Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Deploy a new service</DialogTitle>
          <DialogDescription>
            Deploy a new service from an app template.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="application">Application</Label>
            <AppSelector onSelect={onAppSelect} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input autoFocus ref={nameField} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input ref={descriptionField} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Deploy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
