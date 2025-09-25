// Global variables
let currentUser = null;
let isLoggedIn = false;
let currentPage = 'home';
let currentProfileSection = 'personal';
let profileSections = ['personal', 'education', 'contact', 'experience', 'skills', 'additional'];
let profileData = {};
let selectedInterviewType = null;
let interviewQuestions = [];
let currentQuestionIndex = 0;
let interviewTimer = null;

// Data
const pmInternshipData = {
  "programDetails": {
    "name": "Prime Minister Internship Scheme",
    "duration": "12 months",
    "stipend": "₹5,000/month + ₹6,000 one-time grant",
    "ageLimit": "21-24 years",
    "sectors": ["Banking", "IT Services", "Energy", "Automotive", "Manufacturing", "Healthcare", "Retail", "Logistics"],
    "eligibility": {
      "education": "Class 10+ to Graduation",
      "familyIncome": "Below ₹8 lakh per year",
      "restrictions": "No IIT/IIM/NLU graduates, No family member in government job"
    }
  },
  "mentors": [
    {
      "name": "Arjun Sharma",
      "company": "Microsoft India",
      "role": "Software Engineer",
      "linkedin": "https://linkedin.com/in/arjun-sharma",
      "instagram": "https://instagram.com/arjun_tech"
    },
    {
      "name": "Priya Patel", 
      "company": "Google India",
      "role": "Product Manager",
      "linkedin": "https://linkedin.com/in/priya-patel",
      "instagram": "https://instagram.com/priya_pm"
    },
    {
      "name": "Rahul Gupta",
      "company": "Amazon India", 
      "role": "Business Analyst",
      "linkedin": "https://linkedin.com/in/rahul-gupta",
      "instagram": "https://instagram.com/rahul_analyst"
    },
    {
      "name": "Sneha Reddy",
      "company": "TCS",
      "role": "Data Scientist", 
      "linkedin": "https://linkedin.com/in/sneha-reddy",
      "instagram": "https://instagram.com/sneha_data"
    },
    {
      "name": "Vikram Singh",
      "company": "Infosys",
      "role": "Technical Lead",
      "linkedin": "https://linkedin.com/in/vikram-singh", 
      "instagram": "https://instagram.com/vikram_tech"
    },
    {
      "name": "Ananya Joshi",
      "company": "Wipro",
      "role": "Consultant",
      "linkedin": "https://linkedin.com/in/ananya-joshi",
      "instagram": "https://instagram.com/ananya_consult"
    }
  ],
  "jobs": [
    {
      "title": "Software Engineering Intern",
      "company": "TCS",
      "location": "Mumbai",
      "skills": ["Java", "Python", "SQL"],
      "type": "Full-time"
    },
    {
      "title": "Data Analytics Intern", 
      "company": "Infosys",
      "location": "Bangalore", 
      "skills": ["Python", "SQL", "Tableau"],
      "type": "Full-time"
    },
    {
      "title": "Business Analyst Intern",
      "company": "Wipro",
      "location": "Hyderabad",
      "skills": ["Excel", "PowerBI", "SQL"],
      "type": "Full-time"
    },
    {
      "title": "Product Management Intern",
      "company": "Microsoft",
      "location": "Delhi",
      "skills": ["Analytics", "Communication", "Strategy"],
      "type": "Full-time"
    },
    {
      "title": "Digital Marketing Intern",
      "company": "Google",
      "location": "Mumbai", 
      "skills": ["SEO", "Analytics", "Content Marketing"],
      "type": "Full-time"
    },
    {
      "title": "Financial Analyst Intern",
      "company": "HDFC Bank",
      "location": "Mumbai",
      "skills": ["Finance", "Excel", "Analytics"],
      "type": "Full-time"
    }
  ]
};

// Interview questions by type
const interviewQuestionsData = {
  technical: [
    "Tell me about your experience with programming languages.",
    "How would you approach debugging a complex issue?",
    "Explain the concept of object-oriented programming.",
    "What is your favorite programming language and why?",
    "How do you stay updated with new technologies?"
  ],
  hr: [
    "Tell me about yourself and your interest in this internship.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for our company?",
    "Describe a challenging situation and how you handled it."
  ],
  general: [
    "Tell me about yourself.",
    "Why are you interested in this internship program?",
    "What skills do you bring to this position?",
    "How do you handle stress and pressure?",
    "What questions do you have for us?"
  ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    initializeApp();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
});

