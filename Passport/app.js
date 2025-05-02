// Use the libraries that are already loaded via script tags
const $ = window.jQuery

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

// User data
let userData = {
  name: "",
  email: "",
  level: "rookie",
  completedMilestones: [],
  lastUpdated: new Date().toISOString(),
  passportId: generatePassportId(),
}

// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const authContainer = document.getElementById("auth-container")
  const loadingContainer = document.getElementById("loading-container")
  const passportContainer = document.getElementById("passport-container")
  const passportControls = document.getElementById("passport-controls")
  const passportBook = document.getElementById("passport-book")
  const accessPassportBtn = document.getElementById("access-passport-btn")
  const advisorEmail = document.getElementById("advisor-email")
  const advisorName = document.getElementById("advisor-name")
  const authMessage = document.getElementById("auth-message")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const shareBtn = document.getElementById("share-btn")
  const printBtn = document.getElementById("print-btn")
  const currentPage = document.getElementById("current-page")
  const totalPages = document.getElementById("total-pages")
  const notification = document.getElementById("notification")
  const notificationMessage = document.getElementById("notification-message")
  const notificationClose = document.getElementById("notification-close")
  const shareModal = document.getElementById("share-modal")
  const closeShareModal = document.getElementById("close-share-modal")
  const copyLinkBtn = document.getElementById("copy-link-btn")
  const shareLink = document.getElementById("share-link")
  const emailShareBtn = document.getElementById("email-share-btn")
  const whatsappShareBtn = document.getElementById("whatsapp-share-btn")
  const sharedPassportModal = document.getElementById("shared-passport-modal")
  const closeSharedModal = document.getElementById("close-shared-modal")
  const keepMyDataBtn = document.getElementById("keep-my-data-btn")
  const viewSharedBtn = document.getElementById("view-shared-btn")

  // Milestone positions for interactive stamps
  const milestonePositions = {
    // Advisor A (Rookie) - Page 1
    a1: { left: 85, top: 220, type: "teal" }, // POWERBOOST
    a2: { left: 85, top: 420, type: "teal" }, // START
    a3: { left: 85, top: 620, type: "teal" }, // 4PILLARS

    // Advisor A (Rookie) - Page 2
    a4: { left: 85, top: 220, type: "teal" }, // JFW
    a5: { left: 85, top: 420, type: "teal" }, // 90K VALIDATION
    a6: { left: 85, top: 620, type: "teal" }, // PRODUCTS MASTERCLASS

    // Advisor B - Page 1
    b1: { left: 85, top: 220, type: "gold" }, // VUL ADVANCE
    b2: { left: 85, top: 420, type: "gold" }, // POWERBOOST/APEX
    b3: { left: 85, top: 620, type: "gold" }, // UW ESSENTIALS

    // Advisor B - Page 2
    b4: { left: 85, top: 220, type: "gold" }, // SUNNY LEVEL UP
    b5: { left: 85, top: 420, type: "gold" }, // 1ST MEDALLION
    b6: { left: 85, top: 620, type: "gold" }, // 180K VALIDATION
  }

  // Track current display mode
  let currentDisplayMode = window.innerWidth < 768 ? "single" : "double"

  // Initialize the application
  init()

  function init() {
    // Check URL for shared passport
    checkForSharedPassport()

    // Add event listeners
    setupEventListeners()
  }

  function setupEventListeners() {
    // Access passport button
    if (accessPassportBtn) {
      accessPassportBtn.addEventListener("click", handleAccessPassport)
    }

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        $(passportBook).turn("previous")
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        $(passportBook).turn("next")
      })
    }

    // Share button
    if (shareBtn) {
      shareBtn.addEventListener("click", handleShare)
    }

    // Print button
    if (printBtn) {
      printBtn.addEventListener("click", handlePrint)
    }

    // Notification close button
    if (notificationClose) {
      notificationClose.addEventListener("click", hideNotification)
    }

    // Share modal close button
    if (closeShareModal) {
      closeShareModal.addEventListener("click", () => {
        shareModal.classList.add("hidden")
      })
    }

    // Copy link button
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        shareLink.select()
        document.execCommand("copy")
        showNotification("Link copied to clipboard!")
      })
    }

    // Email share button
    if (emailShareBtn) {
      emailShareBtn.addEventListener("click", () => {
        const subject = encodeURIComponent("My Sun Life Training Journey Passport")
        const body = encodeURIComponent(`Check out my Sun Life Training Journey Passport: ${shareLink.value}`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
      })
    }

    // WhatsApp share button
    if (whatsappShareBtn) {
      whatsappShareBtn.addEventListener("click", () => {
        const text = encodeURIComponent(`Check out my Sun Life Training Journey Passport: ${shareLink.value}`)
        window.open(`https://wa.me/?text=${text}`)
      })
    }

    // Shared passport modal buttons
    if (closeSharedModal) {
      closeSharedModal.addEventListener("click", () => {
        sharedPassportModal.classList.add("hidden")
      })
    }

    if (keepMyDataBtn) {
      keepMyDataBtn.addEventListener("click", () => {
        sharedPassportModal.classList.add("hidden")
      })
    }

    if (viewSharedBtn) {
      viewSharedBtn.addEventListener("click", () => {
        // Clear local storage and reload with the shared parameter
        localStorage.removeItem("sunLifePassportUser")
        sharedPassportModal.classList.add("hidden")
        location.reload()
      })
    }

    // Add logout button event listener
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "logout-btn") {
        handleLogout()
      }
    })
  }

  function handleLogout() {
    // Clear user data
    localStorage.removeItem("sunLifePassportUser")

    // Show notification
    showNotification("Logged out successfully!")

    // Redirect to login page after a short delay
    setTimeout(() => {
      location.reload()
    }, 1500)
  }

  // Update the handleAccessPassport function to use a default level
  function handleAccessPassport() {
    const email = advisorEmail.value.trim()
    const name = advisorName.value.trim()
    const level = "rookie" // Default to rookie since we removed the dropdown

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
      userData = {
        name,
        email,
        level,
        completedMilestones: [],
        lastUpdated: new Date().toISOString(),
        passportId: generatePassportId(),
      }

      // Save user data
      saveUserData()

      // Load passport
      loadPassport()
    }, 1000)
  }

  function loadPassport() {
    // Create passport pages
    createPassportPages()

    // Hide auth and loading, show passport
    authContainer.classList.add("hidden")
    loadingContainer.classList.add("hidden")
    passportContainer.classList.remove("hidden")
    passportControls.classList.remove("hidden")

    // Initialize turn.js
    initTurnJs()

    // Update user information display
    updateUserInfoDisplay()

    // Update progress display
    updateProgressDisplay()
  }

  function updateUserInfoDisplay() {
    // Update personal information page
    const displayName = document.getElementById("display-name")
    const displayEmail = document.getElementById("display-email")
    const displayPassportId = document.getElementById("display-passport-id")
    const displayLastUpdated = document.getElementById("display-last-updated")

    if (displayName) displayName.textContent = userData.name
    if (displayEmail) displayEmail.textContent = userData.email
    if (displayPassportId) displayPassportId.textContent = userData.passportId
    if (displayLastUpdated) {
      const date = new Date(userData.lastUpdated)
      displayLastUpdated.textContent = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }
  }

  function updateProgressDisplay() {
    // Update progress bar and text
    const progressBar = document.getElementById("progress-bar")
    const progressText = document.getElementById("progress-text")

    if (progressBar && progressText) {
      const totalMilestones = 12 // Total number of milestones
      const completedCount = userData.completedMilestones.length
      const progressPercentage = (completedCount / totalMilestones) * 100

      progressBar.style.width = progressPercentage + "%"
      progressText.textContent = `${completedCount} of ${totalMilestones} milestones completed`
    }
  }

  function createPassportPages() {
    // Clear existing pages
    passportBook.innerHTML = ""

    // Create front cover
    const frontCover = document.createElement("div")
    frontCover.className = "hard"
    frontCover.style.backgroundImage = "url('public/hard-cover-front.jpg')"
    frontCover.style.backgroundSize = "cover"
    frontCover.style.backgroundPosition = "center"
    passportBook.appendChild(frontCover)

    // Create inside cover with logo
    const insideCover = document.createElement("div")
    insideCover.className = "hard inside-cover wave-bg"
    insideCover.innerHTML = `
      <div class="binding-effect right"></div>
    `
    passportBook.appendChild(insideCover)

    // Create title page
    const titlePage = document.createElement("div")
    titlePage.innerHTML = `
      <div class="page-content wave-bg">
        <div class="binding-effect left"></div>
        <div class="inside-page-content">
          <div class="sun-logo">
            <img src="public/sun-life-logo.png" alt="Sun Life Logo" class="sun-life-logo-img">
          </div>
          <h2 class="sunlife-title lekton">Sun Life</h2>
          <h3 class="training-journey playfair">TRAINING JOURNEY</h3>
        </div>
      </div>
    `
    passportBook.appendChild(titlePage)

    // Create progress page
    const progressPage = document.createElement("div")
    progressPage.innerHTML = `
      <div class="page-content wave-bg">
        <div class="binding-effect right"></div>
        <h2 class="page-title">YOUR PROGRESS</h2>
        
        <div class="progress-section">
          <div class="progress-info">
            <span id="progress-text">0 of 12 milestones completed</span>
          </div>
          <div class="progress-bar-container">
            <div id="progress-bar" class="progress-bar"></div>
          </div>
        </div>
        
        <div class="data-info">
          <h3>Important Information</h3>
          <p>Your progress is automatically saved to your browser and will be available when you return.</p>
          <p>All personal information is stored locally and is not shared with any third parties.</p>
          <p>Your data will be automatically removed after 6 months of inactivity.</p>
          <p>This passport tracks your progress through all 12 milestones across both Advisor A and Advisor B levels.</p>
          <p>You can share your progress with others using the Share button below.</p>
        </div>
      </div>
    `
    passportBook.appendChild(progressPage)

    // Create personal info page
    const personalInfoPage = document.createElement("div")
    personalInfoPage.innerHTML = `
      <div class="page-content wave-bg">
        <div class="binding-effect left"></div>
        <h2 class="page-title">PERSONAL INFORMATION</h2>
        
        <div class="info-section">
          <div class="info-row">
            <label>Name:</label>
            <span id="display-name"></span>
          </div>
          
          <div class="info-row">
            <label>Email:</label>
            <span id="display-email"></span>
          </div>
          
          <div class="info-row">
            <label>Passport ID:</label>
            <span id="display-passport-id"></span>
          </div>
          
          <div class="info-row">
            <label>Last Updated:</label>
            <span id="display-last-updated"></span>
          </div>
        </div>
        
        <div class="actions-section">
          <button id="logout-btn" class="btn outline-btn">Logout</button>
        </div>
      </div>
    `
    passportBook.appendChild(personalInfoPage)

    // Define milestone pages with optimized JPG format
    const milestonePages = [
      { src: "public/milestones-pages-1.jpg", milestones: ["a1", "a2", "a3"] },
      { src: "public/milestones-pages-2.jpg", milestones: ["a4", "a5", "a6"] },
      { src: "public/milestones-pages-3.jpg", milestones: ["b1", "b2", "b3"] },
      { src: "public/milestones-pages-4.jpg", milestones: ["b4", "b5", "b6"] },
    ]

    // Create milestone pages
    milestonePages.forEach((page) => {
      const pageElement = document.createElement("div")
      pageElement.style.backgroundImage = `url(${page.src})`
      pageElement.style.backgroundSize = "cover"
      pageElement.style.backgroundPosition = "center"

      // Add milestone stamps
      if (page.milestones) {
        page.milestones.forEach((milestoneId) => {
          const position = milestonePositions[milestoneId]
          if (position) {
            const stampOverlay = document.createElement("div")
            stampOverlay.className = `stamp-overlay ${position.type}`
            stampOverlay.dataset.milestoneId = milestoneId

            // Position the stamp
            stampOverlay.style.position = "absolute"
            stampOverlay.style.left = `${position.left}px`
            stampOverlay.style.top = `${position.top}px`

            // Check if milestone is completed
            if (userData.completedMilestones.includes(milestoneId)) {
              stampOverlay.classList.add("completed")
            }

            // Add click event
            stampOverlay.addEventListener("click", () => {
              toggleMilestone(milestoneId)
            })

            pageElement.appendChild(stampOverlay)
          }
        })
      }

      passportBook.appendChild(pageElement)
    })

    // Create back cover
    const backCover = document.createElement("div")
    backCover.className = "hard"
    backCover.style.backgroundImage = "url('public/hard-cover-back.jpg')"
    backCover.style.backgroundSize = "cover"
    backCover.style.backgroundPosition = "center"
    passportBook.appendChild(backCover)
  }

  function initTurnJs() {
    // Get window width to determine display mode
    const windowWidth = window.innerWidth
    const isMobile = windowWidth < 768
    currentDisplayMode = isMobile ? "single" : "double"

    // Initialize turn.js with fixed options
    $(passportBook).turn({
      width: passportContainer.offsetWidth,
      height: passportContainer.offsetWidth * 0.7071, // Maintain aspect ratio
      autoCenter: true,
      display: currentDisplayMode,
      acceleration: true,
      gradients: true,
      elevation: 50,
      when: {
        turning: (event, page, pageObject) => {
          currentPage.textContent = page
        },
        turned: function (event, page, pageObject) {
          currentPage.textContent = page
          totalPages.textContent = $(this).turn("pages")
        },
      },
    })

    // Make responsive
    window.addEventListener(
      "resize",
      debounce(() => {
        const newWindowWidth = window.innerWidth
        const newIsMobile = newWindowWidth < 768
        const newDisplayMode = newIsMobile ? "single" : "double"

        // Resize the book
        $(passportBook).turn("size", passportContainer.offsetWidth, passportContainer.offsetWidth * 0.7071)

        // Only update display mode if it changed
        if (newDisplayMode !== currentDisplayMode) {
          // We need to recreate the book with the new display mode
          // First, save the current page
          const currentPageNum = $(passportBook).turn("page") || 1

          // Remove the turn.js functionality
          $(passportBook).turn("disable", true).unbind()

          // Empty the book
          passportBook.innerHTML = ""

          // Recreate pages
          createPassportPages()

          // Reinitialize with new display mode
          $(passportBook).turn({
            width: passportContainer.offsetWidth,
            height: passportContainer.offsetWidth * 0.7071,
            autoCenter: true,
            display: newDisplayMode,
            acceleration: true,
            gradients: true,
            elevation: 50,
            page: currentPageNum,
            when: {
              turning: (event, page, pageObject) => {
                currentPage.textContent = page
              },
              turned: function (event, page, pageObject) {
                currentPage.textContent = page
                totalPages.textContent = $(this).turn("pages")
              },
            },
          })

          // Update current display mode
          currentDisplayMode = newDisplayMode

          // Update user information and progress display
          updateUserInfoDisplay()
          updateProgressDisplay()
        }
      }, 200),
    )
  }

  function toggleMilestone(milestoneId) {
    const index = userData.completedMilestones.indexOf(milestoneId)
    const stampElements = document.querySelectorAll(`.stamp-overlay[data-milestone-id="${milestoneId}"]`)

    if (index === -1) {
      // Complete milestone
      userData.completedMilestones.push(milestoneId)
      stampElements.forEach((stamp) => stamp.classList.add("completed"))
      showNotification("Milestone completed!")
    } else {
      // Uncomplete milestone
      userData.completedMilestones.splice(index, 1)
      stampElements.forEach((stamp) => stamp.classList.remove("completed"))
      showNotification("Milestone marked as incomplete.")
    }

    // Update last updated timestamp
    userData.lastUpdated = new Date().toISOString()

    // Save user data
    saveUserData()

    // Update progress display
    updateProgressDisplay()
  }

  function handleShare() {
    // Generate shareable link
    const shareData = {
      name: userData.name,
      email: userData.email,
      completedMilestones: userData.completedMilestones,
      lastUpdated: userData.lastUpdated,
      passportId: userData.passportId,
    }

    const encodedData = btoa(JSON.stringify(shareData))
    const shareableLink = `${window.location.href.split("?")[0]}?shared=${encodedData}`

    // Set link in input field
    shareLink.value = shareableLink

    // Show share modal
    shareModal.classList.remove("hidden")
  }

  function handlePrint() {
    // Show notification
    showNotification("Preparing for print...")

    // Use browser's print functionality
    window.print()
  }

  function checkForSharedPassport() {
    const urlParams = new URLSearchParams(window.location.search)
    const sharedData = urlParams.get("shared")

    if (sharedData) {
      try {
        // Check if user already has data
        const existingData = localStorage.getItem("sunLifePassportUser")

        if (existingData) {
          // Show modal asking what to do
          sharedPassportModal.classList.remove("hidden")
        } else {
          // No existing data, load shared passport
          const decodedData = JSON.parse(atob(sharedData))
          userData = decodedData
          loadPassport()
        }
      } catch (error) {
        console.error("Error parsing shared data:", error)
        showNotification("Invalid shared passport link.")
      }
    } else {
      // Check if user is already logged in
      const savedData = localStorage.getItem("sunLifePassportUser")
      if (savedData) {
        try {
          userData = JSON.parse(savedData)
          loadPassport()
        } catch (error) {
          console.error("Error parsing saved data:", error)
        }
      }
    }
  }

  function saveUserData() {
    localStorage.setItem("sunLifePassportUser", JSON.stringify(userData))
  }

  function showLoading() {
    authContainer.classList.add("hidden")
    loadingContainer.classList.remove("hidden")
  }

  function showAuthError(message) {
    authMessage.textContent = message
    authMessage.className = "message error"
  }

  function showNotification(message) {
    notificationMessage.textContent = message
    notification.classList.remove("hidden")

    // Auto hide after 3 seconds
    setTimeout(hideNotification, 3000)
  }

  function hideNotification() {
    notification.classList.add("hidden")
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

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
})

// Generate a unique passport ID
function generatePassportId() {
  return "SL-" + Math.random().toString(36).substring(2, 8).toUpperCase()
}
