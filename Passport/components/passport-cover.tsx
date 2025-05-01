"use client"
import { Button } from "@/components/ui/button"

type PassportCoverProps = {
  advisorType: "rookie" | "experienced"
  onSwitchType: (type: "rookie" | "experienced") => void
  passportId: string
}

export function PassportCover({ advisorType, onSwitchType, passportId }: PassportCoverProps) {
  return (
    <div className="w-full h-full bg-amber-800 flex flex-col items-center justify-center p-8 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant={advisorType === "rookie" ? "default" : "outline"}
          size="sm"
          onClick={() => onSwitchType("rookie")}
          className={
            advisorType === "rookie"
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-transparent text-white hover:bg-amber-700/20"
          }
        >
          Rookie
        </Button>
        <Button
          variant={advisorType === "experienced" ? "default" : "outline"}
          size="sm"
          onClick={() => onSwitchType("experienced")}
          className={
            advisorType === "experienced"
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-transparent text-white hover:bg-amber-700/20"
          }
        >
          Experienced
        </Button>
      </div>

      <div className="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center mb-6">
        <div className="w-28 h-28 bg-amber-500 rounded-full flex items-center justify-center">
          {/* Placeholder for Sun Life logo */}
          <div className="text-white font-bold text-xl">SUN LIFE</div>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-white text-3xl font-bold mb-2">PASSPORT</h1>
        <h2 className="text-amber-200 text-xl font-semibold mb-6">SUN LIFE TRAINING JOURNEY</h2>
        <div className="border-t border-b border-amber-600 py-4 px-8 mb-6">
          <h3 className="text-white text-lg font-medium">
            {advisorType === "rookie" ? "ADVISOR A (ROOKIE)" : "ADVISOR B (1.5-2 YEARS)"}
          </h3>
        </div>
        <p className="text-amber-200 text-sm">
          This passport belongs to a Sun Life Advisor on their journey to excellence
        </p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
        <div className="border-t border-amber-600 w-32 mb-2"></div>
        <div className="text-amber-200 text-xs font-mono">PASSPORT ID: {passportId}</div>
      </div>
    </div>
  )
}