function initializeApp() {
  try {
    startAnimatedText();
    populateJobBoard();
    populateMentors();
    setupEventListeners();
    setupScrollAnimations();
    
    // Ensure homepage is visible
    showHomePage();
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}

// Navigation Functions
function goToHome() {
  try {
    showHomePage();
  } catch (error) {
    console.error('Error navigating to home:', error);
  }
}

function showHomePage() {
  try {
    // Hide all overlay pages
    hideAllOverlays();
    
    // Show main content
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    
    // Update current page
    currentPage = 'home';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Successfully navigated to home');
  } catch (error) {
    console.error('Error showing home page:', error);
  }
}

function hideAllOverlays() {
  try {
    // Hide feature pages
    const featurePages = document.getElementById('featurePages');
    if (featurePages) {
      featurePages.classList.add('hidden');
    }
    
    // Hide all individual feature pages
    const allFeaturePages = document.querySelectorAll('.feature-page');
    allFeaturePages.forEach(page => {
      page.classList.remove('active');
      page.classList.add('hidden');
    });
    
    // Hide profile creation
    const profileCreation = document.getElementById('profileCreation');
    if (profileCreation) {
      profileCreation.classList.add('hidden');
    }
    
    // Hide profile card
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
      profileCard.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error hiding overlays:', error);
  }
}

function navigateToFeature(featureId) {
  try {
    console.log('Navigating to feature:', featureId);
    
    // Hide main content
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.style.display = 'none';
    }
    
    // Hide other overlays
    hideAllOverlays();
    
    // Show feature pages container
    const featurePages = document.getElementById('featurePages');
    const targetPage = document.getElementById(featureId);
    
    if (!featurePages || !targetPage) {
      console.error('Feature pages container or target page not found:', featureId);
      showErrorMessage('Feature page not found. Please try again.');
      return;
    }
    
    // Show the feature pages container and target page
    featurePages.classList.remove('hidden');
    targetPage.classList.remove('hidden');
    targetPage.classList.add('active');
    
    // Update current page
    currentPage = featureId;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize page-specific functionality
    setTimeout(() => {
      try {
        if (featureId === 'job-board') {
          populateJobBoard();
        } else if (featureId === 'mentorship') {
          populateMentors();
        }
      } catch (error) {
        console.error('Error initializing page functionality:', error);
      }
    }, 100);
    
    console.log('Successfully navigated to:', featureId);
    
  } catch (error) {
    console.error('Error navigating to feature:', error);
    showErrorMessage('Navigation error. Please try again.');
  }
}

// Animated Text Functions
function startAnimatedText() {
  try {
    const texts = ["Apply Now", "Start Your Career", "Join Excellence", "Build Your Future"];
    let currentIndex = 0;
    const animatedTextElement = document.getElementById('animatedText');
    
    if (!animatedTextElement) {
      console.warn('Animated text element not found');
      return;
    }
    
    // Set initial text
    animatedTextElement.textContent = texts[0];
    animatedTextElement.style.opacity = '1';
    
    setInterval(() => {
      try {
        currentIndex = (currentIndex + 1) % texts.length;
        animatedTextElement.style.opacity = '0';
        
        setTimeout(() => {
          animatedTextElement.textContent = texts[currentIndex];
          animatedTextElement.style.opacity = '1';
        }, 300);
      } catch (error) {
        console.error('Error in animated text interval:', error);
      }
    }, 3000);
    
    console.log('Animated text started successfully');
  } catch (error) {
    console.error('Error starting animated text:', error);
  }
}

// Navigation Helper Functions
function toggleMobileNav() {
  try {
    const navList = document.querySelector('.nav__list');
    if (navList) {
      navList.classList.toggle('mobile-open');
    }
  } catch (error) {
    console.error('Error toggling mobile nav:', error);
  }
}

