import { useState } from "react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/registry/default/ui/alert-dialog"
import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import { Separator } from "@/registry/default/ui/separator"
import { useToast } from "@/registry/default/ui/use-toast"
import { ChevronDownIcon, CircleIcon } from "@radix-ui/react-icons"
import moment from "moment"

import { cn } from "@/lib/utils"

export function ServiceCard({
  service: { id, name, description, status, service_port, created_at },
}: {
  service: {
    id: number
    name: string
    description: string
    status: string
    service_port: number
    created_at: string
  }
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const deleteService = async (id: number) => {
    await fetch(`/api/services/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw res
        }
        toast({
          variant: "default",
          title: "Service deleted",
          description: "Your service has been deleted",
        })
        window.location.reload()
      })
      .catch(async (err) => {
        const response = await err.json()
        const errorDetail = response.detail
        toast({
          variant: "destructive",
          title: "Error deleting service: " + errorDetail,
          description: err.detail,
        })
      })
  }

  let upTime = moment(created_at).fromNow(true)

  return (
    <div className="relative">
      <Card className="border border-gray-600 rounded-md shadow-sm h-[180px]">
        <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>
              <Link
                href={`/services?serviceId=${id}`}
                className="hover:underline"
              >
                {name}
              </Link>
            </CardTitle>
            <CardDescription className="h-[60px] overflow-auto">
              {description.length < 80 ? description : description.slice(0, 80) + "..."}
              {service_port && (
                <div>
                  Address:{" "}
                  <a
                    href={`http://localhost:${service_port}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    http://localhost:{service_port}
                  </a>
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Button
              variant="secondary"
              className={cn(
                "px-4 shadow-none",
                "hover:bg-secondary-hover",
                status !== "online" && "text-gray-300 cursor-not-allowed"
              )}
              onClick={() => {
                if (status === "online")
                  window.open(`http://localhost:${service_port}`)
              }}
            >
              Open
            </Button>
            <Separator orientation="vertical" className="h-[20px]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="px-2 shadow-none">
                  <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[200px]"
                forceMount
              >
                <Link href={`/services?serviceId=${id}`}>
                  <DropdownMenuCheckboxItem>View logs</DropdownMenuCheckboxItem>
                </Link>
                <DropdownMenuCheckboxItem
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  Delete
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CircleIcon
                className={cn(
                  "mr-1 h-4 w-4",
                  status === "online"
                    ? "fill-green-500 text-green-400"
                    : "fill-orange-500 text-orange-400"
                )}
              />
              {status.toUpperCase().replaceAll("_", " ")}
            </div>
            <div>Created: {upTime}</div>
            <div>
              Service Port: {service_port ? service_port : "not available"}
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service: <b>{name}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(false)
                deleteService(id)
              }}
            >
              Yes. Delete It!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
