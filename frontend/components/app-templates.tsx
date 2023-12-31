"use client"

import useSWR from "swr"

import { AppTemplate } from "./app-template"
import { AppTemplate as AppTemplateSkeleton } from "./skeletons/app-template"

const COLORS = [
  "#f55742",
  "#b6f542",
  "#42e3f5",
  "#f54242",
  "#b9f542",
  "#42a1f5",
  "#0800e3",
  "#f54242",
  "#42f5b3",
  "#f5a442",
]

export function AppTemplates() {
  const { data: appTemplates } = useSWR(
    "/api/apps",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 10000 }
  )
  // Sort by weight
  const sortedAppTemplates = appTemplates?.sort(
    (a: { weight: number }, b: { weight: number }) => a.weight - b.weight
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {appTemplates &&
        sortedAppTemplates.map(
          (
            app: {
              id: string
              name: string
              description: string
              deployable: boolean
              default_service_port: number
            },
            index: number
          ) => (
            <AppTemplate
              id={app.id}
              key={app.name}
              name={app.name}
              description={app.description}
              deployable={app.deployable}
              default_service_port={app.default_service_port}
              color={COLORS[index % COLORS.length]}
            />
          )
        )}
      {appTemplates === undefined && (
        <>
          <AppTemplateSkeleton />
          <AppTemplateSkeleton />
          <AppTemplateSkeleton />
          <AppTemplateSkeleton />
        </>
      )}
    </div>
  )
}