function scrollToSection(sectionId) {
  try {
    // If we're not on home page, go to home first
    if (currentPage !== 'home') {
      showHomePage();
      // Wait for page transition then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  } catch (error) {
    console.error('Error scrolling to section:', error);
  }
}

// Modal Functions
function showModal(modalId) {
  try {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  } catch (error) {
    console.error('Error showing modal:', error);
  }
}

function hideModal(modalId) {
  try {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  } catch (error) {
    console.error('Error hiding modal:', error);
  }
}

function showLogin() {
  try {
    showModal('loginModal');
  } catch (error) {
    console.error('Error showing login:', error);
  }
}

function showRegister() {
  try {
    showModal('registerModal');
  } catch (error) {
    console.error('Error showing register:', error);
  }
}

// Login Functions
function handleLogin(event) {
  try {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (!email || !password) {
      showErrorMessage('Please fill in all fields');
      return;
    }
    
    // Simulate login
    setTimeout(() => {
      isLoggedIn = true;
      currentUser = { email: email, name: email.split('@')[0] };
      hideModal('loginModal');
      showSuccessMessage('Login successful! Welcome back.');
      updateUIForLoggedInUser();
    }, 1000);
  } catch (error) {
    console.error('Error handling login:', error);
    showErrorMessage('Login failed. Please try again.');
  }
}

function updateUIForLoggedInUser() {
  try {
    // Update navigation to show user name
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      if (link.onclick && link.onclick.toString().includes('showLogin')) {
        link.textContent = currentUser.name;
        link.onclick = null;
      }
      if (link.onclick && link.onclick.toString().includes('showRegister')) {
        link.textContent = 'Logout';
        link.onclick = logout;
      }
    });
  } catch (error) {
    console.error('Error updating UI for logged in user:', error);
  }
}

function logout() {
  try {
    isLoggedIn = false;
    currentUser = null;
    location.reload();
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Registration Functions
function handleRegistration(event) {
  try {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate password match
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
      showErrorMessage('Passwords do not match');
      return;
    }
    
    const userData = Object.fromEntries(formData.entries());
    
    // Simulate registration
    setTimeout(() => {
      hideModal('registerModal');
      isLoggedIn = true;
      currentUser = { email: userData.email, name: userData.fullName };
      updateUIForLoggedInUser();
      
      showSuccessMessage('Registration successful! Would you like to create your profile now?');
      
      // Show option to create profile after a delay
      setTimeout(() => {
        if (confirm('Would you like to create your detailed profile now? This will help you access all features.')) {
          showCreateProfile();
        }
      }, 2000);
      
    }, 1500);
  } catch (error) {
    console.error('Error handling registration:', error);
    showErrorMessage('Registration failed. Please try again.');
  }
}

// Profile Creation Functions
function showCreateProfile() {
  try {
    hideAllOverlays();
    
    // Hide main content
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.style.display = 'none';
    }
    
    // Show profile creation
    const profileCreation = document.getElementById('profileCreation');
    if (profileCreation) {
      profileCreation.classList.remove('hidden');
    }
    
    // Reset to first section
    currentProfileSection = 'personal';
    showProfileSection('personal');
    updateProfileProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    console.error('Error showing create profile:', error);
  }
}

function hideProfileCreation() {
  try {
    const profileCreation = document.getElementById('profileCreation');
    if (profileCreation) {
      profileCreation.classList.add('hidden');
    }
    
    showHomePage();
  } catch (error) {
    console.error('Error hiding profile creation:', error);
  }
}

function showProfileSection(sectionName) {
  try {
    // Update current section
    currentProfileSection = sectionName;
    
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.profile-nav__link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionName) {
        link.classList.add('active');
      }
    });
    
    updateProfileProgress();
    
  } catch (error) {
    console.error('Error showing profile section:', error);
  }
}

function nextProfileSection() {
  try {
    if (validateProfileSection(currentProfileSection)) {
      saveCurrentSectionData();
      
      const currentIndex = profileSections.indexOf(currentProfileSection);
      if (currentIndex < profileSections.length - 1) {
        const nextSection = profileSections[currentIndex + 1];
        showProfileSection(nextSection);
      }
    }
  } catch (error) {
    console.error('Error in next profile section:', error);
  }
}

