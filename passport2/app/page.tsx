import { Passport } from "@/components/passport"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Sun Life Training Journey Passport</h1>
        <Passport />
      </div>
    </main>
  )
}
