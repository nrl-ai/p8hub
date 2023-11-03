"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CircleIcon } from "@radix-ui/react-icons"
import moment from "moment"
import useSWR from "swr"

import { cn } from "@/lib/utils"

export default function ServicePage() {
  const params = useSearchParams()
  const serviceId = params.get("serviceId")
  const { data: service, error } = useSWR(
    `/api/services/${serviceId}`,
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  )
  const { data: logs } = useSWR(
    `/api/services/${serviceId}/container_logs`,
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  )

  // TODO: handle error
  if (service && service?.detail) {
    window.location.href = "/"
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Link href={`/`} className="text-xl mb-2">
          ◄ Back to Services
        </Link>

        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {service?.name}
        </h1>
        {service && (
          <div className="flex items-center">
            <span className="font-bold mr-2">Status:</span>
            <CircleIcon
              className={cn(
                "mr-1 h-4 w-4",
                service?.status === "online"
                  ? "fill-green-500 text-green-400"
                  : "fill-orange-500 text-orange-400"
              )}
            />
            {service?.status?.toUpperCase()?.replaceAll("_", " ")}
          </div>
        )}
        <div>
          <span className="font-bold mr-2">Description:</span>
          {service?.description}
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-2">Created:</span>
          {moment(service?.created_at).format("LLL")}
        </div>
        <div
          className="bg-gray-900 text-white p-2 rounded-md h-[500px] overflow-y-auto w-full"
          dangerouslySetInnerHTML={{ __html: logs }}
          defaultValue={"Loading..."}
        ></div>
      </div>
    </section>
  )
}
