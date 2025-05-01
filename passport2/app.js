// Milestone data for different advisor levels
const milestonesData = {
  rookie: [
    {
      id: "powerboost",
      title: "POWERBOOST",
      description: "Complete the PowerBoost training program for new advisors.",
    },
    {
      id: "start",
      title: "START",
      description: "Complete the START onboarding program.",
    },
    {
      id: "4pillars",
      title: "4PILLARS",
      description: "Master the 4 Pillars of financial planning.",
    },
    {
      id: "jfw",
      title: "JFW",
      description: "Complete the Journey to Financial Wellness training.",
    },
    {
      id: "90k",
      title: "90K VALIDATION",
      description: "Achieve 90K validation milestone.",
    },
    {
      id: "products",
      title: "PRODUCTS MASTERCLASS",
      description: "Complete the Products Masterclass training.",
    },
  ],
  experienced: [
    {
      id: "vul-advance",
      title: "VUL ADVANCE",
      description: "Complete the Variable Universal Life advanced training.",
    },
    {
      id: "powerboost-apex",
      title: "POWERBOOST/APEX",
      description: "Complete the PowerBoost/APEX advanced program.",
    },
    {
      id: "uw-essentials",
      title: "UW ESSENTIALS",
      description: "Complete the Underwriting Essentials training (if applicable).",
    },
    {
      id: "sunny-level",
      title: "SUNNY LEVEL UP",
      description: "Complete the Sunny Level Up program (if applicable).",
    },
    {
      id: "1st-medallion",
      title: "1ST MEDALLION",
      description: "Achieve your first Medallion recognition.",
    },
    {
      id: "180k",
      title: "180K VALIDATION",
      description: "Achieve 180K validation milestone.",
    },
  ],
}

// DOM Elements
const authContainer = document.getElementById("auth-container")
const loadingContainer = document.getElementById("loading-container")
const passportContainer = document.getElementById("passport-container")
const passportControls = document.getElementById("passport-controls")
const passportBook = document.getElementById("passport-book")
const milestonesPages = document.getElementById("milestones-pages")
const accessPassportBtn = document.getElementById("access-passport-btn")
const advisorEmail = document.getElementById("advisor-email")
const advisorName = document.getElementById("advisor-name")
const advisorType = document.getElementById("advisor-type")
const authMessage = document.getElementById("auth-message")
const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")
const currentPage = document.getElementById("current-page")
const totalPages = document.getElementById("total-pages")
const notification = document.getElementById("notification")
const notificationMessage = document.getElementById("notification-message")
const notificationClose = document.getElementById("notification-close")
const modal = document.getElementById("modal")
const modalTitle = document.getElementById("modal-title")
const modalBody = document.getElementById("modal-body")
const modalCancel = document.getElementById("modal-cancel")
const modalConfirm = document.getElementById("modal-confirm")
const closeModal = document.querySelector(".close-modal")
const changeLevelBtn = document.getElementById("change-level-btn")
const logoutBtn = document.getElementById("logout-btn")

// Display Elements
const displayName = document.getElementById("display-name")
const displayEmail = document.getElementById("display-email")
const displayLevel = document.getElementById("display-level")
const displayPassportId = document.getElementById("display-passport-id")
const displayLastUpdated = document.getElementById("display-last-updated")
const progressText = document.getElementById("progress-text")
const progressBar = document.getElementById("progress-bar")

// Templates
const milestonePageTemplateRookie = document.getElementById("milestone-page-template-rookie")
const milestonePageTemplateExperienced = document.getElementById("milestone-page-template-experienced")
const milestoneItemTemplateRookie = document.getElementById("milestone-item-template-rookie")
const milestoneItemTemplateExperienced = document.getElementById("milestone-item-template-experienced")

// Current user data
let currentUser = null

// Import jQuery
import $ from "jquery"

// Initialize the application
document.addEventListener("DOMContentLoaded", init)

