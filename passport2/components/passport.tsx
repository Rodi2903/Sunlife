"use client"

import React from "react"

import { useState, useEffect } from "react"
import { PassportCover } from "@/components/passport-cover"
import { PassportPage } from "@/components/passport-page"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save, Download, Upload, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type AdvisorType = "rookie" | "experienced"
type Milestone = {
  id: string
  title: string
  description: string
  isCompleted: boolean
  dateCompleted?: string
  stampImage: string
}

type PassportData = {
  advisorType: AdvisorType
  advisorName: string
  milestones: Milestone[]
  lastUpdated: string
}

export function Passport() {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(0)
  const [advisorType, setAdvisorType] = useState<AdvisorType>("rookie")
  const [advisorName, setAdvisorName] = useState("Your Name")
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [passportId, setPassportId] = useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Initialize milestones based on advisor type or URL parameters
  useEffect(() => {
    // Check if there's data in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get("data")

    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData))
        setAdvisorType(decodedData.advisorType)
        setAdvisorName(decodedData.advisorName)
        setMilestones(decodedData.milestones)
        setPassportId(decodedData.passportId || generatePassportId())
        return
      } catch (error) {
        console.error("Failed to parse URL data:", error)
      }
    }

    // If no URL data, try localStorage
    const savedData = localStorage.getItem("passportData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setAdvisorType(parsedData.advisorType)
        setAdvisorName(parsedData.advisorName)
        setMilestones(parsedData.milestones)
        setPassportId(parsedData.passportId || generatePassportId())
      } catch (error) {
        console.error("Failed to parse localStorage data:", error)
        initializeNewPassport()
      }
    } else {
      initializeNewPassport()
    }
  }, [])

  const generatePassportId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const initializeNewPassport = () => {
    const newPassportId = generatePassportId()
    setPassportId(newPassportId)

    const rookieMilestones: Milestone[] = [
      {
        id: "powerboost",
        title: "POWERBOOST",
        description: "Complete the PowerBoost training program",
        isCompleted: false,
        stampImage: "/stamps/powerboost.svg",
      },
      {
        id: "start",
        title: "START",
        description: "Complete the START training program",
        isCompleted: false,
        stampImage: "/stamps/start.svg",
      },
      {
        id: "4pillars",
        title: "4PILLARS",
        description: "Master the 4 Pillars methodology",
        isCompleted: false,
        stampImage: "/stamps/4pillars.svg",
      },
      {
        id: "jfw",
        title: "JFW",
        description: "Complete Joint Field Work training",
        isCompleted: false,
        stampImage: "/stamps/jfw.svg",
      },
      {
        id: "validation90k",
        title: "90K VALIDATION",
        description: "Achieve 90K validation milestone",
        isCompleted: false,
        stampImage: "/stamps/validation.svg",
      },
      {
        id: "products",
        title: "PRODUCTS MASTERCLASS",
        description: "Complete Products Masterclass training",
        isCompleted: false,
        stampImage: "/stamps/products.svg",
      },
    ]

    const experiencedMilestones: Milestone[] = [
      {
        id: "vuladvance",
        title: "VUL ADVANCE",
        description: "Complete VUL Advance training",
        isCompleted: false,
        stampImage: "/stamps/vul.svg",
      },
      {
        id: "powerboostapex",
        title: "POWERBOOST/APEX",
        description: "Complete PowerBoost or APEX training",
        isCompleted: false,
        stampImage: "/stamps/powerboost.svg",
      },
      {
        id: "uwessentials",
        title: "UW ESSENTIALS",
        description: "Complete Underwriting Essentials training",
        isCompleted: false,
        stampImage: "/stamps/uw.svg",
      },
      {
        id: "sunnylevelup",
        title: "SUNNY LEVEL UP",
        description: "Complete Sunny Level Up program",
        isCompleted: false,
        stampImage: "/stamps/sunny.svg",
      },
      {
        id: "medallion",
        title: "1ST MEDALLION",
        description: "Achieve 1st Medallion recognition",
        isCompleted: false,
        stampImage: "/stamps/medallion.svg",
      },
      {
        id: "validation180k",
        title: "180K VALIDATION",
        description: "Achieve 180K validation milestone",
        isCompleted: false,
        stampImage: "/stamps/validation.svg",
      },
    ]

    setMilestones(advisorType === "rookie" ? rookieMilestones : experiencedMilestones)
  }

  // Save data to localStorage
  const saveData = () => {
    const dataToSave: PassportData = {
      advisorType,
      advisorName,
      milestones,
      passportId,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem("passportData", JSON.stringify(dataToSave))
    toast({
      title: "Progress saved",
      description: "Your passport data has been saved to your browser.",
    })
  }

  // Export passport data as a file
  const exportPassport = () => {
    const dataToExport: PassportData = {
      advisorType,
      advisorName,
      milestones,
      passportId,
      lastUpdated: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `sunlife-passport-${advisorName.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Passport exported",
      description: "Your passport has been downloaded as a file.",
    })
  }

  // Import passport data from a file
  const importPassport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string) as PassportData
        setAdvisorType(importedData.advisorType)
        setAdvisorName(importedData.advisorName)
        setMilestones(importedData.milestones)
        setPassportId(importedData.passportId || generatePassportId())

        // Save to localStorage
        localStorage.setItem("passportData", JSON.stringify(importedData))

        toast({
          title: "Passport imported",
          description: "Your passport has been successfully imported.",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file could not be imported. Please try again.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Generate a shareable URL
  const generateShareableUrl = () => {
    const dataToShare = {
      advisorType,
      advisorName,
      milestones,
      passportId,
    }

    const encodedData = btoa(JSON.stringify(dataToShare))
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`

    // Copy to clipboard
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "URL copied to clipboard",
          description: "Share this link to show your passport to others.",
        })
      })
      .catch(() => {
        toast({
          title: "Failed to copy URL",
          description: "Please try again or copy the URL manually.",
          variant: "destructive",
        })
      })

    return url
  }

  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === id
          ? {
              ...milestone,
              isCompleted: !milestone.isCompleted,
              dateCompleted: !milestone.isCompleted ? new Date().toLocaleDateString() : undefined,
            }
          : milestone,
      ),
    )
  }

  const switchAdvisorType = (type: AdvisorType) => {
    if (confirm("Changing advisor type will reset your progress. Continue?")) {
      setAdvisorType(type)
      setCurrentPage(0)

      // Reset milestones based on new type
      const rookieMilestones: Milestone[] = [
        {
          id: "powerboost",
          title: "POWERBOOST",
          description: "Complete the PowerBoost training program",
          isCompleted: false,
          stampImage: "/stamps/powerboost.svg",
        },
        {
          id: "start",
          title: "START",
          description: "Complete the START training program",
          isCompleted: false,
          stampImage: "/stamps/start.svg",
        },
        {
          id: "4pillars",
          title: "4PILLARS",
          description: "Master the 4 Pillars methodology",
          isCompleted: false,
          stampImage: "/stamps/4pillars.svg",
        },
        {
          id: "jfw",
          title: "JFW",
          description: "Complete Joint Field Work training",
          isCompleted: false,
          stampImage: "/stamps/jfw.svg",
        },
        {
          id: "validation90k",
          title: "90K VALIDATION",
          description: "Achieve 90K validation milestone",
          isCompleted: false,
          stampImage: "/stamps/validation.svg",
        },
        {
          id: "products",
          title: "PRODUCTS MASTERCLASS",
          description: "Complete Products Masterclass training",
          isCompleted: false,
          stampImage: "/stamps/products.svg",
        },
      ]

      const experiencedMilestones: Milestone[] = [
        {
          id: "vuladvance",
          title: "VUL ADVANCE",
          description: "Complete VUL Advance training",
          isCompleted: false,
          stampImage: "/stamps/vul.svg",
        },
        {
          id: "powerboostapex",
          title: "POWERBOOST/APEX",
          description: "Complete PowerBoost or APEX training",
          isCompleted: false,
          stampImage: "/stamps/powerboost.svg",
        },
        {
          id: "uwessentials",
          title: "UW ESSENTIALS",
          description: "Complete Underwriting Essentials training",
          isCompleted: false,
          stampImage: "/stamps/uw.svg",
        },
        {
          id: "sunnylevelup",
          title: "SUNNY LEVEL UP",
          description: "Complete Sunny Level Up program",
          isCompleted: false,
          stampImage: "/stamps/sunny.svg",
        },
        {
          id: "medallion",
          title: "1ST MEDALLION",
          description: "Achieve 1st Medallion recognition",
          isCompleted: false,
          stampImage: "/stamps/medallion.svg",
        },
        {
          id: "validation180k",
          title: "180K VALIDATION",
          description: "Achieve 180K validation milestone",
          isCompleted: false,
          stampImage: "/stamps/validation.svg",
        },
      ]

      setMilestones(type === "rookie" ? rookieMilestones : experiencedMilestones)
    }
  }

  const totalPages = 4 // Cover, personal info, and milestone pages

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdvisorName(e.target.value)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Passport pages */}
        {currentPage === 0 && (
          <PassportCover advisorType={advisorType} onSwitchType={switchAdvisorType} passportId={passportId} />
        )}

        {currentPage === 1 && (
          <PassportPage title="PERSONAL INFORMATION">
            <div className="p-6 space-y-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="advisorName" className="text-sm font-medium text-gray-700">
                  Advisor Name
                </label>
                <input
                  id="advisorName"
                  type="text"
                  value={advisorName}
                  onChange={handleNameChange}
                  className="border border-gray-300 rounded-md p-2"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Advisor Level</label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rookie"
                      name="advisorType"
                      checked={advisorType === "rookie"}
                      onChange={() => switchAdvisorType("rookie")}
                      className="mr-2"
                    />
                    <label htmlFor="rookie">Rookie (0-1.5 years)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="experienced"
                      name="advisorType"
                      checked={advisorType === "experienced"}
                      onChange={() => switchAdvisorType("experienced")}
                      className="mr-2"
                    />
                    <label htmlFor="experienced">Experienced (1.5-2 years)</label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-2">Passport Information</h3>
                <p className="text-sm text-gray-600">
                  This digital passport tracks your progress through the Sun Life Training Journey. Click on milestones
                  to stamp them as completed.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Passport ID: <span className="font-mono">{passportId}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={exportPassport} className="flex items-center">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" onClick={() => fileInputRef.current?.click()} className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={importPassport} accept=".json" className="hidden" />
                  <Button size="sm" onClick={generateShareableUrl} className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </PassportPage>
        )}

        {currentPage === 2 && (
          <PassportPage title={`MILESTONES (${advisorType === "rookie" ? "ROOKIE" : "EXPERIENCED"})`}>
            <div className="grid grid-cols-2 gap-4 p-6">
              {milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone.id}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer relative"
                  onClick={() => toggleMilestone(milestone.id)}
                >
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>

                  {milestone.isCompleted && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-80">
                      <div className="w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-100">
                        <div className="text-red-600 font-bold text-center">
                          <div className="text-xs">COMPLETED</div>
                          <div className="text-xs">{milestone.dateCompleted}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PassportPage>
        )}

        {currentPage === 3 && (
          <PassportPage title={`MILESTONES (${advisorType === "rookie" ? "ROOKIE" : "EXPERIENCED"})`}>
            <div className="grid grid-cols-2 gap-4 p-6">
              {milestones.slice(3, 6).map((milestone) => (
                <div
                  key={milestone.id}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer relative"
                  onClick={() => toggleMilestone(milestone.id)}
                >
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>

                  {milestone.isCompleted && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-80">
                      <div className="w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-100">
                        <div className="text-red-600 font-bold text-center">
                          <div className="text-xs">COMPLETED</div>
                          <div className="text-xs">{milestone.dateCompleted}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PassportPage>
        )}

        {/* Navigation buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          <Button variant="outline" size="sm" onClick={saveData} className="flex items-center">
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Progress: {milestones.filter((m) => m.isCompleted).length} of {milestones.length} milestones completed
        </p>
        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mt-2 mx-auto">
          <div
            className="h-full bg-amber-600 rounded-full"
            style={{ width: `${(milestones.filter((m) => m.isCompleted).length / milestones.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