function prevProfileSection() {
  try {
    saveCurrentSectionData();
    
    const currentIndex = profileSections.indexOf(currentProfileSection);
    if (currentIndex > 0) {
      const prevSection = profileSections[currentIndex - 1];
      showProfileSection(prevSection);
    }
  } catch (error) {
    console.error('Error in prev profile section:', error);
  }
}

function validateProfileSection(sectionName) {
  try {
    const currentSection = document.querySelector(`[data-section="${sectionName}"].profile-section.active`);
    if (!currentSection) return false;
    
    const requiredFields = currentSection.querySelectorAll('[required]');
    
    let isValid = true;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-error)';
        isValid = false;
      } else {
        field.style.borderColor = 'var(--color-border)';
      }
    });
    
    if (!isValid) {
      showErrorMessage('Please fill in all required fields');
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating profile section:', error);
    return false;
  }
}

function saveCurrentSectionData() {
  try {
    const currentSection = document.querySelector(`[data-section="${currentProfileSection}"].profile-section.active`);
    if (!currentSection) return;
    
    const inputs = currentSection.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.name && input.value) {
        profileData[input.name] = input.value;
      }
    });
  } catch (error) {
    console.error('Error saving current section data:', error);
  }
}

function updateProfileProgress() {
  try {
    const completedSections = Object.keys(profileData).length;
    const totalSections = profileSections.length;
    const progressPercentage = Math.min((completedSections / totalSections) * 100, 100);
    
    const progressFill = document.getElementById('profileProgressFill');
    const progressText = document.getElementById('profileProgressText');
    
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = Math.round(progressPercentage);
    }
  } catch (error) {
    console.error('Error updating profile progress:', error);
  }
}

function handleProfileSubmit(event) {
  try {
    event.preventDefault();
    
    // Save current section data
    saveCurrentSectionData();
    
    // Validate all sections have required data
    const requiredFields = ['fullName', 'education', 'phone', 'email', 'experience', 'technicalSkills', 'familyIncome'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      showErrorMessage('Please complete all required sections before submitting.');
      return;
    }
    
    // Generate profile card
    setTimeout(() => {
      generateProfileCard();
      showSuccessMessage('Profile created successfully!');
    }, 1000);
    
  } catch (error) {
    console.error('Error handling profile submit:', error);
    showErrorMessage('Error creating profile. Please try again.');
  }
}