function init() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("sunLifePassportUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    loadPassport()
  }

  // Event listeners
  accessPassportBtn.addEventListener("click", handleAccessPassport)
  prevBtn.addEventListener("click", () => {
    $("#passport-book").turn("previous")
  })
  nextBtn.addEventListener("click", () => {
    $("#passport-book").turn("next")
  })
  notificationClose.addEventListener("click", hideNotification)
  closeModal.addEventListener("click", hideModal)
  modalCancel.addEventListener("click", hideModal)
  modalConfirm.addEventListener("click", handleModalConfirm)
  changeLevelBtn.addEventListener("click", showChangeLevelModal)
  logoutBtn.addEventListener("click", handleLogout)
}

// Handle access passport button click
function handleAccessPassport() {
  const email = advisorEmail.value.trim()
  const name = advisorName.value.trim()
  const level = advisorType.value

  if (!email || !name) {
    showAuthError("Please fill in all fields.")
    return
  }

  if (!isValidEmail(email)) {
    showAuthError("Please enter a valid email address.")
    return
  }

  showLoading()

  // Simulate API call
  setTimeout(() => {
    try {
      // Check if user exists
      const existingUser = localStorage.getItem(`sunLifePassport_${email}`)

      if (existingUser) {
        currentUser = JSON.parse(existingUser)
        // Update name if it changed
        if (currentUser.name !== name) {
          currentUser.name = name
          saveUserData()
        }
      } else {
        // Create new user
        const passportId = generatePassportId()
        currentUser = {
          email,
          name,
          level,
          passportId,
          milestones: {},
          lastUpdated: new Date().toISOString(),
        }

        // Initialize milestones for BOTH advisor levels as not completed
        Object.entries(milestonesData).forEach(([levelKey, levelMilestones]) => {
          levelMilestones.forEach((milestone) => {
            const uniqueMilestoneId = `${levelKey}_${milestone.id}`
            currentUser.milestones[uniqueMilestoneId] = {
              completed: false,
              completedDate: null,
            }
          })
        })

        saveUserData()
      }

      loadPassport()
    } catch (error) {
      // Handle any errors that might occur
      hideLoading()
      showAuthError("An error occurred while accessing your passport. Please try again.")
      console.error("Passport access error:", error)
    }
  }, 1500)
}

// Load the passport
function loadPassport() {
  try {
    updateUserInfo()
    generateMilestonePages()

    // Hide auth and loading, show passport
    authContainer.classList.add("hidden")
    loadingContainer.classList.add("hidden")
    passportContainer.classList.remove("hidden")
    passportControls.classList.remove("hidden")

    // Initialize turn.js
    initTurnJs()

    // Save current user to session
    localStorage.setItem("sunLifePassportUser", JSON.stringify(currentUser))
  } catch (error) {
    hideLoading()
    showAuthError("Failed to load passport. Please try again.")
    console.error("Passport load error:", error)
  }
}

// Initialize turn.js
function initTurnJs() {
  // Destroy if already initialized
  if ($("#passport-book").data().turn) {
    $("#passport-book").turn("destroy")
  }

  // Initialize turn.js
  $("#passport-book").turn({
    width: passportContainer.offsetWidth,
    height: passportBook.offsetHeight,
    autoCenter: true,
    gradients: true,
    acceleration: true,
    elevation: 50,
    when: {
      turning: (event, page, view) => {
        currentPage.textContent = page
      },
      turned: (event, page, view) => {
        currentPage.textContent = page
      },
    },
  })

  // Update total pages
  const totalPagesCount = $("#passport-book").turn("pages")
  totalPages.textContent = totalPagesCount

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      $("#passport-book").turn("size", passportContainer.offsetWidth, passportBook.offsetHeight)
    }, 200),
  )
}

