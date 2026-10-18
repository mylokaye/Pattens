import * as React from "react"

import { cn } from "@/lib/utils"

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn("inline-flex h-5 items-center rounded-[6px] bg-emerald-100 px-2 text-[13px] leading-4 font-medium text-emerald-800", className)}
      {...props}
    />
  )
}

export { Badge }
