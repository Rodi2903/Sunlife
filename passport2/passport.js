// Passport data structure
const ROOKIE_MILESTONES = [
  {
    id: "powerboost",
    title: "POWERBOOST",
    description: "Complete the PowerBoost training program",
    isCompleted: false,
  },
  {
    id: "start",
    title: "START",
    description: "Complete the START training program",
    isCompleted: false,
  },
  {
    id: "4pillars",
    title: "4PILLARS",
    description: "Master the 4 Pillars methodology",
    isCompleted: false,
  },
  {
    id: "jfw",
    title: "JFW",
    description: "Complete Joint Field Work training",
    isCompleted: false,
  },
  {
    id: "validation90k",
    title: "90K VALIDATION",
    description: "Achieve 90K validation milestone",
    isCompleted: false,
  },
  {
    id: "products",
    title: "PRODUCTS MASTERCLASS",
    description: "Complete Products Masterclass training",
    isCompleted: false,
  },
]

const EXPERIENCED_MILESTONES = [
  {
    id: "vuladvance",
    title: "VUL ADVANCE",
    description: "Complete VUL Advance training",
    isCompleted: false,
  },
  {
    id: "powerboostapex",
    title: "POWERBOOST/APEX",
    description: "Complete PowerBoost or APEX training",
    isCompleted: false,
  },
  {
    id: "uwessentials",
    title: "UW ESSENTIALS",
    description: "Complete Underwriting Essentials training",
    isCompleted: false,
  },
  {
    id: "sunnylevelup",
    title: "SUNNY LEVEL UP",
    description: "Complete Sunny Level Up program",
    isCompleted: false,
  },
  {
    id: "medallion",
    title: "1ST MEDALLION",
    description: "Achieve 1st Medallion recognition",
    isCompleted: false,
  },
  {
    id: "validation180k",
    title: "180K VALIDATION",
    description: "Achieve 180K validation milestone",
    isCompleted: false,
  },
]

// State management
let state = {
  currentPage: 0,
  advisorType: "rookie",
  advisorName: "Your Name",
  milestones: [...ROOKIE_MILESTONES],
  passportId: generatePassportId(),
  lastUpdated: new Date().toISOString(),
}

// DOM elements
const passportElement = document.getElementById("passport")
const progressText = document.getElementById("progress-text")
const progressBar = document.getElementById("progress-bar")

// Initialize the application
function init() {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search)
  const encodedData = urlParams.get("data")

  if (encodedData) {
    try {
      const decodedData = JSON.parse(atob(encodedData))
      state = {
        ...state,
        ...decodedData,
        currentPage: 0,
      }
      renderPassport()
      updateProgress()
    } catch (error) {
      console.error("Failed to parse URL data:", error)
      loadFromLocalStorage()
    }
  } else {
    loadFromLocalStorage()
  }
}

// Load data from localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("passportData")
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData)
      state = {
        ...state,
        ...parsedData,
        currentPage: 0,
      }
    } catch (error) {
      console.error("Failed to parse localStorage data:", error)
    }
  }

  renderPassport()
  updateProgress()
}

// Generate a unique passport ID
function generatePassportId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Save data to localStorage
function saveData() {
  state.lastUpdated = new Date().toISOString()
  localStorage.setItem("passportData", JSON.stringify(state))
  showToast("Progress saved", "Your passport data has been saved to your browser.")
}