// Generate milestone pages
function generateMilestonePages() {
  // Clear existing pages
  milestonesPages.innerHTML = ""

  // We'll display milestones for both advisor levels
  const advisorLevels = [
    {
      level: "rookie",
      template: milestonePageTemplateRookie,
      itemTemplate: milestoneItemTemplateRookie,
      milestones: milestonesData.rookie,
    },
    {
      level: "experienced",
      template: milestonePageTemplateExperienced,
      itemTemplate: milestoneItemTemplateExperienced,
      milestones: milestonesData.experienced,
    },
  ]

  // Create pages for each advisor level
  advisorLevels.forEach((advisorLevel) => {
    // Calculate how many milestones per page (3 per page as in the design)
    const milestonesPerPage = 3

    // Calculate how many pages we need for this level
    const pageCount = Math.ceil(advisorLevel.milestones.length / milestonesPerPage)

    // Create pages for this advisor level
    for (let i = 0; i < pageCount; i++) {
      const pageClone = advisorLevel.template.content.cloneNode(true)
      const milestonesGrid = pageClone.querySelector(".milestones-grid")

      // Add milestones to this page
      const startIndex = i * milestonesPerPage
      const endIndex = Math.min(startIndex + milestonesPerPage, advisorLevel.milestones.length)

      for (let j = startIndex; j < endIndex; j++) {
        const milestone = advisorLevel.milestones[j]
        const milestoneClone = advisorLevel.itemTemplate.content.cloneNode(true)

        const milestoneItem = milestoneClone.querySelector(".milestone-item")
        const milestoneTitle = milestoneClone.querySelector(".milestone-title")
        const milestoneDescription = milestoneClone.querySelector(".milestone-description")
        const milestoneNum = milestoneClone.querySelector(".milestone-num")
        const certifiedStamp = milestoneClone.querySelector(`.${advisorLevel.level}-stamp`)

        // Create a unique ID that includes the advisor level
        const uniqueMilestoneId = `${advisorLevel.level}_${milestone.id}`

        milestoneItem.dataset.id = uniqueMilestoneId
        milestoneTitle.textContent = milestone.title
        milestoneDescription.textContent = milestone.description
        milestoneNum.textContent = j + 1

        // Check if milestone is completed
        if (currentUser.milestones[uniqueMilestoneId]?.completed) {
          certifiedStamp.classList.add("completed")
        }

        // Add click event to toggle milestone completion
        milestoneItem.addEventListener("click", () =>
          toggleMilestone(uniqueMilestoneId, advisorLevel.level, milestone.title),
        )

        milestonesGrid.appendChild(milestoneClone)
      }

      milestonesPages.appendChild(pageClone)
    }
  })

  // Update progress
  updateProgress()
}

// Toggle milestone completion
function toggleMilestone(milestoneId, advisorLevel, milestoneTitle) {
  // Ensure the milestone exists in the user's data
  if (!currentUser.milestones[milestoneId]) {
    currentUser.milestones[milestoneId] = {
      completed: false,
      completedDate: null,
    }
  }

  const milestone = currentUser.milestones[milestoneId]

  milestone.completed = !milestone.completed
  milestone.completedDate = milestone.completed ? new Date().toISOString() : null

  // Update UI
  const milestoneItem = document.querySelector(`.milestone-item[data-id="${milestoneId}"]`)
  const certifiedStamp = milestoneItem.querySelector(`.${advisorLevel}-stamp`)

  if (milestone.completed) {
    certifiedStamp.classList.add("completed")
    showNotification(
      `${advisorLevel === "rookie" ? "Advisor A" : "Advisor B"} Milestone "${milestoneTitle}" completed!`,
    )
  } else {
    certifiedStamp.classList.remove("completed")
    showNotification(
      `${advisorLevel === "rookie" ? "Advisor A" : "Advisor B"} Milestone "${milestoneTitle}" marked as incomplete.`,
    )
  }

  // Update last updated date
  currentUser.lastUpdated = new Date().toISOString()
  displayLastUpdated.textContent = formatDate(currentUser.lastUpdated)

  // Update progress
  updateProgress()

  // Save user data
  saveUserData()
}

