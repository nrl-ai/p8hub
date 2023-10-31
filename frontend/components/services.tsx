"use client"

import useSWR from "swr"

import { ServiceCard } from "./service-card"
import { AppTemplate as AppTemplateSkeleton } from "./skeletons/app-template"

export function Services() {
  const { data: appTemplates } = useSWR(
    "/api/services",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {appTemplates &&
        appTemplates.map((app: { name: string; description: string }) => (
          <ServiceCard
            key={app.name}
            name={app.name}
            description={app.description}
            status="running"
          />
        ))}
      {appTemplates === undefined && (
        <>
          <AppTemplateSkeleton />
          <AppTemplateSkeleton />
        </>
      )}
      {appTemplates && appTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 space-y-4 text-center bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-md">
          <h2 className="text-2xl font-bold tracking-tight">
            No Services Running
          </h2>
          <p className="text-lg text-muted-foreground">
            Deploy a new service to get started.
          </p>
        </div>
      )}
    </div>
  )
}
