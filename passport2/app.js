// Generate milestone pages
function generateMilestonePages() {
  // Clear existing pages
  milestonesPages.innerHTML = '';
  
  // We'll now display milestones for both advisor levels
  const advisorLevels = [
    { 
      level: 'rookie', 
      title: 'ADVISOR A (ROOKIE)',
      milestones: milestonesData.rookie
    },
    { 
      level: 'experienced', 
      title: 'ADVISOR B (1.5 YR - 2 YEARS)',
      milestones: milestonesData.experienced
    }
  ];
  
  // Create pages for each advisor level
  advisorLevels.forEach(advisorLevel => {
    // Calculate how many milestones per page (3 for desktop, 2 for mobile)
    const milestonesPerPage = window.innerWidth > 768 ? 3 : 2;
    
    // Calculate how many pages we need for this level
    const pageCount = Math.ceil(advisorLevel.milestones.length / milestonesPerPage);
    
    // Create pages for this advisor level
    for (let i = 0; i < pageCount; i++) {
      const pageClone = milestonePageTemplate.content.cloneNode(true);
      const milestonesGrid = pageClone.querySelector('.milestones-grid');
      const advisorTitle = pageClone.querySelector('.advisor-title');
      
      // Set advisor title
      advisorTitle.textContent = advisorLevel.title;
      
      // Add milestones to this page
      const startIndex = i * milestonesPerPage;
      const endIndex = Math.min(startIndex + milestonesPerPage, advisorLevel.milestones.length);
      
      for (let j = startIndex; j < endIndex; j++) {
        const milestone = advisorLevel.milestones[j];
        const milestoneClone = milestoneItemTemplate.content.cloneNode(true);
        
        const milestoneItem = milestoneClone.querySelector('.milestone-item');
        const milestoneTitle = milestoneClone.querySelector('.milestone-title');
        const milestoneDescription = milestoneClone.querySelector('.milestone-description');
        const milestoneNum = milestoneClone.querySelector('.milestone-num');
        const certifiedStamp = milestoneClone.querySelector('.certified-stamp');
        
        // Create a unique ID that includes the advisor level
        const uniqueMilestoneId = `${advisorLevel.level}_${milestone.id}`;
        
        milestoneItem.dataset.id = uniqueMilestoneId;
        milestoneTitle.textContent = milestone.title;
        milestoneDescription.textContent = milestone.description;
        milestoneNum.textContent = j + 1;
        
        // Check if milestone is completed
        // We need to handle the case where the milestone might not exist in currentUser.milestones
        if (currentUser.milestones[uniqueMilestoneId]?.completed) {
          certifiedStamp.classList.add('completed');
        } else {
          certifiedStamp.classList.add('incomplete');
          certifiedStamp.style.opacity = '0.3';
        }
        
        // Add click event to toggle milestone completion
        milestoneItem.addEventListener('click', () => toggleMilestone(uniqueMilestoneId, advisorLevel.level, milestone.title));
        
        milestonesGrid.appendChild(milestoneClone);
      }
      
      milestonesPages.appendChild(pageClone);
    }
  });
  
  // Update progress
  updateProgress();
}

// Toggle milestone completion
function toggleMilestone(milestoneId, advisorLevel, milestoneTitle) {
  // Ensure the milestone exists in the user's data
  if (!currentUser.milestones[milestoneId]) {
    currentUser.milestones[milestoneId] = {
      completed: false,
      completedDate: null
    };
  }
  
  const milestone = currentUser.milestones[milestoneId];
  
  milestone.completed = !milestone.completed;
  milestone.completedDate = milestone.completed ? new Date().toISOString() : null;
  
  // Update UI
  const milestoneItem = document.querySelector(`.milestone-item[data-id="${milestoneId}"]`);
  const certifiedStamp = milestoneItem.querySelector('.certified-stamp');
  
  if (milestone.completed) {
    certifiedStamp.classList.remove('incomplete');
    certifiedStamp.classList.add('completed');
    certifiedStamp.style.opacity = '1';
    showNotification(`${advisorLevel === 'rookie' ? 'Advisor A' : 'Advisor B'} Milestone "${milestoneTitle}" completed!`);
  } else {
    certifiedStamp.classList.remove('completed');
    certifiedStamp.classList.add('incomplete');
    certifiedStamp.style.opacity = '0.3';
    showNotification(`${advisorLevel === 'rookie' ? 'Advisor A' : 'Advisor B'} Milestone "${milestoneTitle}" marked as incomplete.`);
  }
  
  // Update last updated date
  currentUser.lastUpdated = new Date().toISOString();
  displayLastUpdated.textContent = formatDate(currentUser.lastUpdated);
  
  // Update progress
  updateProgress();
  
  // Save user data
  saveUserData();
}

// Update progress bar and text
function updateProgress() {
  // Count completed milestones for the current user's level
  const currentLevelMilestones = Object.keys(currentUser.milestones)
    .filter(key => key.startsWith(currentUser.level));
  
  const completedCount = currentLevelMilestones
    .filter(key => currentUser.milestones[key]?.completed)
    .length;
  
  const totalCount = milestonesData[currentUser.level].length;
  const percentage = (completedCount / totalCount) * 100;
  
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${completedCount} of ${totalCount} milestones completed for your level`;
}

// When creating a new user, initialize milestones for both levels
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

  // Simulate API call
  setTimeout(() => {
    try {
      // Check if user exists
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
        
        // Initialize milestones for BOTH advisor levels as not completed
        Object.entries(milestonesData).forEach(([levelKey, levelMilestones]) => {
          levelMilestones.forEach(milestone => {
            const uniqueMilestoneId = `${levelKey}_${milestone.id}`;
            currentUser.milestones[uniqueMilestoneId] = {
              completed: false,
              completedDate: null
            };
          });
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

// When changing level, we don't reset milestones anymore
function handleModalConfirm() {
  const newAdvisorType = document.getElementById('new-advisor-type').value;
  
  if (newAdvisorType !== currentUser.level) {
    // Change level but don't reset milestones
    currentUser.level = newAdvisorType;
    
    // Update last updated date
    currentUser.lastUpdated = new Date().toISOString();
    
    // Save user data
    saveUserData();
    
    // Reload passport
    loadPassport();
    
    // Show notification
    showNotification('Advisor level changed successfully. Your milestones have been preserved.');
  }
  
  hideModal();
}

// Show change level modal - updated text
function showChangeLevelModal() {
  modalTitle.textContent = 'Change Advisor Level';
  modalBody.innerHTML = `
    <p>Changing your advisor level will update your profile but preserve your milestone progress for both levels.</p>
    <div class="form-group">
      <label for="new-advisor-type">Select New Level:</label>
      <select id="new-advisor-type">
        <option value="rookie" ${currentUser.level === 'rookie' ? 'selected' : ''}>Advisor A (Rookie) (0-1.5 years)</option>
        <option value="experienced" ${currentUser.level === 'experienced' ? 'selected' : ''}>Advisor B (1.5-2 years)</option>
      </select>
    </div>
  `;
  
  modal.classList.remove('hidden');
}