// Update progress bar and text
function updateProgress() {
  // Count completed milestones for the current user's level
  const currentLevelMilestones = Object.keys(currentUser.milestones).filter((key) => key.startsWith(currentUser.level))

  const completedCount = currentLevelMilestones.filter((key) => currentUser.milestones[key]?.completed).length

  const totalCount = milestonesData[currentUser.level].length
  const percentage = (completedCount / totalCount) * 100

  progressBar.style.width = `${percentage}%`
  progressText.textContent = `${completedCount} of ${totalCount} milestones completed for your level`
}

// Update user info in the passport
function updateUserInfo() {
  // Update personal info page
  displayName.textContent = currentUser.name
  displayEmail.textContent = currentUser.email
  displayLevel.textContent = currentUser.level === "rookie" ? "Advisor A (Rookie)" : "Advisor B (1.5-2 years)"
  displayPassportId.textContent = currentUser.passportId
  displayLastUpdated.textContent = formatDate(currentUser.lastUpdated)
}

// Show change level modal
function showChangeLevelModal() {
  modalTitle.textContent = "Change Advisor Level"
  modalBody.innerHTML = `
    <p>Changing your advisor level will update your profile but preserve your milestone progress for both levels.</p>
    <div class="form-group">
      <label for="new-advisor-type">Select New Level:</label>
      <select id="new-advisor-type">
        <option value="rookie" ${currentUser.level === "rookie" ? "selected" : ""}>Advisor A (Rookie) (0-1.5 years)</option>
        <option value="experienced" ${currentUser.level === "experienced" ? "selected" : ""}>Advisor B (1.5-2 years)</option>
      </select>
    </div>
  `

  modal.classList.remove("hidden")
}

// Handle modal confirm button
function handleModalConfirm() {
  const newAdvisorType = document.getElementById("new-advisor-type").value

  if (newAdvisorType !== currentUser.level) {
    // Change level but don't reset milestones
    currentUser.level = newAdvisorType

    // Update last updated date
    currentUser.lastUpdated = new Date().toISOString()

    // Save user data
    saveUserData()

    // Reload passport
    loadPassport()

    // Show notification
    showNotification("Advisor level changed successfully. Your milestones have been preserved.")
  }

  hideModal()
}

// Handle logout
function handleLogout() {
  // Remove current user from session
  localStorage.removeItem("sunLifePassportUser")
  currentUser = null

  // Show auth container, hide passport
  authContainer.classList.remove("hidden")
  passportContainer.classList.add("hidden")
  passportControls.classList.add("hidden")

  // Clear form
  advisorEmail.value = ""
  advisorName.value = ""
  advisorType.value = "rookie"
  authMessage.textContent = ""
  authMessage.classList.remove("error", "success")
}

// Save user data to localStorage
function saveUserData() {
  localStorage.setItem(`sunLifePassport_${currentUser.email}`, JSON.stringify(currentUser))
  localStorage.setItem("sunLifePassportUser", JSON.stringify(currentUser))
}

// Show loading container
function showLoading() {
  authContainer.classList.add("hidden")
  loadingContainer.classList.remove("hidden")
}

// Hide loading container
function hideLoading() {
  loadingContainer.classList.add("hidden")
  authContainer.classList.remove("hidden")
}

// Show auth error
function showAuthError(message) {
  authMessage.textContent = message
  authMessage.classList.add("error")
  authMessage.classList.remove("success")
}

// Show notification
function showNotification(message) {
  notificationMessage.textContent = message
  notification.classList.remove("hidden")

  // Auto hide after 3 seconds
  setTimeout(hideNotification, 3000)
}

// Hide notification
function hideNotification() {
  notification.classList.add("hidden")
}

// Hide modal
function hideModal() {
  modal.classList.add("hidden")
}

// Generate passport ID
function generatePassportId() {
  return "SL-" + Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Debounce function for resize events
function debounce(func, wait) {
  let timeout
  return function () {
    
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
