import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import Logo from "@/public/logo.svg"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-0">
        <Image alt="P8Hub Logo" src={Logo} className="h-9 w-9 mr-1" />
        <span className="inline-block font-bold text-xl">8Hub</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  target="_blank"
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
