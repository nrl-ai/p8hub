import {
  ChevronDownIcon,
  CircleIcon,
} from "@radix-ui/react-icons"

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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import { Separator } from "@/registry/default/ui/separator"
import { cn } from "@/lib/utils"

export function ServiceCard({
  name,
  description,
  status,
}: {
  name: string
  description: string
  status: string
}) {
  return (
    <Card className="border border-gray-500 rounded-md shadow-sm bg-gray-200 dark:bg-slate-600">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {description} - {status}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3 shadow-none">
            Action
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
              <DropdownMenuCheckboxItem>Logs</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Restart</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Delete</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className={cn("mr-1 h-4 w-4", "fill-green-500 text-green-400")} />
            {status}
          </div>
          <div>Created April 2023</div>
        </div>
      </CardContent>
    </Card>
  )
}
