// Configuration
const CONFIG = {
  // Replace with your deployed Google Apps Script Web App URL
  API_URL: "https://script.google.com/macros/s/AKfycbwA_E6gClBwIcGet9oh1oZS0zUXpn-xh9CiTyLkfRca6yUW0fm-Rnm9K7KZoD80WpsX/exec",
  MILESTONES_PER_PAGE: 3,
  ROOKIE_MILESTONES: [
    {
      id: "powerboost",
      title: "POWERBOOST",
      description: "Complete the PowerBoost training program",
    },
    {
      id: "start",
      title: "START",
      description: "Complete the START training program",
    },
    {
      id: "4pillars",
      title: "4PILLARS",
      description: "Master the 4 Pillars methodology",
    },
    {
      id: "jfw",
      title: "JFW",
      description: "Complete Joint Field Work training",
    },
    {
      id: "validation90k",
      title: "90K VALIDATION",
      description: "Achieve 90K validation milestone",
    },
    {
      id: "products",
      title: "PRODUCTS MASTERCLASS",
      description: "Complete Products Masterclass training",
    },
  ],
  EXPERIENCED_MILESTONES: [
    {
      id: "vuladvance",
      title: "VUL ADVANCE",
      description: "Complete VUL Advance training",
    },
    {
      id: "powerboostapex",
      title: "POWERBOOST/APEX",
      description: "Complete PowerBoost or APEX training",
    },
    {
      id: "uwessentials",
      title: "UW ESSENTIALS",
      description: "Complete Underwriting Essentials training",
    },
    {
      id: "sunnylevelup",
      title: "SUNNY LEVEL UP",
      description: "Complete Sunny Level Up program",
    },
    {
      id: "medallion",
      title: "1ST MEDALLION",
      description: "Achieve 1st Medallion recognition",
    },
    {
      id: "validation180k",
      title: "180K VALIDATION",
      description: "Achieve 180K validation milestone",
    },
  ],
}

// State management
const state = {
  isAuthenticated: false,
  isLoading: false,
  advisorData: null,
  currentPage: 1,
  totalPages: 6, // Will be calculated based on milestones
  error: null,
}

// DOM Elements
const elements = {
  authContainer: document.getElementById("auth-container"),
  loadingContainer: document.getElementById("loading-container"),
  passportContainer: document.getElementById("passport-container"),
  passportControls: document.getElementById("passport-controls"),
  passportBook: document.getElementById("passport-book"),
  milestonesPages: document.getElementById("milestones-pages"),

  // Auth form
  advisorEmail: document.getElementById("advisor-email"),
  advisorName: document.getElementById("advisor-name"),
  advisorType: document.getElementById("advisor-type"),
  accessPassportBtn: document.getElementById("access-passport-btn"),
  authMessage: document.getElementById("auth-message"),

  // Display elements
  displayName: document.getElementById("display-name"),
  displayEmail: document.getElementById("display-email"),
  displayLevel: document.getElementById("display-level"),
  displayPassportId: document.getElementById("display-passport-id"),
  displayLastUpdated: document.getElementById("display-last-updated"),
  coverAdvisorLevel: document.getElementById("cover-advisor-level"),
  passportIdDisplay: document.getElementById("passport-id-display"),

  // Controls
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  currentPageDisplay: document.getElementById("current-page"),
  totalPagesDisplay: document.getElementById("total-pages"),
  changeLevelBtn: document.getElementById("change-level-btn"),
  logoutBtn: document.getElementById("logout-btn"),

  // Progress
  progressText: document.getElementById("progress-text"),
  progressBar: document.getElementById("progress-bar"),

  // Notification
  notification: document.getElementById("notification"),
  notificationMessage: document.getElementById("notification-message"),
  notificationClose: document.getElementById("notification-close"),

  // Modal
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modal-title"),
  modalBody: document.getElementById("modal-body"),
  newAdvisorType: document.getElementById("new-advisor-type"),
  modalCancel: document.getElementById("modal-cancel"),
  modalConfirm: document.getElementById("modal-confirm"),
  closeModal: document.querySelector(".close-modal"),

  // Templates
  milestonePageTemplate: document.getElementById("milestone-page-template"),
  milestoneItemTemplate: document.getElementById("milestone-item-template"),
}

// Initialize the application
function init() {
  // Check if user is already logged in
  const savedEmail = localStorage.getItem("advisorEmail")
  if (savedEmail) {
    elements.advisorEmail.value = savedEmail
    loadAdvisorData(savedEmail)
  }

  // Set up event listeners
  setupEventListeners()
}

