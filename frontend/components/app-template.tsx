import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"

import { CreateService } from "@/components/create-service"

export function AppTemplate({
  id,
  name,
  description,
  deployable,
  default_service_port,
  color,
}: {
  id: string
  name: string
  description: string
  deployable: boolean
  color: string
  default_service_port: number
}) {
  return (
    <Card className="border border-gray-600 rounded-md shadow-sm overflow-hidden">
      <CardHeader
        className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 border-l-8 h-full"
        style={{
          borderColor: color,
        }}
      >
        <div className="space-y-1">
          <CardTitle className={!deployable ? "text-gray-500" : ""}>
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {deployable && (
          <CreateService
            defaultApp={{
              id: id,
              name: name,
              description: description,
              default_port: default_service_port
            }}
          >
            <Button variant="default">Deploy</Button>
          </CreateService>
        )}
        {!deployable && (
          <Button
            variant="secondary"
            className="text-gray-400 cursor-not-allowed"
          >
            Deploy
          </Button>
        )}
      </CardHeader>
    </Card>
  )
}
