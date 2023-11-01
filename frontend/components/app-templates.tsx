"use client"

import useSWR from "swr"

import { AppTemplate } from "./app-template"
import { AppTemplate as AppTemplateSkeleton } from "./skeletons/app-template"

export function AppTemplates() {
  const { data: appTemplates } = useSWR(
    "/api/apps",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 10000 }
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {appTemplates &&
        appTemplates.map(
          (app: {
            id: string
            name: string
            description: string
            deployable: boolean
          }) => (
            <AppTemplate
              id={app.id}
              key={app.name}
              name={app.name}
              description={app.description}
              deployable={app.deployable}
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
