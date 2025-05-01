// Milestone data for different advisor levels
const milestonesData = {
  advisorA: [
    { id: "a1", title: "POWERBOOST", description: "Complete the PowerBoost training program" },
    { id: "a2", title: "START", description: "Complete the START onboarding program" },
    { id: "a3", title: "4PILLARS", description: "Master the 4 Pillars of financial planning" },
    { id: "a4", title: "JFW", description: "Complete the Journey to Financial Wellness training" },
    { id: "a5", title: "90K VALIDATION", description: "Achieve 90K validation milestone" },
    { id: "a6", title: "PRODUCTS MASTERCLASS", description: "Complete the Products Masterclass training" },
  ],
  advisorB: [
    { id: "b1", title: "VUL ADVANCE", description: "Complete the Variable Universal Life advanced training" },
    { id: "b2", title: "POWERBOOST/APEX", description: "Complete the PowerBoost/APEX advanced program" },
    {
      id: "b3",
      title: "UW ESSENTIALS",
      description: "Complete the Underwriting Essentials training (if applicable)",
    },
    { id: "b4", title: "SUNNY LEVEL UP", description: "Complete the Sunny Level Up program (if applicable)" },
    { id: "b5", title: "1ST MEDALLION", description: "Achieve your first Medallion recognition" },
    { id: "b6", title: "180K VALIDATION", description: "Achieve 180K validation milestone" },
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
const currentUser = null

// Remove the ES6 import statement
// Replace this line:
// import $ from "jquery"
// The jQuery variable is already available from the CDN
const $ = window.jQuery

// User data
let userData = {
  name: "",
  email: "",
  completedMilestones: [],
  lastUpdated: new Date().toISOString(),
  level: "rookie", // Default level
}

// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
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
  const printBtn = document.getElementById("print-btn")
  const shareBtn = document.getElementById("share-btn")
  const currentPage = document.getElementById("current-page")
  const totalPages = document.getElementById("total-pages")
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notification-message")
  const notificationClose = document.getElementById("notification-close")
  const shareModal = document.getElementById("share-modal")
  const closeShareModal = document.querySelector(".close-share-modal")
  const copyLinkBtn = document.getElementById("copy-link-btn")
  const shareLink = document.getElementById("share-link")
  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalBody = document.getElementById("modal-body")
  const modalCancel = document.getElementById("modal-cancel")
  const modalConfirm = document.getElementById("modal-confirm")
  const closeModal = document.querySelector(".close-modal")
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

  // Initialize the flipbook
  function initializeFlipbook() {
    try {
      // Check if jQuery and turn.js are loaded
      if (typeof jQuery === "undefined") {
        console.error("jQuery is not loaded")
        return
      }

      if (typeof jQuery.fn.turn === "undefined") {
        console.error("turn.js is not loaded")
        return
      }

      // Check if the passport book element exists
      if (!passportBook) {
        console.error("Passport book element not found")
        return
      }

      // Initialize turn.js with enhanced animation settings
      jQuery(passportBook).turn({
        width: passportContainer.offsetWidth * 0.9,
        height: 600,
        autoCenter: true,
        gradients: true,
        acceleration: true,
        elevation: 50,
        duration: 1000,
        display: "double",
        when: {
          turning: (event, page, view) => {
            if (currentPage) {
              currentPage.textContent = page
            }
          },
          turned: function (event, page, view) {
            if (totalPages) {
              totalPages.textContent = jQuery(this).turn("pages")
            }
          },
        },
      })

      // Make the flipbook responsive
      window.addEventListener(
        "resize",
        debounce(() => {
          if (passportContainer && passportBook) {
            const width = passportContainer.offsetWidth * 0.9
            const height = Math.min(window.innerHeight * 0.7, 600)
            jQuery(passportBook).turn("size", width, height)
          }
        }, 200),
      )
    } catch (error) {
      console.error("Error initializing flipbook:", error)
    }
  }

  // Generate milestone pages
  function generateMilestonePages() {
    if (!milestonesPages) return

    // Clear existing milestone pages
    milestonesPages.innerHTML = ""

    // Create Advisor A milestone pages (1-3)
    const advisorAPage1 = document.createElement("div")
    advisorAPage1.innerHTML = `
      <div class="page-content wave-bg milestone-page">
        <div class="binding-effect right"></div>
        <div class="advisor-header rookie">
          <h2 class="advisor-title">ADVISOR A <span class="gold-text">(ROOKIE)</span></h2>
          <div class="advisor-divider rookie-divider"></div>
        </div>
        <div class="milestones-grid">
          ${generateMilestoneItems(milestonesData.advisorA.slice(0, 3), "rookie")}
        </div>
      </div>
    `
    milestonesPages.appendChild(advisorAPage1)

    // Create Advisor A milestone pages (4-6)
    const advisorAPage2 = document.createElement("div")
    advisorAPage2.innerHTML = `
      <div class="page-content wave-bg milestone-page">
        <div class="binding-effect right"></div>
        <div class="advisor-header rookie">
          <h2 class="advisor-title">ADVISOR A <span class="gold-text">(ROOKIE)</span></h2>
          <div class="advisor-divider rookie-divider"></div>
        </div>
        <div class="milestones-grid">
          ${generateMilestoneItems(milestonesData.advisorA.slice(3, 6), "rookie")}
        </div>
      </div>
    `
    milestonesPages.appendChild(advisorAPage2)

    // Create Advisor B milestone pages (1-3)
    const advisorBPage1 = document.createElement("div")
    advisorBPage1.innerHTML = `
      <div class="page-content wave-bg milestone-page">
        <div class="binding-effect left"></div>
        <div class="advisor-header experienced">
          <h2 class="advisor-title">ADVISOR B <span class="gold-text">(1.5 YR - 2 YEARS)</span></h2>
          <div class="advisor-divider experienced-divider"></div>
        </div>
        <div class="milestones-grid">
          ${generateMilestoneItems(milestonesData.advisorB.slice(0, 3), "experienced")}
        </div>
      </div>
    `
    milestonesPages.appendChild(advisorBPage1)

    // Create Advisor B milestone pages (4-6)
    const advisorBPage2 = document.createElement("div")
    advisorBPage2.innerHTML = `
      <div class="page-content wave-bg milestone-page">
        <div class="binding-effect right"></div>
        <div class="advisor-header experienced">
          <h2 class="advisor-title">ADVISOR B <span class="gold-text">(1.5 YR - 2 YEARS)</span></h2>
          <div class="advisor-divider experienced-divider"></div>
        </div>
        <div class="milestones-grid">
          ${generateMilestoneItems(milestonesData.advisorB.slice(3, 6), "experienced")}
        </div>
      </div>
    `
    milestonesPages.appendChild(advisorBPage2)

    // Add click event listeners to milestone items
    document.querySelectorAll(".milestone-item").forEach((item) => {
      item.addEventListener("click", function () {
        const milestoneId = this.getAttribute("data-id")
        toggleMilestoneCompletion(milestoneId)
      })
    })
  }

  // Generate milestone items HTML
  function generateMilestoneItems(milestones, type) {
    return milestones
      .map((milestone, index) => {
        // Initialize completedMilestones array if it doesn't exist
        if (!userData.completedMilestones) {
          userData.completedMilestones = []
        }

        const isCompleted = userData.completedMilestones.includes(milestone.id)
        const completedClass = isCompleted ? "completed" : ""
        const stampImage = type === "rookie" ? "public/certified-teal.png" : "public/certified-gold.png"
        const milestoneNumber = index + 1
        const numberClass = type === "rookie" ? "gold-text" : "teal-text"

        return `
        <div class="milestone-item" data-id="${milestone.id}">
          <div class="milestone-stamp-container">
            <img src="${stampImage}" alt="Certified" class="certified-img ${type}-stamp ${completedClass}">
          </div>
          <div class="milestone-content">
            <div class="milestone-number ${numberClass}">MILESTONE ${milestoneNumber} :</div>
            <h3 class="milestone-title">${milestone.title}</h3>
            <p class="milestone-description">${milestone.description}</p>
          </div>
        </div>
      `
      })
      .join("")
  }

  // Toggle milestone completion
  function toggleMilestoneCompletion(milestoneId) {
    // Initialize completedMilestones array if it doesn't exist
    if (!userData.completedMilestones) {
      userData.completedMilestones = []
    }

    const index = userData.completedMilestones.indexOf(milestoneId)

    if (index === -1) {
      // Add to completed milestones
      userData.completedMilestones.push(milestoneId)
      const certifiedImg = document.querySelector(`.milestone-item[data-id="${milestoneId}"] .certified-img`)
      if (certifiedImg) {
        certifiedImg.classList.add("completed")
      }
      showNotification("Milestone completed!")
    } else {
      // Remove from completed milestones
      userData.completedMilestones.splice(index, 1)
      const certifiedImg = document.querySelector(`.milestone-item[data-id="${milestoneId}"] .certified-img`)
      if (certifiedImg) {
        certifiedImg.classList.remove("completed")
      }
      showNotification("Milestone marked as incomplete")
    }

    // Update progress
    updateProgress()

    // Update last updated timestamp
    userData.lastUpdated = new Date().toISOString()
    if (displayLastUpdated) {
      displayLastUpdated.textContent = formatDate(userData.lastUpdated)
    }

    // Save user data
    saveUserData()
  }

  // Update progress display
  function updateProgress() {
    if (!progressBar || !progressText) return

    const totalMilestones = milestonesData.advisorA.length + milestonesData.advisorB.length
    const completedCount = userData.completedMilestones ? userData.completedMilestones.length : 0
    const progressPercentage = (completedCount / totalMilestones) * 100

    progressBar.style.width = `${progressPercentage}%`
    progressText.textContent = `${completedCount} of ${totalMilestones} milestones completed`
  }

  // Format date for display
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

  // Save user data to localStorage
  function saveUserData() {
    localStorage.setItem("sunLifePassportUser", JSON.stringify(userData))
  }

  // Load user data from localStorage
  function loadUserData() {
    const savedData = localStorage.getItem("sunLifePassportUser")
    if (savedData) {
      try {
        userData = JSON.parse(savedData)
        return true
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        return false
      }
    }
    return false
  }

  // Update personal information display
  function updatePersonalInfo() {
    if (displayName) displayName.textContent = userData.name || ""
    if (displayEmail) displayEmail.textContent = userData.email || ""
    if (displayPassportId) displayPassportId.textContent = generatePassportId(userData.email || "")
    if (displayLastUpdated) displayLastUpdated.textContent = formatDate(userData.lastUpdated)
    if (displayLevel) {
      displayLevel.textContent = userData.level === "rookie" ? "Advisor A (Rookie)" : "Advisor B (1.5-2 years)"
    }
  }

  // Generate a passport ID based on email
  function generatePassportId(email) {
    if (!email) return "SL-PASSPORT"
    try {
      return "SL-" + btoa(email).substring(0, 8).toUpperCase()
    } catch (e) {
      return "SL-PASSPORT"
    }
  }

  // Show notification
  function showNotification(message) {
    if (!notification || !notificationMessage) return
    notificationMessage.textContent = message
    notification.classList.remove("hidden")

    // Auto hide after 3 seconds
    setTimeout(() => {
      hideNotification()
    }, 3000)
  }

  // Hide notification
  function hideNotification() {
    if (notification) {
      notification.classList.add("hidden")
    }
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

  // Load passport data and initialize the UI
  function loadPassport() {
    try {
      // Update personal info
      updatePersonalInfo()

      // Generate milestone pages
      generateMilestonePages()

      // Update progress
      updateProgress()

      // Hide auth, show passport
      if (authContainer) authContainer.classList.add("hidden")
      if (loadingContainer) loadingContainer.classList.add("hidden")
      if (passportContainer) passportContainer.classList.remove("hidden")
      if (passportControls) passportControls.classList.remove("hidden")

      // Initialize flipbook
      setTimeout(initializeFlipbook, 100)
    } catch (error) {
      console.error("Error loading passport:", error)
      if (loadingContainer) loadingContainer.classList.add("hidden")
      if (authContainer) authContainer.classList.remove("hidden")
      showNotification("Error loading passport. Please try again.")
    }
  }

  // Check for shared passport
  function checkForSharedPassport() {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedData = urlParams.get("shared")

    if (sharedData) {
      try {
        // Decode the shared data
        const decodedData = JSON.parse(atob(sharedData))

        // Use the shared data
        userData = decodedData

        // Initialize completedMilestones if it doesn't exist
        if (!userData.completedMilestones) {
          userData.completedMilestones = []
        }

        // Load the passport
        loadPassport()

        // Show notification
        showNotification(`Viewing ${userData.name}'s passport`)
      } catch (error) {
        console.error("Error parsing shared data:", error)
        showNotification("Invalid shared passport link")
      }
    }
  }

  // Event Listeners

  // Access passport button
  if (accessPassportBtn) {
    accessPassportBtn.addEventListener("click", () => {
      if (!advisorEmail || !advisorName) {
        showNotification("Form elements not found")
        return
      }

      // Validate inputs
      if (!advisorName.value.trim() || !advisorEmail.value.trim()) {
        showNotification("Please fill in all fields")
        return
      }

      // Show loading
      if (authContainer) authContainer.classList.add("hidden")
      if (loadingContainer) loadingContainer.classList.remove("hidden")

      // Simulate loading delay
      setTimeout(() => {
        // Update user data
        userData.name = advisorName.value.trim()
        userData.email = advisorEmail.value.trim()
        userData.level = advisorType ? advisorType.value : "rookie"

        // Initialize completedMilestones if it doesn't exist
        if (!userData.completedMilestones) {
          userData.completedMilestones = []
        }

        // Save user data
        saveUserData()

        // Load the passport
        loadPassport()
      }, 1000)
    })
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      try {
        jQuery(passportBook).turn("previous")
      } catch (error) {
        console.error("Error navigating to previous page:", error)
      }
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      try {
        jQuery(passportBook).turn("next")
      } catch (error) {
        console.error("Error navigating to next page:", error)
      }
    })
  }

  // Print button
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print()
    })
  }

  // Share button
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      // Generate shareable link
      const shareData = {
        name: userData.name,
        email: userData.email,
        completedMilestones: userData.completedMilestones || [],
      }

      // Create a base64 encoded string of the user data
      try {
        const encodedData = btoa(JSON.stringify(shareData))
        const shareableLink = `${window.location.href.split("?")[0]}?shared=${encodedData}`

        // Set the link in the input field
        if (shareLink) {
          shareLink.value = shareableLink
        }

        // Show the share modal
        if (shareModal) {
          shareModal.classList.remove("hidden")
        }
      } catch (error) {
        console.error("Error creating share link:", error)
        showNotification("Error creating share link")
      }
    })
  }

  // Copy link button
  if (copyLinkBtn && shareLink) {
    copyLinkBtn.addEventListener("click", () => {
      shareLink.select()
      document.execCommand("copy")
      showNotification("Link copied to clipboard!")
    })
  }

  // Close share modal
  if (closeShareModal && shareModal) {
    closeShareModal.addEventListener("click", () => {
      shareModal.classList.add("hidden")
    })
  }

  // Close notification
  if (notificationClose) {
    notificationClose.addEventListener("click", () => {
      hideNotification()
    })
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear user data
      localStorage.removeItem("sunLifePassportUser")

      // Reset form
      if (advisorName) advisorName.value = ""
      if (advisorEmail) advisorEmail.value = ""
      if (advisorType) advisorType.value = "rookie"

      // Hide passport, show auth
      if (passportContainer) passportContainer.classList.add("hidden")
      if (passportControls) passportControls.classList.add("hidden")
      if (authContainer) authContainer.classList.remove("hidden")
    })
  }

  // Close modal
  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden")
    })
  }

  if (modalCancel && modal) {
    modalCancel.addEventListener("click", () => {
      modal.classList.add("hidden")
    })
  }

  // Initialize the application

  // Check if user is already logged in or if there's a shared passport
  if (loadUserData()) {
    loadPassport()
  } else {
    // Check for shared passport
    checkForSharedPassport()
  }
})
