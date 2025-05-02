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
const userData = {
  name: "",
  email: "",
  level: "rookie",
  completedMilestones: [],
  lastUpdated: new Date().toISOString(),
  passportId: generatePassportId(),
}

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
const currentDisplayMode = window.innerWidth < 768 ? "single" : "double"

function generatePassportId() {
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `SL-${randomId}`
}

// Initialize the application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Preload all images to prevent loading issues
  const imagesToPreload = [
    "public/hard-cover-front.jpg",
    "public/hard-cover-back.jpg",
    "public/hard-inside-cover-wave-bg.jpg",
    "public/page-content-wave-bg.jpg",
    "public/milestones-pages-1.jpg",
    "public/milestones-pages-2.jpg",
    "public/milestones-pages-3.jpg",
    "public/milestones-pages-4.jpg",
    "public/sun-life-logo.png",
  ]

  let loadedImages = 0
  const totalImages = imagesToPreload.length

  // // Show loading indicator
  // const loadingIndicator = document.createElement("div")
  // loadingIndicator.className = "loading-indicator"
  // loadingIndicator.innerHTML = '<div class="spinner"></div><p>Loading passport...</p>'
  // document.body.appendChild(loadingIndicator)

  // Preload images
  imagesToPreload.forEach((src) => {
    const img = new Image()
    img.onload = () => {
      loadedImages++
      if (loadedImages === totalImages) {
        initializePassport()
        loadingIndicator.remove()
      }
    }
    img.onerror = () => {
      console.error("Failed to load image:", src)
      loadedImages++
      if (loadedImages === totalImages) {
        initializePassport()
        loadingIndicator.remove()
      }
    }
    img.src = src
  })

  function initializePassport() {
    // Check if this is a shared passport
    const urlParams = new URLSearchParams(window.location.search)
    const isShared = urlParams.get("shared")

    // Check if there's existing passport data in localStorage
    const existingData = localStorage.getItem("passportData")

    if (isShared && existingData) {
      // Ask user if they want to view the shared passport
      showConfirmDialog(
        "You already have passport data saved. Would you like to temporarily view the shared passport?",
        () => {
          // User chose to view shared passport
          initializeFlipbook()
        },
      )
    } else {
      initializeFlipbook()
    }
  }

  function showConfirmDialog(message, onConfirm) {
    const dialog = document.createElement("div")
    dialog.className = "confirm-dialog"
    dialog.innerHTML = `
      <div class="confirm-dialog-content">
        <p>${message}</p>
        <div class="confirm-dialog-buttons">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-confirm">Confirm</button>
        </div>
      </div>
    `

    document.body.appendChild(dialog)

    dialog.querySelector(".btn-confirm").addEventListener("click", () => {
      dialog.remove()
      onConfirm()
    })

    dialog.querySelector(".btn-cancel").addEventListener("click", () => {
      dialog.remove()
    })
  }

  function initializeFlipbook() {
    // Create passport pages
    const passport = document.getElementById("passport")

    // Front cover
    const frontCover = createPage("hard-cover-front.jpg", "front-cover")
    passport.appendChild(frontCover)

    // Inside front cover
    const insideFrontCover = createPage("hard-inside-cover-wave-bg.jpg", "inside-front-cover")
    const logoContainer = document.createElement("div")
    logoContainer.className = "logo-container"
    logoContainer.innerHTML = `<img src="public/sun-life-logo.png" alt="Sun Life Logo" class="sun-life-logo">`
    insideFrontCover.appendChild(logoContainer)
    passport.appendChild(insideFrontCover)

    // Personal Information page
    const personalInfoPage = createPage("page-content-wave-bg.jpg", "personal-info-page")
    const personalInfoContent = document.createElement("div")
    personalInfoContent.className = "page-content"
    personalInfoContent.innerHTML = `
      <h2>PERSONAL INFORMATION</h2>
      <div class="personal-info-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label for="passport-id">Passport ID:</label>
          <input type="text" id="passport-id" value="SL-${Math.random().toString(36).substring(2, 10).toUpperCase()}" readonly>
        </div>
        <div class="form-group">
          <label for="issue-date">Issue Date:</label>
          <input type="text" id="issue-date" value="${new Date().toLocaleDateString()}" readonly>
        </div>
        <button class="save-info-btn">Save Information</button>
        <button class="logout-btn">Logout</button>
      </div>
    `
    personalInfoPage.appendChild(personalInfoContent)
    passport.appendChild(personalInfoPage)

    // Your Progress page
    const progressPage = createPage("page-content-wave-bg.jpg", "progress-page")
    const progressContent = document.createElement("div")
    progressContent.className = "page-content"
    progressContent.innerHTML = `
      <h2>YOUR PROGRESS</h2>
      <div class="progress-container">
        <div class="progress-bar-container">
          <div class="progress-label">Overall Completion</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 35%;"></div>
          </div>
          <div class="progress-percentage">35%</div>
        </div>
        
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-value">7</div>
            <div class="stat-label">Milestones Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">13</div>
            <div class="stat-label">Milestones Remaining</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">3</div>
            <div class="stat-label">Badges Earned</div>
          </div>
        </div>
        
        <div class="recent-activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>Completed "Financial Planning 101" - 2 days ago</li>
            <li>Earned "Early Starter" badge - 1 week ago</li>
            <li>Completed "Retirement Basics" - 2 weeks ago</li>
          </ul>
        </div>
      </div>
    `
    progressPage.appendChild(progressContent)
    passport.appendChild(progressPage)

    // Milestone pages
    // Page 1
    const milestonePage1 = createPage("milestones-pages-1.jpg", "milestone-page")
    const milestoneContent1 = createMilestoneContent([
      { title: "Financial Planning 101", completed: true },
      { title: "Budget Creation", completed: true },
      { title: "Emergency Fund Setup", completed: false },
    ])
    milestonePage1.appendChild(milestoneContent1)
    passport.appendChild(milestonePage1)

    // Page 2
    const milestonePage2 = createPage("milestones-pages-2.jpg", "milestone-page")
    const milestoneContent2 = createMilestoneContent([
      { title: "Retirement Planning", completed: true },
      { title: "Investment Basics", completed: true },
      { title: "Tax Optimization", completed: false },
    ])
    milestonePage2.appendChild(milestoneContent2)
    passport.appendChild(milestonePage2)

    // Page 3
    const milestonePage3 = createPage("milestones-pages-3.jpg", "milestone-page")
    const milestoneContent3 = createMilestoneContent([
      { title: "Insurance Coverage", completed: true },
      { title: "Estate Planning", completed: false },
      { title: "Debt Management", completed: true },
    ])
    milestonePage3.appendChild(milestoneContent3)
    passport.appendChild(milestonePage3)

    // Page 4
    const milestonePage4 = createPage("milestones-pages-4.jpg", "milestone-page")
    const milestoneContent4 = createMilestoneContent([
      { title: "College Savings", completed: false },
      { title: "Home Buying", completed: true },
      { title: "Financial Independence", completed: false },
    ])
    milestonePage4.appendChild(milestoneContent4)
    passport.appendChild(milestonePage4)

    // Back inside cover
    const insideBackCover = createPage("hard-inside-cover-wave-bg.jpg", "inside-back-cover")
    passport.appendChild(insideBackCover)

    // Back cover
    const backCover = createPage("hard-cover-back.jpg", "back-cover")
    passport.appendChild(backCover)

    // Initialize turn.js
    initializeTurnJS()

    // Add event listeners for buttons
    document.querySelector(".save-info-btn")?.addEventListener("click", () => {
      alert("Information saved successfully!")
    })

    document.querySelector(".logout-btn")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!")
      }
    })

    // Add print functionality
    document.getElementById("print-btn")?.addEventListener("click", printPassport)

    // Add responsive handling
    handleResponsiveLayout()
    window.addEventListener("resize", handleResponsiveLayout)
  }

  function createPage(backgroundImage, className) {
    const page = document.createElement("div")
    page.className = `page ${className}`
    page.style.backgroundImage = `url('public/${backgroundImage}')`
    page.style.backgroundSize = "cover"
    page.style.backgroundPosition = "center"
    return page
  }

  function createMilestoneContent(milestones) {
    const content = document.createElement("div")
    content.className = "milestone-content"

    const list = document.createElement("div")
    list.className = "milestone-list"

    milestones.forEach((milestone) => {
      const item = document.createElement("div")
      item.className = "milestone-item"

      const checkbox = document.createElement("div")
      checkbox.className = `milestone-checkbox ${milestone.completed ? "completed" : ""}`
      if (milestone.completed) {
        const stamp = document.createElement("div")
        stamp.className = "stamp"
        stamp.innerHTML = `<img src="public/certified-${Math.random() > 0.5 ? "gold" : "teal"}.png" alt="Certified Stamp">`
        checkbox.appendChild(stamp)
      }

      const title = document.createElement("div")
      title.className = "milestone-title"
      title.textContent = milestone.title

      item.appendChild(checkbox)
      item.appendChild(title)
      list.appendChild(item)
    })

    content.appendChild(list)
    return content
  }

  function initializeTurnJS() {
    $("#passport").turn({
      width: calculatePassportWidth(),
      height: calculatePassportHeight(),
      autoCenter: true,
      gradients: true,
      acceleration: true,
      elevation: 50, // Increase elevation for more pronounced shadow
      duration: 1000,
      when: {
        turning: (e, page, view) => {
          // Add shadow effect to the center
          enhanceCenterShadow(page)
        },
        turned: (e, page, view) => {
          // Refresh shadow effect after page turn
          enhanceCenterShadow(page)
        },
      },
    })

    // Add navigation controls
    document.getElementById("prev-btn").addEventListener("click", () => {
      $("#passport").turn("previous")
    })

    document.getElementById("next-btn").addEventListener("click", () => {
      $("#passport").turn("next")
    })
  }

  function enhanceCenterShadow(page) {
    // Add shadow effect to the center of the book
    const pages = document.querySelectorAll(".page")
    pages.forEach((p) => {
      // Reset all shadows
      p.style.boxShadow = ""
    })

    // Add shadow to current visible pages
    if (page > 1 && page < pages.length) {
      const leftPage = pages[page - 2]
      const rightPage = pages[page - 1]

      if (leftPage) {
        leftPage.style.boxShadow = "inset -10px 0 20px rgba(0,0,0,0.4)"
      }

      if (rightPage) {
        rightPage.style.boxShadow = "inset 10px 0 20px rgba(0,0,0,0.4)"
      }
    }
  }

  function calculatePassportWidth() {
    const windowWidth = window.innerWidth
    const isMobile = windowWidth < 768

    if (isMobile) {
      // On mobile, use single page view
      return Math.min(windowWidth * 0.9, 400)
    } else {
      // On desktop, use double page view
      return Math.min(windowWidth * 0.8, 1000)
    }
  }

  function calculatePassportHeight() {
    const windowHeight = window.innerHeight
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0
    const controlsHeight = document.querySelector(".controls")?.offsetHeight || 0
    const availableHeight = windowHeight - headerHeight - controlsHeight - 40 // 40px for margins

    return Math.min(availableHeight, 600)
  }

  function handleResponsiveLayout() {
    const windowWidth = window.innerWidth
    const isMobile = windowWidth < 768

    // Resize the passport
    $("#passport").turn("size", calculatePassportWidth(), calculatePassportHeight())

    // Update display mode for mobile
    if (isMobile) {
      $("#passport").turn("display", "single")
      $("#passport").turn("options", { display: "single" })
    } else {
      $("#passport").turn("display", "double")
      $("#passport").turn("options", { display: "double" })
    }

    // Center the passport
    $("#passport").turn("center")

    // Refresh shadow effect
    const currentPage = $("#passport").turn("page")
    enhanceCenterShadow(currentPage)
  }

  function printPassport() {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    // Get all pages
    const pages = document.querySelectorAll(".page")

    // Create HTML content for printing
    let printContent = `
      <html>
      <head>
        <title>Passport Print</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .print-page { page-break-after: always; margin-bottom: 20px; }
          .print-page img { width: 100%; height: auto; border: 1px solid #ccc; }
          h2 { text-align: center; margin-bottom: 10px; }
          .milestone-item { margin: 10px 0; padding: 5px; border-bottom: 1px solid #eee; }
          .completed:before { content: "✓"; color: green; margin-right: 5px; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Sun Life Financial Passport</h1>
    `

    // Add each page to the print content
    pages.forEach((page, index) => {
      // Create a canvas to render the page
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const width = 800
      const height = 600

      canvas.width = width
      canvas.height = height

      // Draw background
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, width, height)

      // Get background image
      const bgImage = page.style.backgroundImage
      if (bgImage && bgImage !== "none") {
        const imgUrl = bgImage.replace(/url$$['"](.+)['"]$$/, "$1")
        const img = new Image()
        img.crossOrigin = "anonymous" // Prevent CORS issues
        img.src = imgUrl

        // Draw the background image
        ctx.drawImage(img, 0, 0, width, height)
      }

      // Add page content
      const content = page.innerHTML

      printContent += `
        <div class="print-page">
          <h2>Page ${index + 1}</h2>
          <img src="${canvas.toDataURL("image/png")}" alt="Page ${index + 1}">
          <div class="page-content-print">
            ${content}
          </div>
        </div>
      `
    })

    printContent += `
      </body>
      </html>
    `

    // Write content to the new window
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Print after images have loaded
    setTimeout(() => {
      printWindow.print()
    }, 1000)
  }
})
