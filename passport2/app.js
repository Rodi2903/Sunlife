// Handle access passport button click
function handleAccessPassport() {
  const email = advisorEmail.value.trim();
  const name = advisorName.value.trim();
  const level = advisorType.value;

  if (!email || !name) {
    showAuthError('Please fill in all fields.');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthError('Please enter a valid email address.');
    return;
  }

  showLoading();

  // Use setTimeout to simulate loading without making actual API calls
  setTimeout(() => {
    try {
      // Check if user exists in local storage
      const existingUser = localStorage.getItem(`sunLifePassport_${email}`);
      
      if (existingUser) {
        currentUser = JSON.parse(existingUser);
        // Update name if it changed
        if (currentUser.name !== name) {
          currentUser.name = name;
          saveUserData();
        }
      } else {
        // Create new user
        const passportId = generatePassportId();
        currentUser = {
          email,
          name,
          level,
          passportId,
          milestones: {},
          lastUpdated: new Date().toISOString()
        };
        
        // Initialize milestones as not completed
        milestonesData[level].forEach(milestone => {
          currentUser.milestones[milestone.id] = {
            completed: false,
            completedDate: null
          };
        });
        
        saveUserData();
      }
      
      loadPassport();
    } catch (error) {
      // Handle any errors that might occur
      hideLoading();
      showAuthError('An error occurred while accessing your passport. Please try again.');
      console.error('Passport access error:', error);
    }
  }, 1500);
}

// Show loading container
function showLoading() {
  authContainer.classList.add('hidden');
  loadingContainer.classList.remove('hidden');
}

// Hide loading container
function hideLoading() {
  loadingContainer.classList.add('hidden');
  authContainer.classList.remove('hidden');
}
