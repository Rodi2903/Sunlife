// Google Apps Script code - Deploy as a Web App
// This file should be copied into the Google Apps Script editor

// Global variables
const SHEET_NAME = "AdvisorsData"

// Web app entry point
function doGet(e) {
  const action = e.parameter.action

  if (action === "getAdvisor") {
    const email = e.parameter.email
    return getAdvisorByEmail(email)
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      message: "Invalid action",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents)
  const action = data.action

  if (action === "saveAdvisor") {
    return saveAdvisor(data.advisor)
  } else if (action === "updateMilestone") {
    return updateMilestone(data.email, data.milestoneId, data.isCompleted, data.dateCompleted)
  } else if (action === "updateAdvisorType") {
    return updateAdvisorType(data.email, data.type, data.milestones)
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      message: "Invalid action",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

// Get advisor data by email
function getAdvisorByEmail(email) {
  const sheet = getOrCreateSheet()
  const data = sheet.getDataRange().getValues()

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const advisor = {
        email: data[i][0],
        name: data[i][1],
        type: data[i][2],
        passportId: data[i][3],
        milestones: JSON.parse(data[i][4]),
        lastUpdated: data[i][5],
      }

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          advisor: advisor,
        }),
      ).setMimeType(ContentService.MimeType.JSON)
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      message: "Advisor not found",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

// Save advisor data
function saveAdvisor(advisor) {
  const sheet = getOrCreateSheet()
  const data = sheet.getDataRange().getValues()

  // Check if advisor already exists
  let rowIndex = -1
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === advisor.email) {
      rowIndex = i + 1 // +1 because sheet rows are 1-indexed
      break
    }
  }

  // Update lastUpdated timestamp
  advisor.lastUpdated = new Date().toISOString()

  if (rowIndex > 0) {
    // Update existing advisor
    sheet.getRange(rowIndex, 2).setValue(advisor.name)
    sheet.getRange(rowIndex, 3).setValue(advisor.type)
    sheet.getRange(rowIndex, 4).setValue(advisor.passportId)
    sheet.getRange(rowIndex, 5).setValue(JSON.stringify(advisor.milestones))
    sheet.getRange(rowIndex, 6).setValue(advisor.lastUpdated)
  } else {
    // Add new advisor
    sheet.appendRow([
      advisor.email,
      advisor.name,
      advisor.type,
      advisor.passportId,
      JSON.stringify(advisor.milestones),
      advisor.lastUpdated,
    ])
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      advisor: advisor,
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

// Update milestone status
function updateMilestone(email, milestoneId, isCompleted, dateCompleted) {
  const sheet = getOrCreateSheet()
  const data = sheet.getDataRange().getValues()

  // Find advisor
  let rowIndex = -1
  let advisor = null

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      rowIndex = i + 1 // +1 because sheet rows are 1-indexed
      advisor = {
        email: data[i][0],
        name: data[i][1],
        type: data[i][2],
        passportId: data[i][3],
        milestones: JSON.parse(data[i][4]),
        lastUpdated: data[i][5],
      }
      break
    }
  }

  if (!advisor) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Advisor not found",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }

  // Update milestone
  advisor.milestones = advisor.milestones.map((milestone) => {
    if (milestone.id === milestoneId) {
      return {
        ...milestone,
        isCompleted: isCompleted,
        dateCompleted: dateCompleted,
      }
    }
    return milestone
  })

  // Update lastUpdated timestamp
  advisor.lastUpdated = new Date().toISOString()

  // Save to sheet
  sheet.getRange(rowIndex, 5).setValue(JSON.stringify(advisor.milestones))
  sheet.getRange(rowIndex, 6).setValue(advisor.lastUpdated)

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      advisor: advisor,
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

// Update advisor type
function updateAdvisorType(email, type, milestones) {
  const sheet = getOrCreateSheet()
  const data = sheet.getDataRange().getValues()

  // Find advisor
  let rowIndex = -1
  let advisor = null

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      rowIndex = i + 1 // +1 because sheet rows are 1-indexed
      advisor = {
        email: data[i][0],
        name: data[i][1],
        type: data[i][2],
        passportId: data[i][3],
        milestones: milestones, // Replace with new milestones
        lastUpdated: data[i][5],
      }
      break
    }
  }

  if (!advisor) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Advisor not found",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }

  // Update type and milestones
  advisor.type = type

  // Update lastUpdated timestamp
  advisor.lastUpdated = new Date().toISOString()

  // Save to sheet
  sheet.getRange(rowIndex, 3).setValue(advisor.type)
  sheet.getRange(rowIndex, 5).setValue(JSON.stringify(advisor.milestones))
  sheet.getRange(rowIndex, 6).setValue(advisor.lastUpdated)

  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      advisor: advisor,
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

// Helper function to get or create the sheet
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    // Create new sheet with headers
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(["Email", "Name", "Type", "PassportID", "Milestones", "LastUpdated"])

    // Format headers
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold")
    sheet.setFrozenRows(1)
  }

  return sheet
}