// Set up event listeners
function setupEventListeners() {
  // Auth form
  elements.accessPassportBtn.addEventListener("click", handleAccessPassport)

  // Navigation controls
  elements.prevBtn.addEventListener("click", () => {
    if (elements.passportBook && typeof $(elements.passportBook).turn === "function") {
      $(elements.passportBook).turn("previous")
    }
  })

  elements.nextBtn.addEventListener("click", () => {
    if (elements.passportBook && typeof $(elements.passportBook).turn === "function") {
      $(elements.passportBook).turn("next")
    }
  })

  // Other controls
  elements.changeLevelBtn.addEventListener("click", showChangeLevelModal)
  elements.logoutBtn.addEventListener("click", handleLogout)

  // Notification
  elements.notificationClose.addEventListener("click", hideNotification)

  // Modal
  elements.closeModal.addEventListener("click", hideModal)
  elements.modalCancel.addEventListener("click", hideModal)
  elements.modalConfirm.addEventListener("click", handleChangeLevel)
}

// Handle access passport button click
async function handleAccessPassport() {
  const email = elements.advisorEmail.value.trim()
  const name = elements.advisorName.value.trim()
  const type = elements.advisorType.value

  if (!email || !name) {
    showError("Please enter both email and name.")
    return
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.")
    return
  }

  showLoading()

  try {
    // Check if advisor exists
    const advisorData = await getAdvisorData(email)

    if (advisorData) {
      // Advisor exists, load their data
      state.advisorData = advisorData
      localStorage.setItem("advisorEmail", email)
      renderPassport()
    } else {
      // Advisor doesn't exist, create new record
      const newAdvisor = {
        email: email,
        name: name,
        type: type,
        passportId: generatePassportId(),
        milestones:
          type === "rookie"
            ? initializeMilestones(CONFIG.ROOKIE_MILESTONES)
            : initializeMilestones(CONFIG.EXPERIENCED_MILESTONES),
        lastUpdated: new Date().toISOString(),
      }

      // Save new advisor data
      const savedData = await saveAdvisorData(newAdvisor)
      state.advisorData = savedData
      localStorage.setItem("advisorEmail", email)
      renderPassport()
    }
  } catch (error) {
    console.error("Error accessing passport:", error)
    hideLoading()

    // Show more detailed error message
    let errorMessage = "Failed to access passport. "

    if (error.message.includes("Failed to fetch")) {
      errorMessage +=
        "Cannot connect to the server. Please check your internet connection and verify the API URL is correct."
    } else if (error.message.includes("NetworkError")) {
      errorMessage += "Network error. This might be due to CORS restrictions or server unavailability."
    } else if (error.message.includes("SyntaxError")) {
      errorMessage += "Received invalid response from server. The API might not be working correctly."
    } else {
      errorMessage += error.message || "Unknown error occurred."
    }

    showError(errorMessage)
  }
}

// Initialize milestones array
function initializeMilestones(milestonesConfig) {
  return milestonesConfig.map((milestone) => ({
    ...milestone,
    isCompleted: false,
    dateCompleted: null,
  }))
}

