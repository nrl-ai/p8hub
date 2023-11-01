"use client"

import { useRef, useState } from "react"
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
import { useToast } from "@/registry/default/ui/use-toast"

import { AppSelector } from "@/components/app-selector"

export function CreateService({
  children,
  defaultApp,
}: {
  children: React.ReactNode
  defaultApp?: {
    id: string
    name: string
    description: string
  }
}) {
  const { toast } = useToast()
  const nameField = useRef<HTMLInputElement>(null)
  const descriptionField = useRef<HTMLInputElement>(null)
  const [app, setApp] = useState<any>(defaultApp)

  const onAppSelect = (app: any) => {
    nameField.current?.focus()
    if (!nameField.current || !descriptionField.current) return
    nameField.current.value = app.name
    descriptionField.current.value = app.description
    setApp(app)
  }

  const deployService = async (
    id: string,
    name: string,
    description: string
  ) => {
    await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: id,
        name: name,
        description: description,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res
        }
        toast({
          variant: "default",
          title: "Service deployed",
          description: "Your service has been deployed",
        })
        window.location.reload()
      })
      .catch(async (err) => {
        const response = await err.json()
        const errorDetail = response.detail
        toast({
          variant: "destructive",
          title: "Error deploying service: " + errorDetail,
          description: err.detail,
        })
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            <AppSelector onSelect={onAppSelect} appId={app?.id || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input autoFocus ref={nameField} defaultValue={app?.name || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              ref={descriptionField}
              defaultValue={app?.description || ""}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!app) {
                toast({
                  variant: "destructive",
                  title: "Error deploying service",
                  description: "Please select an app to deploy",
                })
                return
              }
              deployService(
                app.id,
                nameField.current?.value || app.name,
                descriptionField.current?.value || app.description
              )
            }}
          >
            Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