// Export passport data as a file
function exportPassport() {
  const dataStr = JSON.stringify(state, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement("a")
  link.href = url
  link.download = `sunlife-passport-${state.advisorName.replace(/\s+/g, "-").toLowerCase()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast("Passport exported", "Your passport has been downloaded as a file.")
}

// Import passport data from a file
function importPassport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)
      state = {
        ...state,
        ...importedData,
        currentPage: 0,
      }

      // Save to localStorage
      localStorage.setItem("passportData", JSON.stringify(state))

      renderPassport()
      updateProgress()

      showToast("Passport imported", "Your passport has been successfully imported.")
    } catch (error) {
      showToast("Import failed", "The file could not be imported. Please try again.", true)
    }
  }
  reader.readAsText(file)

  // Reset the file input
  event.target.value = ""
}

// Generate a shareable URL
function generateShareableUrl() {
  const dataToShare = {
    advisorType: state.advisorType,
    advisorName: state.advisorName,
    milestones: state.milestones,
    passportId: state.passportId,
  }

  const encodedData = btoa(JSON.stringify(dataToShare))
  const url = `${window.location.origin}${window.location.pathname}?data=${encodedData}`

  // Copy to clipboard
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showToast("URL copied to clipboard", "Share this link to show your passport to others.")
    })
    .catch(() => {
      showToast("Failed to copy URL", "Please try again or copy the URL manually.", true)
    })

  return url
}

// Toggle milestone completion
function toggleMilestone(id) {
  state.milestones = state.milestones.map((milestone) =>
    milestone.id === id
      ? {
          ...milestone,
          isCompleted: !milestone.isCompleted,
          dateCompleted: !milestone.isCompleted ? new Date().toLocaleDateString() : undefined,
        }
      : milestone,
  )

  renderPassport()
  updateProgress()
  saveData()
}

// Switch advisor type
function switchAdvisorType(type) {
  if (confirm("Changing advisor type will reset your progress. Continue?")) {
    state.advisorType = type
    state.milestones = type === "rookie" ? [...ROOKIE_MILESTONES] : [...EXPERIENCED_MILESTONES]
    state.currentPage = 0

    renderPassport()
    updateProgress()
    saveData()
  }
}

// Navigation functions
function nextPage() {
  if (state.currentPage < 3) {
    state.currentPage++
    renderPassport()
  }
}

function prevPage() {
  if (state.currentPage > 0) {
    state.currentPage--
    renderPassport()
  }
}

// Update name
function updateName(name) {
  state.advisorName = name
}

// Update progress indicators
function updateProgress() {
  const completedCount = state.milestones.filter((m) => m.isCompleted).length
  const totalCount = state.milestones.length
  const percentage = (completedCount / totalCount) * 100

  progressText.textContent = `Progress: ${completedCount} of ${totalCount} milestones completed`
  progressBar.style.width = `${percentage}%`
}

// Show toast notification
function showToast(title, message, isError = false) {
  const toast = document.createElement("div")
  toast.className = `fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-start space-x-4 z-50 ${isError ? "border-l-4 border-red-500" : "border-l-4 border-amber-500"}`
  toast.innerHTML = `
    <div>
      <h3 class="font-medium ${isError ? "text-red-800" : "text-amber-800"}">${title}</h3>
      <p class="text-sm text-gray-600">${message}</p>
    </div>
    <button class="text-gray-400 hover:text-gray-500">×</button>
  `

  document.body.appendChild(toast)

  toast.querySelector("button").addEventListener("click", () => {
    document.body.removeChild(toast)
  })

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast)
    }
  }, 5000)
}

// Render the passport based on current state
function renderPassport() {
  let content = ""

  // Render different pages based on currentPage
  switch (state.currentPage) {
    case 0: // Cover
      content = `
        <div class="w-full h-full bg-amber-800 flex flex-col items-center justify-center p-8 relative">
          <div class="absolute top-4 right-4 flex space-x-2">
            <button 
              class="px-3 py-1 rounded text-sm ${state.advisorType === "rookie" ? "bg-amber-600 text-white" : "bg-transparent text-white border border-white"}"
              onclick="switchAdvisorType('rookie')">
              Rookie
            </button>
            <button 
              class="px-3 py-1 rounded text-sm ${state.advisorType === "experienced" ? "bg-amber-600 text-white" : "bg-transparent text-white border border-white"}"
              onclick="switchAdvisorType('experienced')">
              Experienced
            </button>
          </div>

          <div class="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center mb-6">
            <div class="w-28 h-28 bg-amber-500 rounded-full flex items-center justify-center">
              <div class="text-white font-bold text-xl">SUN LIFE</div>
            </div>
          </div>

          <div class="text-center">
            <h1 class="text-white text-3xl font-bold mb-2">PASSPORT</h1>
            <h2 class="text-amber-200 text-xl font-semibold mb-6">SUN LIFE TRAINING JOURNEY</h2>
            <div class="border-t border-b border-amber-600 py-4 px-8 mb-6">
              <h3 class="text-white text-lg font-medium">
                ${state.advisorType === "rookie" ? "ADVISOR A (ROOKIE)" : "ADVISOR B (1.5-2 YEARS)"}
              </h3>
            </div>
            <p class="text-amber-200 text-sm">
              This passport belongs to a Sun Life Advisor on their journey to excellence
            </p>
          </div>

          <div class="absolute bottom-8 left-0 right-0 flex flex-col items-center">
            <div class="border-t border-amber-600 w-32 mb-2"></div>
            <div class="text-amber-200 text-xs font-mono">PASSPORT ID: ${state.passportId}</div>
          </div>
        </div>
      `
      break

    case 1: // Personal Information
      content = `
        <div class="w-full h-full bg-white flex flex-col">
          <div class="bg-amber-700 text-white p-4 text-center font-bold">PERSONAL INFORMATION</div>
          <div class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-6">
              <div class="flex flex-col space-y-2">
                <label for="advisorName" class="text-sm font-medium text-gray-700">
                  Advisor Name
                </label>
                <input
                  id="advisorName"
                  type="text"
                  value="${state.advisorName}"
                  onchange="updateName(this.value)"
                  class="border border-gray-300 rounded-md p-2"
                  placeholder="Enter your name"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-sm font-medium text-gray-700">Advisor Level</label>
                <div class="flex space-x-4">
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="rookie"
                      name="advisorType"
                      ${state.advisorType === "rookie" ? "checked" : ""}
                      onchange="switchAdvisorType('rookie')"
                      class="mr-2"
                    />
                    <label for="rookie">Rookie (0-1.5 years)</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="radio"
                      id="experienced"
                      name="advisorType"
                      ${state.advisorType === "experienced" ? "checked" : ""}
                      onchange="switchAdvisorType('experienced')"
                      class="mr-2"
                    />
                    <label for="experienced">Experienced (1.5-2 years)</label>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <h3 class="font-semibold text-lg mb-2">Passport Information</h3>
                <p class="text-sm text-gray-600">
                  This digital passport tracks your progress through the Sun Life Training Journey. Click on milestones
                  to stamp them as completed.
                </p>
                <p class="text-sm text-gray-600 mt-2">
                  Passport ID: <span class="font-mono">${state.passportId}</span>
                </p>
                
                <div class="mt-4 flex flex-wrap gap-2">
                  <button onclick="exportPassport()" class="px-3 py-1 bg-amber-600 text-white rounded text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </button>
                  <button onclick="document.getElementById('fileInput').click()" class="px-3 py-1 bg-amber-600 text-white rounded text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Import
                  </button>
                  <input type="file" id="fileInput" accept=".json" onchange="importPassport(event)" style="display: none;" />
                  <button onclick="generateShareableUrl()" class="px-3 py-1 bg-amber-600 text-white rounded text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      break

    case 2: // Milestones Page 1
      content = `
        <div class="w-full h-full bg-white flex flex-col">
          <div class="bg-amber-700 text-white p-4 text-center font-bold">MILESTONES (${state.advisorType === "rookie" ? "ROOKIE" : "EXPERIENCED"})</div>
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-2 gap-4 p-6">
              ${state.milestones
                .slice(0, 3)
                .map(
                  (milestone) => `
                <div
                  class="border border-gray-200 rounded-lg p-4 cursor-pointer relative"
                  onclick="toggleMilestone('${milestone.id}')"
                >
                  <h3 class="font-bold text-lg">${milestone.title}</h3>
                  <p class="text-sm text-gray-600">${milestone.description}</p>

                  ${
                    milestone.isCompleted
                      ? `
                    <div class="stamp">
                      <div class="text-center">
                        <div class="text-xs">COMPLETED</div>
                        <div class="text-xs">${milestone.dateCompleted || ""}</div>
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      `
      break

    case 3: // Milestones Page 2
      content = `
        <div class="w-full h-full bg-white flex flex-col">
          <div class="bg-amber-700 text-white p-4 text-center font-bold">MILESTONES (${state.advisorType === "rookie" ? "ROOKIE" : "EXPERIENCED"})</div>
          <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-2 gap-4 p-6">
              ${state.milestones
                .slice(3, 6)
                .map(
                  (milestone) => `
                <div
                  class="border border-gray-200 rounded-lg p-4 cursor-pointer relative"
                  onclick="toggleMilestone('${milestone.id}')"
                >
                  <h3 class="font-bold text-lg">${milestone.title}</h3>
                  <p class="text-sm text-gray-600">${milestone.description}</p>

                  ${
                    milestone.isCompleted
                      ? `
                    <div class="stamp">
                      <div class="text-center">
                        <div class="text-xs">COMPLETED</div>
                        <div class="text-xs">${milestone.dateCompleted || ""}</div>
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      `
      break
  }

  // Add navigation buttons
  content += `
    <div class="absolute bottom-4 left-0 right-0 flex justify-between px-6">
      <button
        onclick="prevPage()"
        ${state.currentPage === 0 ? "disabled" : ""}
        class="px-3 py-1 border border-gray-300 rounded text-sm flex items-center ${state.currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <button
        onclick="saveData()"
        class="px-3 py-1 border border-gray-300 rounded text-sm flex items-center hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save
      </button>

      <button
        onclick="nextPage()"
        ${state.currentPage === 3 ? "disabled" : ""}
        class="px-3 py-1 border border-gray-300 rounded text-sm flex items-center ${state.currentPage === 3 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `

  passportElement.innerHTML = content
}

// Initialize the application
init()
