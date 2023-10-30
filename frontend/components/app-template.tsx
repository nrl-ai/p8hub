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
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu"
import { Separator } from "@/registry/default/ui/separator"
import { cn } from "@/lib/utils"

export function AppTemplate({
  name,
  description,
}: {
  name: string
  description: string
}) {
  return (
    <Card className="border border-gray-600 rounded-md shadow-sm">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        <Button variant="default">
          Deploy
        </Button>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  )
}