function generateProfileCard() {
  try {
    // Hide profile creation
    const profileCreation = document.getElementById('profileCreation');
    if (profileCreation) {
      profileCreation.classList.add('hidden');
    }
    
    // Show profile card
    const profileCardDisplay = document.getElementById('profileCard');
    if (profileCardDisplay) {
      profileCardDisplay.classList.remove('hidden');
    }
    
    // Populate profile card data
    const profileCardName = document.getElementById('profileCardName');
    const profileCardRole = document.getElementById('profileCardRole');
    const profileCardLocation = document.getElementById('profileCardLocation');
    const profileCardContent = document.getElementById('profileCardContent');
    
    if (profileCardName) {
      profileCardName.textContent = profileData.fullName || 'Full Name';
    }
    
    if (profileCardRole) {
      profileCardRole.textContent = `${profileData.education || 'Graduate'} - ${profileData.preferredIndustry || 'Professional'}`;
    }
    
    if (profileCardLocation) {
      profileCardLocation.textContent = `${profileData.city || 'City'}, ${profileData.state || 'State'}`;
    }
    
    if (profileCardContent) {
      profileCardContent.innerHTML = generateProfileCardContent();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    console.error('Error generating profile card:', error);
  }
}

function generateProfileCardContent() {
  try {
    let content = '';
    
    // Contact Information
    content += `
      <div style="margin-bottom: 24px;">
        <h3 style="color: var(--color-primary); margin-bottom: 12px; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px;">Contact Information</h3>
        <p><strong>Email:</strong> ${profileData.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${profileData.phone || 'Not provided'}</p>
        <p><strong>Address:</strong> ${profileData.address || 'Not provided'}</p>
        ${profileData.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${profileData.linkedin}" target="_blank">View Profile</a></p>` : ''}
      </div>
    `;
    
    // Education
    content += `
      <div style="margin-bottom: 24px;">
        <h3 style="color: var(--color-primary); margin-bottom: 12px; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px;">Education</h3>
        <p><strong>Highest Education:</strong> ${profileData.education || 'Not provided'}</p>
        ${profileData.institution ? `<p><strong>Institution:</strong> ${profileData.institution}</p>` : ''}
        ${profileData.yearOfCompletion ? `<p><strong>Year:</strong> ${profileData.yearOfCompletion}</p>` : ''}
        ${profileData.grade ? `<p><strong>Grade:</strong> ${profileData.grade}</p>` : ''}
      </div>
    `;
    
    // Experience
    content += `
      <div style="margin-bottom: 24px;">
        <h3 style="color: var(--color-primary); margin-bottom: 12px; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px;">Experience</h3>
        <p><strong>Experience Level:</strong> ${profileData.experience || 'Not provided'}</p>
        ${profileData.previousCompany ? `<p><strong>Previous Company:</strong> ${profileData.previousCompany}</p>` : ''}
        ${profileData.previousRole ? `<p><strong>Previous Role:</strong> ${profileData.previousRole}</p>` : ''}
      </div>
    `;
    
    // Skills
    content += `
      <div style="margin-bottom: 24px;">
        <h3 style="color: var(--color-primary); margin-bottom: 12px; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px;">Skills</h3>
        ${profileData.technicalSkills ? `<p><strong>Technical Skills:</strong> ${profileData.technicalSkills}</p>` : ''}
        ${profileData.softSkills ? `<p><strong>Soft Skills:</strong> ${profileData.softSkills}</p>` : ''}
        ${profileData.preferredIndustry ? `<p><strong>Preferred Industry:</strong> ${profileData.preferredIndustry}</p>` : ''}
      </div>
    `;
    
    // Additional Information
    if (profileData.careerObjectives || profileData.familyIncome) {
      content += `
        <div style="margin-bottom: 24px;">
          <h3 style="color: var(--color-primary); margin-bottom: 12px; border-bottom: 2px solid var(--color-primary); padding-bottom: 8px;">Additional Information</h3>
          ${profileData.careerObjectives ? `<p><strong>Career Objectives:</strong> ${profileData.careerObjectives}</p>` : ''}
          ${profileData.familyIncome ? `<p><strong>Family Income:</strong> ${profileData.familyIncome}</p>` : ''}
        </div>
      `;
    }
    
    return content;
  } catch (error) {
    console.error('Error generating profile card content:', error);
    return '<p>Error loading profile content</p>';
  }
}

function hideProfileCard() {
  try {
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
      profileCard.classList.add('hidden');
    }
    
    showHomePage();
  } catch (error) {
    console.error('Error hiding profile card:', error);
  }
}

function editProfile() {
  try {
    showCreateProfile();
  } catch (error) {
    console.error('Error editing profile:', error);
  }
}

function downloadProfile() {
  try {
    showSuccessMessage('Profile download feature would be implemented in the backend!');
  } catch (error) {
    console.error('Error downloading profile:', error);
  }
}

// Resume Generator Functions
function generateResume() {
  try {
    const form = document.getElementById('resumeForm');
    const resumePreview = document.getElementById('resumePreview');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (!form || !resumePreview) return;
    
    const formData = new FormData(form);
    
    let resumeHtml = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid var(--patriotic-saffron); padding-bottom: 15px;">
        <h2 style="color: var(--patriotic-navy); margin-bottom: 5px;">${formData.get('name') || 'Your Name'}</h2>
        <p style="margin: 5px 0;">${formData.get('email') || 'email@example.com'} | ${formData.get('phone') || '+91 XXXXXXXXXX'}</p>
        <p style="margin: 5px 0;">${formData.get('location') || 'City, State'}</p>
      </div>
    `;
    
    // Professional Summary
    if (formData.get('summary')) {
      resumeHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: var(--patriotic-saffron); border-bottom: 1px solid var(--patriotic-saffron); padding-bottom: 5px;">PROFESSIONAL SUMMARY</h3>
          <p>${formData.get('summary')}</p>
        </div>
      `;
    }
    
    // Skills
    if (formData.get('skills')) {
      resumeHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: var(--patriotic-saffron); border-bottom: 1px solid var(--patriotic-saffron); padding-bottom: 5px;">SKILLS</h3>
          <p>${formData.get('skills')}</p>
        </div>
      `;
    }
    
    resumePreview.innerHTML = resumeHtml;
    
    if (downloadBtn) {
      downloadBtn.style.display = 'inline-flex';
    }
    
    showSuccessMessage('Resume generated successfully!');
  } catch (error) {
    console.error('Error generating resume:', error);
    showErrorMessage('Error generating resume. Please try again.');
  }
}

