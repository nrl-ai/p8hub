import { Button } from "@/registry/default/ui/button"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { AppTemplates } from "@/components/app-templates"
import { CreateService } from "@/components/create-service"
import { Services } from "@/components/services"
import { SystemMonitor } from "@/components/system-monitor"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Private AI Hub
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
        Host and use your own AI Services. Keep everything simple and private.
        </p>
      </div>
      <div className="w-full">
        <SystemMonitor />
      </div>
      <div className="flex items-center justify-between space-y-2 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">Running Services</h2>
        <div className="flex items-center space-x-2">
          <CreateService>
            <Button>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Create Service
            </Button>
          </CreateService>
        </div>
      </div>
      <Services />
      <div className="flex items-center justify-between space-y-2 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Deploy New Services
        </h2>
      </div>
      <AppTemplates />
    </section>
  )
}