// Generate a unique passport ID
function generatePassportId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// API Functions
async function getAdvisorData(email) {
  try {
    console.log("Fetching advisor data for:", email)
    console.log("Using API URL:", CONFIG.API_URL)

    // First, test the connection
    const testResponse = await fetch(`${CONFIG.API_URL}?action=test`)
    if (!testResponse.ok) {
      console.error("Test connection failed:", testResponse.status, testResponse.statusText)
      throw new Error(`API test failed with status: ${testResponse.status}`)
    }

    const testData = await testResponse.json()
    console.log("API test successful:", testData)

    // Now proceed with the actual request
    const response = await fetch(`${CONFIG.API_URL}?action=getAdvisor&email=${encodeURIComponent(email)}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("API response:", data)

    if (data.success) {
      return data.advisor
    } else {
      console.log("Advisor not found:", data.message)
      return null
    }
  } catch (error) {
    console.error("Error fetching advisor data:", error)
    throw error
  }
}

async function saveAdvisorData(advisorData) {
  try {
    console.log("Saving advisor data:", advisorData)
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "saveAdvisor",
        advisor: advisorData,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Save response:", data)

    if (data.success) {
      return data.advisor
    } else {
      throw new Error(data.message || "Failed to save advisor data")
    }
  } catch (error) {
    console.error("Error saving advisor data:", error)
    throw error
  }
}

async function updateMilestone(email, milestoneId, isCompleted) {
  try {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateMilestone",
        email: email,
        milestoneId: milestoneId,
        isCompleted: isCompleted,
        dateCompleted: isCompleted ? new Date().toISOString() : null,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      return data.advisor
    } else {
      throw new Error(data.message || "Failed to update milestone")
    }
  } catch (error) {
    console.error("Error updating milestone:", error)
    throw error
  }
}

async function updateAdvisorType(email, newType) {
  try {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateAdvisorType",
        email: email,
        type: newType,
        milestones:
          newType === "rookie"
            ? initializeMilestones(CONFIG.ROOKIE_MILESTONES)
            : initializeMilestones(CONFIG.EXPERIENCED_MILESTONES),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      return data.advisor
    } else {
      throw new Error(data.message || "Failed to update advisor type")
    }
  } catch (error) {
    console.error("Error updating advisor type:", error)
    throw error
  }
}

// Load advisor data
async function loadAdvisorData(email) {
  showLoading()

  try {
    const advisorData = await getAdvisorData(email)

    if (advisorData) {
      state.advisorData = advisorData
      renderPassport()
    } else {
      hideLoading()
      showAuthForm()
    }
  } catch (error) {
    console.error("Error loading advisor data:", error)
    hideLoading()
    showError("Failed to load your passport. Please try again.")
  }
}

// Handle milestone click
async function handleMilestoneClick(milestoneId) {
  if (!state.advisorData || !state.advisorData.email) return

  const milestone = state.advisorData.milestones.find((m) => m.id === milestoneId)
  if (!milestone) return

  const newStatus = !milestone.isCompleted

  try {
    const updatedAdvisor = await updateMilestone(state.advisorData.email, milestoneId, newStatus)

    state.advisorData = updatedAdvisor

    // Update UI
    const milestoneElement = document.querySelector(`.milestone-item[data-id="${milestoneId}"]`)
    const stampElement = milestoneElement.querySelector(".stamp")

    if (newStatus) {
      stampElement.classList.remove("hidden")
      stampElement.querySelector(".stamp-date").textContent = new Date().toLocaleDateString()
      showNotification("Milestone completed!")
    } else {
      stampElement.classList.add("hidden")
      showNotification("Milestone unmarked.")
    }

    updateProgress()
  } catch (error) {
    console.error("Error updating milestone:", error)
    showNotification("Failed to update milestone. Please try again.", true)
  }
}

// Handle change level
async function handleChangeLevel() {
  const newType = elements.newAdvisorType.value

  if (newType === state.advisorData.type) {
    hideModal()
    return
  }

  try {
    const updatedAdvisor = await updateAdvisorType(state.advisorData.email, newType)
    state.advisorData = updatedAdvisor

    hideModal()
    showNotification("Advisor level updated successfully.")

    // Re-render passport
    renderPassport()
  } catch (error) {
    console.error("Error changing advisor level:", error)
    hideModal()
    showNotification("Failed to update advisor level. Please try again.", true)
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem("advisorEmail")
  state.advisorData = null
  state.isAuthenticated = false

  // Reset form
  elements.advisorEmail.value = ""
  elements.advisorName.value = ""
  elements.advisorType.value = "rookie"

  // Show auth form
  hidePassport()
  showAuthForm()
}

// Render passport
function renderPassport() {
  if (!state.advisorData) return

  // Hide loading and auth form
  hideLoading()
  hideAuthForm()

  // Update display elements
  elements.displayName.textContent = state.advisorData.name
  elements.displayEmail.textContent = state.advisorData.email
  elements.displayLevel.textContent =
    state.advisorData.type === "rookie" ? "Rookie (0-1.5 years)" : "Experienced (1.5-2 years)"
  elements.displayPassportId.textContent = state.advisorData.passportId
  elements.displayLastUpdated.textContent = new Date(state.advisorData.lastUpdated).toLocaleString()

  // Update cover
  elements.coverAdvisorLevel.textContent =
    state.advisorData.type === "rookie" ? "ADVISOR A (ROOKIE)" : "ADVISOR B (1.5-2 YEARS)"
  elements.passportIdDisplay.textContent = `PASSPORT ID: ${state.advisorData.passportId}`

  // Generate milestone pages
  generateMilestonePages()

  // Initialize Turn.js
  initializeTurnJs()

  // Show passport
  showPassport()

  // Update progress
  updateProgress()
}

// Generate milestone pages
function generateMilestonePages() {
  elements.milestonesPages.innerHTML = ""

  const milestones = state.advisorData.milestones
  const pageCount = Math.ceil(milestones.length / CONFIG.MILESTONES_PER_PAGE)

  for (let i = 0; i < pageCount; i++) {
    const startIdx = i * CONFIG.MILESTONES_PER_PAGE
    const endIdx = Math.min(startIdx + CONFIG.MILESTONES_PER_PAGE, milestones.length)
    const pageMilestones = milestones.slice(startIdx, endIdx)

    const pageElement = elements.milestonePageTemplate.content.cloneNode(true)
    const milestonesGrid = pageElement.querySelector(".milestones-grid")

    pageMilestones.forEach((milestone) => {
      const milestoneElement = elements.milestoneItemTemplate.content.cloneNode(true)
      const milestoneItem = milestoneElement.querySelector(".milestone-item")

      milestoneItem.setAttribute("data-id", milestone.id)
      milestoneItem.querySelector(".milestone-title").textContent = milestone.title
      milestoneItem.querySelector(".milestone-description").textContent = milestone.description

      const stampElement = milestoneItem.querySelector(".stamp")
      if (milestone.isCompleted) {
        stampElement.classList.remove("hidden")
        stampElement.querySelector(".stamp-date").textContent = milestone.dateCompleted
          ? new Date(milestone.dateCompleted).toLocaleDateString()
          : ""
      }

      milestoneItem.addEventListener("click", () => handleMilestoneClick(milestone.id))

      milestonesGrid.appendChild(milestoneItem)
    })

    elements.milestonesPages.appendChild(pageElement)
  }

  // Update total pages
  state.totalPages = 4 + pageCount // Cover + Info + Milestone pages + Back
  elements.totalPagesDisplay.textContent = state.totalPages
}

// Initialize Turn.js
function initializeTurnJs() {
  if (typeof $ === "undefined") {
    console.error("jQuery is required for Turn.js. Please include it in your project.")
    return
  }

  // Check if Turn.js is already initialized
  if ($(elements.passportBook).data().turn) {
    try {
      $(elements.passportBook).turn("destroy")
    } catch (error) {
      console.error("Error destroying Turn.js:", error)
    }
  }

  try {
    $(elements.passportBook).turn({
      width: "100%",
      height: "100%",
      autoCenter: true,
      display: "double",
      acceleration: true,
      elevation: 50,
      gradients: true,
      when: {
        turning: (e, page) => {
          state.currentPage = page
          elements.currentPageDisplay.textContent = page
        },
      },
    })
  } catch (error) {
    console.error("Error initializing Turn.js:", error)
    return // Exit the function if Turn.js fails to initialize
  }

  // Responsive adjustments
  $(window).resize(() => {
    if ($(elements.passportBook).data().turn) {
      $(elements.passportBook).turn(
        "size",
        elements.passportContainer.offsetWidth,
        elements.passportContainer.offsetHeight,
      )
    }
  })
}

// Update progress indicators
function updateProgress() {
  if (!state.advisorData || !state.advisorData.milestones) return

  const completedCount = state.advisorData.milestones.filter((m) => m.isCompleted).length
  const totalCount = state.advisorData.milestones.length
  const percentage = (completedCount / totalCount) * 100

  elements.progressText.textContent = `${completedCount} of ${totalCount} milestones completed`
  elements.progressBar.style.width = `${percentage}%`
}

// UI Helper Functions
function showAuthForm() {
  elements.authContainer.classList.remove("hidden")
}

function hideAuthForm() {
  elements.authContainer.classList.add("hidden")
}

function showLoading() {
  elements.loadingContainer.classList.remove("hidden")
}

function hideLoading() {
  elements.loadingContainer.classList.add("hidden")
}

function showPassport() {
  elements.passportContainer.classList.remove("hidden")
  elements.passportControls.classList.remove("hidden")
}

function hidePassport() {
  elements.passportContainer.classList.add("hidden")
  elements.passportControls.classList.add("hidden")
}

function showError(message) {
  elements.authMessage.textContent = message
  elements.authMessage.className = "message error"
}

function showNotification(message, isError = false) {
  elements.notificationMessage.textContent = message
  elements.notification.style.borderLeftColor = isError ? "var(--error-color)" : "var(--success-color)"
  elements.notification.classList.remove("hidden")

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideNotification()
  }, 5000)
}

function hideNotification() {
  elements.notification.classList.add("hidden")
}

function showChangeLevelModal() {
  elements.newAdvisorType.value = state.advisorData.type
  elements.modal.classList.remove("hidden")
}

function hideModal() {
  elements.modal.classList.add("hidden")
}

// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init)