function downloadResume() {
  try {
    showSuccessMessage('Resume download feature would be implemented in the backend!');
  } catch (error) {
    console.error('Error downloading resume:', error);
  }
}

// Event Listeners Setup
function setupEventListeners() {
  try {
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // File upload for ATS checker
    const resumeUpload = document.getElementById('resumeUpload');
    const uploadArea = document.getElementById('uploadArea');
    
    if (resumeUpload && uploadArea) {
      resumeUpload.addEventListener('change', handleFileUpload);
      
      uploadArea.addEventListener('click', () => {
        resumeUpload.click();
      });
      
      // Drag and drop functionality
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-primary)';
        uploadArea.style.background = 'var(--patriotic-bg-1)';
      });
      
      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--color-border)';
        uploadArea.style.background = 'var(--color-surface)';
      });
      
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-border)';
        uploadArea.style.background = 'var(--color-surface)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          resumeUpload.files = files;
          handleFileUpload({ target: { files: files } });
        }
      });
    }
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

// ATS Checker Functions
function handleFileUpload(event) {
  try {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadArea = document.getElementById('uploadArea');
    
    if (fileInfo && fileName && fileSize && uploadArea) {
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      
      uploadArea.style.display = 'none';
      fileInfo.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
  }
}

function formatFileSize(bytes) {
  try {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  } catch (error) {
    console.error('Error formatting file size:', error);
    return 'Unknown size';
  }
}

function analyzeResume() {
  try {
    const resultsSection = document.getElementById('resultsSection');
    const scoreValue = document.getElementById('scoreValue');
    
    if (!resultsSection || !scoreValue) return;
    
    showSuccessMessage('Analyzing your resume...');
    
    // Simulate ATS analysis
    setTimeout(() => {
      try {
        const score = Math.floor(Math.random() * 20) + 75; // Random score between 75-95
        scoreValue.textContent = score;
        
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        showSuccessMessage('ATS analysis completed!');
      } catch (error) {
        console.error('Error in analyze resume timeout:', error);
      }
    }, 2000);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    showErrorMessage('Error analyzing resume. Please try again.');
  }
}

// Job Board Functions
function populateJobBoard() {
  try {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = ''; // Clear existing content
    
    pmInternshipData.jobs.forEach(job => {
      const jobCard = createJobCard(job);
      jobsGrid.appendChild(jobCard);
    });
  } catch (error) {
    console.error('Error populating job board:', error);
  }
}

function createJobCard(job) {
  try {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    jobCard.innerHTML = `
      <div class="job-card__header">
        <div>
          <h3 class="job-card__title">${job.title}</h3>
          <p class="job-card__company">${job.company}</p>
          <p class="job-card__location">
            <i class="fas fa-map-marker-alt"></i>
            ${job.location}
          </p>
        </div>
      </div>
      <div class="job-card__skills">
        ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      <div class="job-card__footer">
        <span class="job-type">${job.type}</span>
        <button class="btn btn--primary btn--sm" onclick="applyToJob('${job.title}', '${job.company}')">
          Apply Now
        </button>
      </div>
    `;
    
    return jobCard;
  } catch (error) {
    console.error('Error creating job card:', error);
    return document.createElement('div'); // Return empty div as fallback
  }
}

function applyToJob(title, company) {
  try {
    if (!isLoggedIn) {
      showErrorMessage('Please login to apply for jobs.');
      showLogin();
      return;
    }
    
    showSuccessMessage(`Application submitted for ${title} at ${company}!`);
  } catch (error) {
    console.error('Error applying to job:', error);
  }
}

// Live Interview Functions
function selectInterviewType(type) {
  try {
    selectedInterviewType = type;
    
    // Update UI
    const cards = document.querySelectorAll('.interview-type-card');
    cards.forEach(card => {
      card.classList.remove('selected');
    });
    
    const selectedCard = event.target.closest('.interview-type-card');
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }
    
    // Enable start button
    const startBtn = document.getElementById('startInterviewBtn');
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = `Start ${type.charAt(0).toUpperCase() + type.slice(1)} Interview`;
    }
  } catch (error) {
    console.error('Error selecting interview type:', error);
  }
}

