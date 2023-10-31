import { Button } from "@/registry/default/ui/button"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { AppTemplate } from "@/components/app-template"
import { ServiceCard } from "@/components/service-card"
import { SystemMonitor } from "@/components/system-monitor"

const appTemplates = [
  {
    name: "Ollama LLM",
    description: "Chat with local llamas",
  },
  {
    name: "PrivateGPT",
    description: "Ask your documents questions",
  },
  {
    name: "Stable Duffusion WebUI",
    description: "Generate images from text",
  },
  {
    name: "LocalPilot",
    description: "Code with AI assistance",
  },
]

const runningServices = [
  {
    name: "Ollama LLM",
    description: "Chat with local llamas",
    status: "running",
  },
  {
    name: "PrivateGPT",
    description: "Ask your documents questions",
    status: "running",
  },
  {
    name: "Stable Duffusion WebUI",
    description: "Generate images from text",
    status: "running",
  },
  {
    name: "LocalPilot",
    description: "Code with AI assistance",
    status: "running",
  },
]

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Private AI Hub
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Host and use your own Generative AI Services. Keep everything private.
        </p>
      </div>
      <div className="w-full">
        <SystemMonitor />
      </div>
      <div className="flex items-center justify-between space-y-2 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">Running Services</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Create Service
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {runningServices.map((service) => (
          <ServiceCard
            key={service.name}
            name={service.name}
            description={service.description}
            status={service.status}
          />
        ))}
      </div>
      <div className="flex items-center justify-between space-y-2 mt-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Deploy New Services
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {appTemplates.map((service) => (
          <AppTemplate
            key={service.name}
            name={service.name}
            description={service.description}
          />
        ))}
      </div>
    </section>
  )
}
