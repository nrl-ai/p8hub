import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { Skeleton } from "@/registry/default/ui/skeleton"

export function AppTemplate() {
  return (
    <Card className="border border-gray-600 rounded-md shadow-sm">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <Skeleton className="w-[150px] h-[32px] rounded-md" />
          <Skeleton className="w-[200px] h-[32px] rounded-md" />
        </div>
        <Skeleton />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
