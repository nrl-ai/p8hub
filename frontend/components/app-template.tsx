import { Button } from "@/registry/default/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/default/ui/card"
import { useToast } from "@/registry/default/ui/use-toast"

export function AppTemplate({
  name,
  description,
}: {
  name: string
  description: string
}) {
  const { toast } = useToast()

  const deployService = async () => {
    await fetch("/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: "ollama",
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
    <Card className="border border-gray-600 rounded-md shadow-sm">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="default" onClick={deployService}>
          Deploy
        </Button>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
