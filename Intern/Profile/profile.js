// Profile Creation Application
class ProfileCreator {
    constructor() {
        this.currentSection = 0;
        this.sections = [
            'personal', 'education', 'contact', 'address', 
            'email-social', 'experience', 'skills', 'additional'
        ];
        this.sectionData = {
            personal: { title: 'Personal Information', icon: '👤', completed: false },
            education: { title: 'Education Details', icon: '🎓', completed: false },
            contact: { title: 'Contact Information', icon: '📱', completed: false },
            address: { title: 'Current Address', icon: '📍', completed: false },
            'email-social': { title: 'Email & LinkedIn', icon: '📧', completed: false },
            experience: { title: 'Professional Experience', icon: '💼', completed: false },
            skills: { title: 'Skills & Competencies', icon: '🛠️', completed: false },
            additional: { title: 'Gender & Additional Info', icon: 'ℹ️', completed: false }
        };
        this.formData = {};
        this.autoSaveInterval = null;
        this.init();
    }
    init() {
        this.renderSidebarNavigation();
        this.setupEventListeners();
        this.setupSkillSelectors();
        this.loadSavedData();
        
        const profileState = localStorage.getItem('profileState');
        if (profileState === 'created' && Object.keys(this.formData).length > 0) {
            this.displayCardView();
        } else {
            this.displayFormView();
            this.showSection(0);
            this.updateProgress();
        }
        
        this.startAutoSave();
        this.setupDateField();
    }
    setupDateField() {
        const dobInput = document.getElementById('dateOfBirth');
        if (dobInput) {
            const today = new Date();
            const maxDate = today.toISOString().split('T')[0];
            dobInput.setAttribute('max', maxDate);
            
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
            dobInput.setAttribute('min', minDate.toISOString().split('T')[0]);
            
            dobInput.addEventListener('change', (e) => {
                this.calculateAge();
                this.saveCurrentSectionData();
                this.clearError(e.target);
            });
            
            dobInput.addEventListener('blur', (e) => this.validateField(e.target));
        }
    }
    renderSidebarNavigation() {
        const sidebarNav = document.getElementById('sidebarNav');
        if (!sidebarNav) return;
        sidebarNav.innerHTML = '';
        this.sections.forEach((section, index) => {
            const data = this.sectionData[section];
            const navItem = document.createElement('div');
            navItem.className = `nav-item ${index === this.currentSection ? 'active' : ''} ${data.completed ? 'completed' : ''}`;
            navItem.onclick = () => this.goToSection(index);
            navItem.innerHTML = `
                <div class="nav-icon">${data.icon}</div>
                <div class="nav-text">${data.title}</div>
                <div class="nav-status">
                    ${data.completed ? '<i class="fas fa-check check-icon"></i>' : `${index + 1}/8`}
                </div>`;
            sidebarNav.appendChild(navItem);
        });
    }
    setupEventListeners() {
        const photoInput = document.getElementById('profilePhoto');
        if (photoInput) photoInput.addEventListener('change', this.handlePhotoUpload.bind(this));
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('form-control')) this.validateField(e.target);
        }, true);
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-control')) {
                this.clearError(e.target);
                this.saveCurrentSectionData();
            }
        }, true);
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.saveCurrentSectionData();
                this.clearError(e.target);
            }
        });
    }
    setupSkillSelectors() {
        const skillsData = {
            technicalSkills: ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "MongoDB", "AWS", "Docker", "Git"],
            softSkills: ["Communication", "Leadership", "Teamwork", "Problem Solving", "Time Management", "Creativity", "Adaptability", "Critical Thinking"],
            programmingLanguages: ["JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin"],
            tools: ["VS Code", "Git", "Docker", "AWS", "Azure", "Figma", "Photoshop", "Excel", "PowerBI", "Tableau"],
            languages: ["Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", "Urdu", "Kannada", "Malayalam", "Punjabi", "Assamese", "Odia", "Sanskrit"]
        };
        Object.entries(skillsData).forEach(([selectorId, skills]) => {
            const selector = document.getElementById(`${selectorId}Selector`);
            if (selector) {
                selector.innerHTML = '';
                skills.forEach(skill => {
                    const skillItem = document.createElement('div');
                    skillItem.className = 'skill-item';
                    skillItem.onclick = () => this.toggleSkill(skillItem, selectorId, skill);
                    skillItem.innerHTML = `
                        <div class="checkbox"></div>
                        <span>${skill}</span>
                        <input type="checkbox" name="${selectorId}" value="${skill}" class="hidden">`;
                    selector.appendChild(skillItem);
                });
            }
        });
    }
    
    toggleSkill(skillItem) {
        skillItem.classList.toggle('selected');
        const checkbox = skillItem.querySelector('input[type="checkbox"]');
        checkbox.checked = skillItem.classList.contains('selected');
        this.saveCurrentSectionData();
        const errorElement = document.getElementById(`error-${checkbox.name}`);
        if (errorElement && checkbox.checked) {
            errorElement.classList.remove('show');
        }
    }
    
    calculateAge() {
        const dobInput = document.getElementById('dateOfBirth');
        const ageInput = document.getElementById('age');
        if (dobInput && dobInput.value && ageInput) {
            try {
                const dob = new Date(dobInput.value);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
                ageInput.value = (age >= 0 && age <= 120) ? age : '';
            } catch (error) {
                ageInput.value = '';
            }
        }
    }
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('photoPreview');
        const previewImage = document.getElementById('previewImage');
        if (!file || !preview || !previewImage) return;
        if (file.size > 5 * 1024 * 1024) return this.showNotification('Please select a file smaller than 5MB', 'error');
        if (!file.type.startsWith('image/')) return this.showNotification('Please select a valid image file', 'error');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
            this.formData['profilePhotoSrc'] = e.target.result;
            this.saveCurrentSectionData();
        };
        reader.readAsDataURL(file);
    }
    validateField(field) {
        if (!field || !field.name) return true;
        const errorElement = document.getElementById(`error-${field.name}`);
        let isValid = true;
        let errorMessage = '';
        field.classList.remove('error');
        if (errorElement) errorElement.classList.remove('show');
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Further validation logic can be added here...
        if (!isValid && errorElement) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
        return isValid;
    }
    clearError(field) {
        if (!field) return;
        field.classList.remove('error');
        const errorElement = document.getElementById(`error-${field.name}`);
        if (errorElement) errorElement.classList.remove('show');
    }
    validateSection(sectionIndex) {
        const sectionId = this.sections[sectionIndex];
        const sectionElement = document.getElementById(`section-${sectionId}`);
        if (!sectionElement) return false;
        let isValid = true;
        sectionElement.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        if (sectionId === 'skills') {
            if (sectionElement.querySelectorAll('input[name="technicalSkills"]:checked').length === 0) {
                this.showError('error-technicalSkills', 'Please select at least one technical skill');
                isValid = false;
            }
            if (sectionElement.querySelectorAll('input[name="softSkills"]:checked').length === 0) {
                this.showError('error-softSkills', 'Please select at least one soft skill');
                isValid = false;
            }
        }
        if (sectionId === 'additional' && !sectionElement.querySelector('input[name="gender"]:checked')) {
            this.showError('error-gender', 'Please select your gender');
            isValid = false;
        }
        return isValid;
    }
    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    goToSection(index) {
        this.saveCurrentSectionData();
        if (index > this.currentSection && !this.validateSection(this.currentSection)) {
            return this.showNotification('Please complete all required fields before proceeding', 'error');
        }
        this.showSection(index);
    }
    showSection(index) {
        document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
        const targetSection = document.getElementById(`section-${this.sections[index]}`);
        if (targetSection) targetSection.classList.remove('hidden', 'active'); // Ensure clean state
        if (targetSection) targetSection.classList.add('active');
        
        this.currentSection = index;
        this.renderSidebarNavigation();
        
        const formContainer = document.querySelector('.form-container');
        if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    nextSection() {
        if (!this.validateSection(this.currentSection)) {
            return this.showNotification('Please complete all required fields', 'error');
        }
        this.saveCurrentSectionData();
        this.markSectionCompleted(this.currentSection);
        if (this.currentSection < this.sections.length - 1) {
            this.showSection(this.currentSection + 1);
        }
        this.updateProgress();
        this.showNotification('Section completed successfully!', 'success');
    }
    prevSection() {
        this.saveCurrentSectionData();
        if (this.currentSection > 0) this.showSection(this.currentSection - 1);
    }
    markSectionCompleted(index) {
        const sectionId = this.sections[index];
        this.sectionData[sectionId].completed = true;
        this.renderSidebarNavigation();
        this.updateProgress();
    }
    saveCurrentSectionData() {
         const currentSectionId = this.sections[this.currentSection];
         const sectionElement = document.getElementById(`section-${currentSectionId}`);
         if (!sectionElement) return;
         sectionElement.querySelectorAll('input, select, textarea').forEach(input => {
             const name = input.name;
             if (!name) return;
             if (input.type === 'checkbox') {
                 if (!this.formData[name]) this.formData[name] = [];
                 const values = Array.from(sectionElement.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
                 this.formData[name] = values;
             } else if (input.type === 'radio') {
                 if (input.checked) this.formData[name] = input.value;
             } else if (input.type !== 'file') {
                 this.formData[name] = input.value;
             }
         });
         try {
             localStorage.setItem('profileData', JSON.stringify(this.formData));
             localStorage.setItem('sectionData', JSON.stringify(this.sectionData));
         } catch (e) { console.error("Failed to save to localStorage", e); }
    }
    loadSavedData() {
        try {
            const savedData = localStorage.getItem('profileData');
            const savedSectionData = localStorage.getItem('sectionData');
            if (savedData) this.formData = JSON.parse(savedData);
            if (savedSectionData) this.sectionData = JSON.parse(savedSectionData);
        } catch (e) {
            console.error('Failed to load data from localStorage', e);
            this.formData = {};
            this.sectionData = {}; // Reset to default if corrupted
        }
         setTimeout(() => this.populateForm(), 50);
    }
    populateForm() {
         Object.entries(this.formData).forEach(([name, value]) => {
             const elements = document.getElementsByName(name);
             if (!elements) return;
             elements.forEach(element => {
                 try {
                    if (element.type === 'checkbox') {
                         if (Array.isArray(value) && value.includes(element.value)) {
                             element.checked = true;
                             const skillItem = element.closest('.skill-item');
                             if (skillItem) skillItem.classList.add('selected');
                         }
                     } else if (element.type === 'radio') {
                         if (element.value === value) element.checked = true;
                     } else if (element.type !== 'file') {
                         element.value = value || '';
                         if (name === 'dateOfBirth') this.calculateAge();
                     }
                 } catch (e) { console.error(`Error populating field ${name}`, e); }
             });
         });
         if (this.formData.profilePhotoSrc) {
             const previewImage = document.getElementById('previewImage');
             const photoPreview = document.getElementById('photoPreview');
             if(previewImage) previewImage.src = this.formData.profilePhotoSrc;
             if(photoPreview) photoPreview.style.display = 'block';
         }
    }
    
    updateProgress() {
        const completedCount = Object.values(this.sectionData).filter(s => s.completed).length;
        const percentage = Math.round((completedCount / this.sections.length) * 100);
        
        document.getElementById('mainProgressFill').style.width = `${percentage}%`;
        document.getElementById('completedSections').textContent = completedCount;
        document.getElementById('progressPercentage').textContent = `${percentage}%`;
        
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            const degrees = (percentage / 100) * 360;
            progressCircle.style.background = `conic-gradient(var(--color-primary) ${degrees}deg, var(--color-border) ${degrees}deg)`;
        }
    }
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => this.saveCurrentSectionData(), 30000);
    }
    
    displayFormView() {
        document.getElementById('form-view').classList.remove('hidden');
        document.getElementById('card-view-container').classList.add('hidden');
        document.getElementById('page-title').textContent = 'Create Your Profile';
        document.getElementById('page-subtitle').textContent = 'Complete all sections to access internship opportunities and generate your professional profile card';
        document.getElementById('progress-container').classList.remove('hidden');
    }
    displayCardView() {
        document.getElementById('form-view').classList.add('hidden');
        document.getElementById('card-view-container').classList.remove('hidden');
        document.getElementById('page-title').textContent = 'Your Professional Profile';
        document.getElementById('page-subtitle').textContent = 'Your profile is complete. You can now view or edit it.';
        document.getElementById('progress-container').classList.add('hidden');
        this.renderProfileCard();
    }
    generateProfileCard() {
        this.saveCurrentSectionData();
        let allValid = true;
        const invalidSections = [];
        for (let i = 0; i < this.sections.length; i++) {
            if (!this.validateSection(i)) {
                allValid = false;
                invalidSections.push(this.sectionData[this.sections[i]].title);
            }
        }
        if (!allValid) return this.showNotification(`Please complete required fields in: ${invalidSections.join(', ')}`, 'error');
        this.sections.forEach((_, index) => this.markSectionCompleted(index));
        localStorage.setItem('profileState', 'created');
        this.displayCardView();
        this.showNotification('Profile card generated successfully!', 'success');
    }
    renderProfileCard() {
        const container = document.getElementById('card-view-container');
        if (!container) return;
        const data = this.formData;
        const initials = data.fullName ? data.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
        const skillsHTML = (skills, title) => {
            if (!skills || skills.length === 0) return '';
            return `<div><h4 class="profile-card-new__section-title">${title}</h4><div class="skill-tags">${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div></div>`;
        };
        container.innerHTML = `
            <div class="profile-card-new">
                <div class="profile-card-header-actions">
                     <button class="btn btn--outline" onclick="editProfile()">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                </div>
                <div class="profile-card-new-layout">
                    <div class="profile-card-new__left">
                        <div class="profile-card-new__initials">
                            ${data.profilePhotoSrc ? `<img src="${data.profilePhotoSrc}" alt="Profile photo">` : initials}
                        </div>
                        <h3 class="profile-card-new__name">${data.fullName || 'N/A'}</h3>
                        <p class="profile-card-new__education">${data.institution || 'Institution not provided'}</p>
                    </div>
                    <div class="profile-card-new__right">
                        <div class="profile-card-new__detail-item"><i class="fas fa-user"></i><span>${data.gender || 'N/A'}</span></div>
                        <div class="profile-card-new__detail-item"><i class="fas fa-envelope"></i><span>${data.primaryEmail || 'N/A'}</span></div>
                        <div class="profile-card-new__detail-item"><i class="fas fa-phone"></i><span>${data.mobileNumber || 'N/A'}</span></div>
                        <div class="profile-card-new__detail-item"><i class="fas fa-map-marker-alt"></i><span>${data.streetAddress || 'Address not provided'}</span></div>
                        ${data.linkedinProfile ? `<div class="profile-card-new__detail-item"><i class="fab fa-linkedin"></i><a href="${data.linkedinProfile}" target="_blank" style="color: var(--color-primary); text-decoration: underline;">LinkedIn Profile</a></div>` : ''}
                    </div>
                </div>
                <hr class="profile-card-new__divider">
                <div class="profile-card-new-body">
                     ${data.experienceYears && data.experienceYears !== 'Fresher' ? `<div><h4 class="profile-card-new__section-title">Experience</h4><p>${data.role || 'Role'} at ${data.previousCompany || 'Company'} (${data.duration || 'N/A'})</p><p style="color: var(--color-text-secondary);">${data.responsibilities || ''}</p></div>` : ''}
                     ${skillsHTML(data.technicalSkills, 'Technical Skills')}
                     ${skillsHTML(data.softSkills, 'Soft Skills')}
                     ${skillsHTML(data.programmingLanguages, 'Programming Languages')}
                     ${skillsHTML(data.tools, 'Tools & Technologies')}
                </div>
            </div>`;
    }
    editProfile() {
        this.displayFormView();
        this.showNotification('You can now edit your profile.', 'success');
    }
    resetProfile() {
        if (confirm('Are you sure you want to reset all profile data? This action cannot be undone.')) {
            try {
                localStorage.removeItem('profileData');
                localStorage.removeItem('sectionData');
                localStorage.removeItem('profileState');
                location.reload();
            } catch (error) {
                this.showNotification('Error resetting profile. Please try again.', 'error');
            }
        }
    }
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification show ${type}`;
            setTimeout(() => this.hideNotification(), 5000);
        }
    }
    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) notification.classList.remove('show');
    }
}
// Global functions for button clicks
function nextSection() { window.profileCreator?.nextSection(); }
function prevSection() { window.profileCreator?.prevSection(); }
function generateProfileCard() { window.profileCreator?.generateProfileCard(); }
function editProfile() { window.profileCreator?.editProfile(); }
function resetProfile() { window.profileCreator?.resetProfile(); }
function hideNotification() { window.profileCreator?.hideNotification(); }
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        window.profileCreator = new ProfileCreator();
    } catch (error) {
        console.error('Error initializing Profile Creator:', error);
    }
});
// Handle page unload to save data
window.addEventListener('beforeunload', function() {
    window.profileCreator?.saveCurrentSectionData();
});