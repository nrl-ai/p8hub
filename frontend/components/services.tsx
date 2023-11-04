"use client"

import useSWR from "swr"

import { ServiceCard } from "./service-card"
import { AppTemplate as AppTemplateSkeleton } from "./skeletons/app-template"

export function Services() {
  const { data: services } = useSWR(
    "/api/services",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 3000 }
  )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {services &&
          services.map(
            (
              service: {
                id: number
                name: string
                description: string
                status: string
                service_port: number
                created_at: string
              },
              index: number
            ) => <ServiceCard key={index} service={service} />
          )}
        {services === undefined && (
          <>
            <AppTemplateSkeleton />
            <AppTemplateSkeleton />
          </>
        )}
      </div>
      {services && services.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 space-y-4 text-center bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-md">
          <h2 className="text-2xl font-bold tracking-tight">
            No Services Running
          </h2>
          <p className="text-lg text-muted-foreground">
            Deploy a new service to get started.
          </p>
        </div>
      )}
    </>
  )
}