function startInterview() {
  try {
    if (!selectedInterviewType) return;
    
    if (!isLoggedIn) {
      showErrorMessage('Please login to start interviews.');
      showLogin();
      return;
    }
    
    showSuccessMessage('Interview simulation started! This would connect to video platform in production.');
    
  } catch (error) {
    console.error('Error starting interview:', error);
  }
}

// Mentorship Functions
function populateMentors() {
  try {
    const mentorsGrid = document.getElementById('mentorsGrid');
    if (!mentorsGrid) return;
    
    mentorsGrid.innerHTML = ''; // Clear existing content
    
    pmInternshipData.mentors.forEach(mentor => {
      const mentorCard = createMentorCard(mentor);
      mentorsGrid.appendChild(mentorCard);
    });
  } catch (error) {
    console.error('Error populating mentors:', error);
  }
}

function createMentorCard(mentor) {
  try {
    const mentorCard = document.createElement('div');
    mentorCard.className = 'mentor-card';
    
    mentorCard.innerHTML = `
      <div class="mentor-card__avatar">
        <i class="fas fa-user"></i>
      </div>
      <h3 class="mentor-card__name">${mentor.name}</h3>
      <p class="mentor-card__role">${mentor.role}</p>
      <p class="mentor-card__company">${mentor.company}</p>
      <div class="mentor-card__links">
        <a href="${mentor.linkedin}" target="_blank" class="social-link social-link--linkedin">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="${mentor.instagram}" target="_blank" class="social-link social-link--instagram">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
      <button class="btn btn--primary btn--full-width" onclick="connectWithMentor('${mentor.name}')">
        <i class="fas fa-comments"></i> Connect
      </button>
    `;
    
    return mentorCard;
  } catch (error) {
    console.error('Error creating mentor card:', error);
    return document.createElement('div'); // Return empty div as fallback
  }
}

function connectWithMentor(mentorName) {
  try {
    if (!isLoggedIn) {
      showErrorMessage('Please login to connect with mentors.');
      showLogin();
      return;
    }
    
    showSuccessMessage(`Connection request sent to ${mentorName}!`);
  } catch (error) {
    console.error('Error connecting with mentor:', error);
  }
}

// Utility Functions
function showSuccessMessage(message) {
  try {
    showNotification(message, 'success');
  } catch (error) {
    console.error('Error showing success message:', error);
  }
}

function showErrorMessage(message) {
  try {
    showNotification(message, 'error');
  } catch (error) {
    console.error('Error showing error message:', error);
  }
}

function showNotification(message, type) {
  try {
    // Remove existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification__close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-surface);
      border: 1px solid ${type === 'success' ? 'var(--patriotic-green)' : 'var(--color-error)'};
      border-left: 4px solid ${type === 'success' ? 'var(--patriotic-green)' : 'var(--color-error)'};
      border-radius: var(--radius-base);
      padding: var(--space-16);
      box-shadow: var(--shadow-lg);
      z-index: 3000;
      max-width: 400px;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Scroll Animations
function setupScrollAnimations() {
  try {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        try {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        } catch (error) {
          console.error('Error in intersection observer:', error);
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.stat-card, .story-card, .highlight-card, .gallery-item, .partner-card, .achievement-card, .testimonial-card, .article-card'
    );
    animatedElements.forEach(el => {
      try {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      } catch (error) {
        console.error('Error setting up animation for element:', error);
      }
    });
  } catch (error) {
    console.error('Error setting up scroll animations:', error);
  }
}