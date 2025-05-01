import type { ReactNode } from "react"

type PassportPageProps = {
  title: string
  children: ReactNode
}

export function PassportPage({ title, children }: PassportPageProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="bg-amber-700 text-white p-4 text-center font-bold">{title}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
