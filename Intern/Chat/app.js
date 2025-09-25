// Global variables
let isTyping = false;
let chatHistory = [];

// Real PM Internship Scheme and Government Internship data
const realInternshipData = {
  "pm_scheme": [
    {
      "title": "PM Internship Scheme - Software Development",
      "department": "Ministry of Corporate Affairs",
      "location": "Delhi, Mumbai, Bengaluru, Hyderabad",
      "duration": "12 months",
      "stipend": "₹5,000/month + ₹6,000 one-time grant",
      "type": "Full-time",
      "skills": ["Programming", "Software Development", "Web Technologies"],
      "diversityTags": ["Government Initiative", "Top 500 Companies", "Career Development"],
      "applyUrl": "https://www.pminternship.mca.gov.in/",
      "description": "Official PM Internship Scheme offering internships in India's top 500 companies with government backing.",
      "eligibility": "21-24 years, Indian citizen, Graduate/Diploma holder"
    },
    {
      "title": "PM Internship Scheme - Data Analytics",
      "department": "Ministry of Corporate Affairs", 
      "location": "Delhi, Mumbai, Bengaluru, Chennai",
      "duration": "12 months",
      "stipend": "₹5,000/month + ₹6,000 one-time grant",
      "type": "Full-time",
      "skills": ["Data Analysis", "Statistics", "Python", "SQL"],
      "diversityTags": ["Government Initiative", "Data Science Focus", "Industry Exposure"],
      "applyUrl": "https://www.pminternship.mca.gov.in/",
      "description": "PM Internship opportunities in data analytics and business intelligence roles.",
      "eligibility": "21-24 years, Indian citizen, Graduate in relevant field"
    },
    {
      "title": "PM Internship Scheme - Digital Marketing",
      "department": "Ministry of Corporate Affairs",
      "location": "Delhi, Mumbai, Pune, Kolkata",
      "duration": "12 months", 
      "stipend": "₹5,000/month + ₹6,000 one-time grant",
      "type": "Full-time",
      "skills": ["Digital Marketing", "Social Media", "Content Creation", "Analytics"],
      "diversityTags": ["Government Initiative", "Marketing Focus", "Creative Opportunities"],
      "applyUrl": "https://www.pminternship.mca.gov.in/",
      "description": "PM Internship for digital marketing roles in top Indian companies.",
      "eligibility": "21-24 years, Indian citizen, Any graduate"
    }
  ],
  "niti_aayog": [
    {
      "title": "NITI Aayog Policy Research Internship",
      "department": "NITI Aayog",
      "location": "New Delhi",
      "duration": "2-6 months",
      "stipend": "₹10,000/month",
      "type": "Research-focused",
      "skills": ["Policy Research", "Data Analysis", "Report Writing", "Economics"],
      "diversityTags": ["Policy Making", "Government Think Tank", "Research Excellence"],
      "applyUrl": "https://www.niti.gov.in/internship",
      "description": "Work directly with NITI Aayog's verticals on policy research and analysis.",
      "eligibility": "Graduate/Postgraduate students from recognized universities"
    },
    {
      "title": "NITI Aayog Technology & Innovation Internship", 
      "department": "NITI Aayog",
      "location": "New Delhi",
      "duration": "3-6 months",
      "stipend": "₹10,000/month",
      "type": "Technology-focused",
      "skills": ["Technology Research", "Innovation", "AI/ML", "Digital Solutions"],
      "diversityTags": ["Innovation Hub", "Tech Policy", "Future Technologies"],
      "applyUrl": "https://www.niti.gov.in/internship",
      "description": "Focus on technology policy and innovation initiatives at national level.",
      "eligibility": "Engineering/Technology students and graduates"
    }
  ],
  "mea": [
    {
      "title": "MEA Diplomatic Affairs Internship",
      "department": "Ministry of External Affairs",
      "location": "New Delhi",
      "duration": "3-6 months",
      "stipend": "₹8,000/month", 
      "type": "Diplomatic",
      "skills": ["International Relations", "Diplomacy", "Research", "Communication"],
      "diversityTags": ["Foreign Affairs", "Diplomatic Experience", "Global Exposure"],
      "applyUrl": "https://internship.mea.gov.in/internship",
      "description": "Gain experience in India's foreign policy and diplomatic operations.",
      "eligibility": "Graduate with minimum 60% marks, Indian citizen"
    },
    {
      "title": "MEA Consular Services Internship",
      "department": "Ministry of External Affairs",
      "location": "New Delhi, Regional Offices",
      "duration": "3-4 months",
      "stipend": "₹8,000/month",
      "type": "Administrative",
      "skills": ["Administration", "Public Service", "Documentation", "Customer Service"],
      "diversityTags": ["Citizen Services", "International Operations", "Public Administration"],
      "applyUrl": "https://internship.mea.gov.in/internship",
      "description": "Support consular operations and citizen services worldwide.",
      "eligibility": "Graduate in any discipline, Indian citizen"
    }
  ],
  "ministry_finance": [
    {
      "title": "Ministry of Finance - Economic Research",
      "department": "Ministry of Finance",
      "location": "New Delhi",
      "duration": "4-6 months",
      "stipend": "₹12,000/month",
      "type": "Research",
      "skills": ["Economics", "Financial Analysis", "Statistics", "Research"],
      "diversityTags": ["Economic Policy", "Financial Markets", "Government Finance"],
      "applyUrl": "https://finmin.nic.in/",
      "description": "Research internship focusing on economic policy and financial analysis.",
      "eligibility": "Economics/Finance graduates with strong analytical skills"
    }
  ],
  "rbi": [
    {
      "title": "RBI Banking & Finance Internship",
      "department": "Reserve Bank of India",
      "location": "Mumbai, Delhi, Chennai, Kolkata",
      "duration": "2-3 months",
      "stipend": "₹15,000/month",
      "type": "Banking",
      "skills": ["Banking", "Finance", "Monetary Policy", "Regulation"],
      "diversityTags": ["Central Banking", "Financial Regulation", "Monetary Policy"],
      "applyUrl": "https://www.rbi.org.in/",
      "description": "Experience central banking operations and financial regulation.",
      "eligibility": "Finance/Economics graduates, excellent academic record"
    }
  ],
  "sebi": [
    {
      "title": "SEBI Capital Markets Internship",
      "department": "Securities Exchange Board of India",
      "location": "Mumbai, Delhi",
      "duration": "2-4 months",
      "stipend": "₹12,000/month",
      "type": "Regulatory",
      "skills": ["Capital Markets", "Securities Law", "Financial Analysis", "Compliance"],
      "diversityTags": ["Market Regulation", "Securities Law", "Financial Markets"],
      "applyUrl": "https://www.sebi.gov.in/",
      "description": "Understand securities market regulation and investor protection.",
      "eligibility": "Law/Finance/Economics graduates"
    }
  ],
  "digital_india": [
    {
      "title": "Digital India Technology Internship",
      "department": "Ministry of Electronics & IT",
      "location": "Delhi, Bengaluru, Hyderabad",
      "duration": "3-6 months",
      "stipend": "₹8,000/month",
      "type": "Technology",
      "skills": ["Web Development", "Digital Governance", "E-Government", "Technology"],
      "diversityTags": ["Digital Transformation", "E-Governance", "Technology Innovation"],
      "applyUrl": "https://digitalindia.gov.in/",
      "description": "Work on digital governance initiatives and technology solutions.",
      "eligibility": "Engineering/Technology students and graduates"
    }
  ],
  "women_child_development": [
    {
      "title": "MWCD Women Empowerment Internship",
      "department": "Ministry of Women & Child Development",
      "location": "New Delhi, State Offices",
      "duration": "2-4 months",
      "stipend": "₹6,000/month",
      "type": "Social",
      "skills": ["Social Work", "Research", "Policy Analysis", "Community Outreach"],
      "diversityTags": ["Women Empowerment", "Child Welfare", "Social Impact"],
      "applyUrl": "https://wcd.intern.nic.in/",
      "description": "Focus on women and child development programs and policies.",
      "eligibility": "Graduate students, preference for women candidates"
    }
  ],
  "isro": [
    {
      "title": "ISRO Space Technology Internship",
      "department": "Indian Space Research Organisation",
      "location": "Bengaluru, Thiruvananthapuram, Ahmedabad",
      "duration": "6-8 weeks",
      "stipend": "₹10,000/month",
      "type": "Technical",
      "skills": ["Aerospace Engineering", "Satellite Technology", "Research", "Programming"],
      "diversityTags": ["Space Technology", "Scientific Research", "Innovation"],
      "applyUrl": "https://www.isro.gov.in/",
      "description": "Hands-on experience in space technology and satellite systems.",
      "eligibility": "Engineering students in relevant disciplines"
    }
  ],
  "drdo": [
    {
      "title": "DRDO Defense Research Internship",
      "department": "Defense Research Development Organisation",
      "location": "Delhi, Bengaluru, Hyderabad, Pune",
      "duration": "6-10 weeks",
      "stipend": "₹12,000/month", 
      "type": "Research",
      "skills": ["Engineering", "Defense Technology", "Research", "Innovation"],
      "diversityTags": ["Defense Research", "National Security", "Advanced Technology"],
      "applyUrl": "https://www.drdo.gov.in/",
      "description": "Research internship in defense technology and systems.",
      "eligibility": "Engineering students with security clearance requirements"
    }
  ],
  "csir": [
    {
      "title": "CSIR Scientific Research Internship",
      "department": "Council of Scientific Industrial Research",
      "location": "Multiple cities across India",
      "duration": "2-6 months",
      "stipend": "₹8,000-12,000/month",
      "type": "Research",
      "skills": ["Scientific Research", "Laboratory Work", "Data Analysis", "Innovation"],
      "diversityTags": ["Scientific Research", "Innovation", "Laboratory Experience"],
      "applyUrl": "https://www.csir.res.in/",
      "description": "Research internships across various CSIR laboratories and institutes.",
      "eligibility": "Science/Engineering students with relevant background"
    }
  ]
};

// Additional private sector and startup opportunities
const privateInternshipData = {
  "tech_companies": [
    {
      "title": "Software Development Internship - TCS",
      "department": "Tata Consultancy Services",
      "location": "Mumbai, Bengaluru, Chennai, Delhi",
      "duration": "3-6 months",
      "stipend": "₹15,000-25,000/month",
      "type": "Technology",
      "skills": ["Programming", "Software Development", "Databases", "Web Development"],
      "diversityTags": ["Fortune 500", "Global Exposure", "Career Growth"],
      "applyUrl": "https://careers.tcs.com/",
      "description": "Software development internship with India's largest IT services company.",
      "eligibility": "Engineering/CS students with programming knowledge"
    },
    {
      "title": "Data Science Internship - Infosys",
      "department": "Infosys Limited",
      "location": "Bengaluru, Hyderabad, Pune, Mysuru",
      "duration": "3-6 months",
      "stipend": "₹20,000-30,000/month",
      "type": "Data Science",
      "skills": ["Python", "Machine Learning", "Statistics", "Data Analytics"],
      "diversityTags": ["AI/ML Focus", "Global Projects", "Innovation"],
      "applyUrl": "https://careers.infosys.com/",
      "description": "Data science and AI/ML internship opportunities.",
      "eligibility": "CS/IT/Data Science students with relevant skills"
    },
    {
      "title": "Product Management Internship - Wipro",
      "department": "Wipro Limited",
      "location": "Bengaluru, Hyderabad, Delhi",
      "duration": "4-6 months",
      "stipend": "₹18,000-28,000/month",
      "type": "Product",
      "skills": ["Product Management", "Strategy", "Analytics", "Leadership"],
      "diversityTags": ["Product Strategy", "Business Analysis", "Leadership Development"],
      "applyUrl": "https://careers.wipro.com/",
      "description": "Product management and strategy internship program.",
      "eligibility": "MBA/Engineering students with leadership potential"
    }
  ],
  "startups": [
    {
      "title": "Full Stack Development - Zomato",
      "department": "Zomato",
      "location": "Gurugram, Bengaluru",
      "duration": "3-6 months",
      "stipend": "₹25,000-40,000/month",
      "type": "Technology",
      "skills": ["React", "Node.js", "JavaScript", "Databases"],
      "diversityTags": ["Startup Environment", "Fast Growth", "Innovation"],
      "applyUrl": "https://www.eternal.com/careers/",
      "description": "Full-stack development in food-tech industry.",
      "eligibility": "CS/IT students with web development experience"
    },
    {
      "title": "Digital Marketing - Paytm",
      "department": "Paytm",
      "location": "Noida, Mumbai, Bengaluru",
      "duration": "3-4 months",
      "stipend": "₹20,000-30,000/month",
      "type": "Marketing",
      "skills": ["Digital Marketing", "Analytics", "Social Media", "Growth Hacking"],
      "diversityTags": ["Fintech", "Digital Payments", "Growth Marketing"],
      "applyUrl": "https://paytm.com/careers/",
      "description": "Digital marketing internship in fintech sector.",
      "eligibility": "Marketing/Business students with digital marketing knowledge"
    }
  ]
};

// Combine all internship data
const combinedInternshipData = {
  ...realInternshipData,
  ...privateInternshipData
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Real PM Internship Portal...');
  initializeApp();
  setupEventListeners();
  populateInitialJobs();
  addInteractiveFeatures();
});

function initializeApp() {
  console.log('Real PM Internship Portal initialized');
  
  // Setup smooth scrolling for navigation
  setupSmoothScrolling();
  
  // Initialize job results with real data
  setTimeout(() => {
    populateInitialJobs();
  }, 500);
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Chat input event listeners
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.querySelector('.chat-send-btn');
  
  if (chatInput) {
    console.log('Chat input found, adding event listeners');
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  if (chatSendBtn) {
    console.log('Chat send button found, adding click listener');
    chatSendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sendMessage();
    });
  }
  
  // Navigation event listeners
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = href.substring(1);
      scrollToSection(target);
    });
  });

  // Hero buttons
  const heroButtons = document.querySelectorAll('.hero__buttons .btn');
  heroButtons.forEach(button => {
    if (button.textContent.includes('Start AI Matching')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('chatbot');
      });
    }
    if (button.textContent.includes('Learn More')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('overview');
      });
    }
  });
}

function setupSmoothScrolling() {
  document.documentElement.style.scrollBehavior = 'smooth';
}

function scrollToSection(sectionId) {
  console.log('Scrolling to section:', sectionId);
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80;
    const elementPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
}

function sendPrompt(promptText) {
  console.log('Sending prompt:', promptText);
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.value = promptText;
    sendMessage();
  }
}

function sendMessage() {
  console.log('Sending message...');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  
  if (!chatInput || !chatMessages) {
    console.error('Chat elements not found');
    return;
  }
  
  if (isTyping) return;
  
  const message = chatInput.value.trim();
  if (!message) return;
  
  console.log('Processing message:', message);
  
  // Add user message
  addMessage(message, 'user');
  
  // Clear input
  chatInput.value = '';
  
  // Show typing indicator and generate response
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAIResponse(message);
    addMessage(response, 'bot');
    
    // Update job results based on the message
    updateJobResults(message);
  }, 1500 + Math.random() * 1000);
}

function addMessage(content, sender) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message--${sender}`;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  messageDiv.innerHTML = `
    <div class="message__content">${content}</div>
    <div class="message__time">${timeString}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  chatHistory.push({ content, sender, time: timeString });
}

function showTypingIndicator() {
  if (isTyping) return;
  
  isTyping = true;
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message message--bot typing-indicator';
  typingDiv.id = 'typingIndicator';
  
  typingDiv.innerHTML = `
    <div class="message__content">
      <div class="typing-animation">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  isTyping = false;
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  console.log('Generating AI response for:', message);
  
  // Check for PM internship keywords
  if (message.includes('pm internship') || message.includes('prime minister internship')) {
    return `Excellent! I found ${realInternshipData.pm_scheme.length} official PM Internship Scheme opportunities through the Ministry of Corporate Affairs. These offer ₹5,000/month + ₹6,000 one-time grant with placement in India's top 500 companies. Applications are processed through the official government portal.`;
  }
  
  // Check for specific skill/role keywords
  if (message.includes('software') || message.includes('programming') || message.includes('developer')) {
    const allSoftwareJobs = [
      ...realInternshipData.pm_scheme.filter(job => job.skills.some(skill => 
        skill.toLowerCase().includes('programming') || skill.toLowerCase().includes('software')
      )),
      ...realInternshipData.digital_india,
      ...privateInternshipData.tech_companies
    ];
    return `Great! I found ${allSoftwareJobs.length} software development internships including official PM Internship opportunities, government tech initiatives, and positions at top companies like TCS, Infosys, and Wipro.`;
  }
  
  if (message.includes('data science') || message.includes('data analytics') || message.includes('machine learning')) {
    const dataJobs = [
      ...realInternshipData.pm_scheme.filter(job => job.title.includes('Data')),
      ...realInternshipData.niti_aayog.filter(job => job.skills.includes('Data Analysis')),
      ...privateInternshipData.tech_companies.filter(job => job.type === 'Data Science')
    ];
    return `Perfect! I found ${dataJobs.length} data science and analytics opportunities including PM Internship positions, NITI Aayog research roles, and data science positions at leading tech companies.`;
  }
  
  if (message.includes('government') || message.includes('policy') || message.includes('public service')) {
    const govJobs = Object.values(realInternshipData).flat();
    return `Wonderful! I have ${govJobs.length} government internship opportunities including PM Internship Scheme, NITI Aayog, MEA, Ministry of Finance, RBI, SEBI, ISRO, DRDO, and many other prestigious government departments.`;
  }
  
  if (message.includes('research')) {
    const researchJobs = [
      ...realInternshipData.niti_aayog,
      ...realInternshipData.ministry_finance,
      ...realInternshipData.isro,
      ...realInternshipData.drdo,
      ...realInternshipData.csir
    ];
    return `Excellent! I found ${researchJobs.length} research internships across premier government institutions including NITI Aayog, ISRO, DRDO, CSIR labs, and Ministry of Finance with stipends up to ₹15,000/month.`;
  }
  
  if (message.includes('marketing') || message.includes('digital marketing')) {
    const marketingJobs = [
      ...realInternshipData.pm_scheme.filter(job => job.title.includes('Marketing')),
      ...privateInternshipData.startups.filter(job => job.type === 'Marketing')
    ];
    return `Great! I found ${marketingJobs.length} digital marketing internships including PM Internship opportunities and positions at fast-growing startups like Paytm and Zomato.`;
  }
  
  // Default responses
  const defaultResponses = [
    "I have access to hundreds of real internship opportunities! Ask me about 'PM Internship', 'government internships', 'software development', 'data science', 'research positions', or 'marketing internships' to get started.",
    "I can help you find authentic internships from official PM Internship Scheme to prestigious government positions at NITI Aayog, MEA, RBI, ISRO, and top private companies. What field interests you?",
    "Welcome! I have real internships from government institutions and top companies. Try asking about specific roles like 'PM internship', 'NITI Aayog', 'software developer', 'data analyst', or 'research intern'.",
    "I specialize in matching you with genuine opportunities including the official PM Internship Scheme and positions at India's top organizations. What type of role are you looking for?",
    "Ready to explore real internship opportunities? I have openings from government schemes to private sector positions. Just tell me your preferred field or skills!"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function updateJobResults(userMessage) {
  const message = userMessage.toLowerCase();
  let selectedJobs = [];

  console.log('Updating job results for message:', message);

  // Helper to get all available jobs
  const allJobs = Object.values(combinedInternshipData).flat();

  // --- NEW, MORE SPECIFIC CHECKS AT THE TOP ---
  if (message.includes('frontend')) {
    selectedJobs = allJobs.filter(job =>
      job.title.toLowerCase().includes('frontend') ||
      job.skills.some(s => ['react', 'web development'].includes(s.toLowerCase()))
    );
  } else if (message.includes('backend')) {
    selectedJobs = allJobs.filter(job =>
      job.title.toLowerCase().includes('backend') ||
      job.skills.some(s => ['node.js', 'databases', 'sql'].includes(s.toLowerCase()))
    );
  } else if (message.includes('full stack')) {
    selectedJobs = allJobs.filter(job =>
      job.title.toLowerCase().includes('full stack') ||
      // Check for both a frontend and a backend skill
      (job.skills.some(s => ['react', 'javascript'].includes(s.toLowerCase())) &&
       job.skills.some(s => ['node.js', 'databases'].includes(s.toLowerCase())))
    );
  }

  // --- EXISTING LOGIC (now as else if) ---
  else if (message.includes('pm internship') || message.includes('prime minister internship')) {
    selectedJobs = realInternshipData.pm_scheme;
  } else if (message.includes('niti aayog') || message.includes('policy')) {
    selectedJobs = realInternshipData.niti_aayog;
  } else if (message.includes('government') || message.includes('public service')) {
    selectedJobs = Object.values(realInternshipData).flat().slice(0, 12);
  }
  // This general developer check now acts as a fallback
  else if (message.includes('software') || message.includes('programming') || message.includes('developer')) {
    selectedJobs = allJobs.filter(job => job.type === 'Technology');
  } else if (message.includes('data science') || message.includes('data analytics')) {
    selectedJobs = [
      ...realInternshipData.pm_scheme.filter(job => job.title.includes('Data')),
      ...realInternshipData.niti_aayog,
      ...privateInternshipData.tech_companies.filter(job => job.type === 'Data Science')
    ];
  } else if (message.includes('research')) {
    selectedJobs = [
      ...realInternshipData.niti_aayog,
      ...realInternshipData.isro,
      ...realInternshipData.drdo,
      ...realInternshipData.csir
    ];
  } else if (message.includes('marketing')) {
    selectedJobs = [
      ...realInternshipData.pm_scheme.filter(job => job.title.includes('Marketing')),
      ...privateInternshipData.startups.filter(job => job.type === 'Marketing')
    ];
  } else if (message.includes('finance') || message.includes('banking')) {
    selectedJobs = [
      ...realInternshipData.ministry_finance,
      ...realInternshipData.rbi,
      ...realInternshipData.sebi
    ];
  } else if (message.includes('space') || message.includes('technology')) {
    selectedJobs = [
      ...realInternshipData.isro,
      ...realInternshipData.drdo,
      ...realInternshipData.digital_india
    ];
  }

  // If no specific role detected after a search, keep the array empty.
  // Otherwise, if the input was empty, show the default mix.
  if (selectedJobs.length === 0 && message.length === 0) {
    selectedJobs = [
      ...realInternshipData.pm_scheme,
      ...realInternshipData.niti_aayog.slice(0, 2),
      ...realInternshipData.mea.slice(0, 1),
      ...realInternshipData.rbi.slice(0, 1),
      ...privateInternshipData.tech_companies.slice(0, 2)
    ];
  }

  console.log(`Showing ${selectedJobs.length} real internship opportunities`);
  populateJobResults(selectedJobs);

  // Scroll to job results
  setTimeout(() => {
    scrollToSection('job-results');
  }, 500);
}

function populateInitialJobs() {
  console.log('Populating initial real internship jobs');
  // Show PM Internship first, then other high-priority opportunities
  const initialJobs = [
    ...realInternshipData.pm_scheme,
    ...realInternshipData.niti_aayog,
    ...realInternshipData.mea.slice(0, 1),
    ...realInternshipData.rbi,
    ...privateInternshipData.tech_companies.slice(0, 2)
  ];
  populateJobResults(initialJobs);
}

function populateJobResults(jobs) {
  const jobsGrid = document.getElementById('jobsGrid');
  if (!jobsGrid) {
    console.error('Jobs grid not found');
    return;
  }
  
  console.log(`Populating ${jobs.length} real internship opportunities`);
  jobsGrid.innerHTML = '';
  
  jobs.forEach((job, index) => {
    const jobCard = createJobCard(job, index);
    jobsGrid.appendChild(jobCard);
  });
  
  // Add animation delay for each card
  const jobCards = jobsGrid.querySelectorAll('.job-card');
  jobCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

function createJobCard(job, index) {
  const jobCard = document.createElement('div');
  jobCard.className = 'job-card';
  
  // Determine if it's a PM Internship for special styling
  const isPMInternship = job.title.includes('PM Internship');
  const pmBadge = isPMInternship ? '<div style="background: linear-gradient(45deg, #FF9933, #138808); color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; margin-bottom: 8px; display: inline-block;">🇮🇳 OFFICIAL PM SCHEME</div>' : '';
  
  jobCard.innerHTML = `
    <div class="job-card__header">
      ${pmBadge}
      <h3 class="job-card__title">${job.title}</h3>
      <div class="job-card__company" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <div style="font-size: 1.2em;">${isPMInternship ? '🇮🇳' : '🏢'}</div>
        <div>
          <div style="font-weight: 600; color: var(--color-primary);">${job.department}</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">
            ${job.eligibility || 'Check official website for eligibility'}
          </div>
        </div>
      </div>
      <p class="job-card__location">
        <i class="fas fa-map-marker-alt"></i>
        ${job.location}
      </p>
    </div>
    <div class="job-card__details" style="padding: 16px 20px; border-bottom: 1px solid var(--color-border);">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px;">
        <div><strong>Duration:</strong> ${job.duration}</div>
        <div><strong>Stipend:</strong> ${job.stipend}</div>
        <div><strong>Type:</strong> ${job.type}</div>
        <div><strong>Skills:</strong> ${job.skills.slice(0, 2).join(', ')}</div>
      </div>
      ${job.description ? `<div style="margin-top: 12px; font-size: 13px; color: var(--color-text-secondary); line-height: 1.4;">${job.description}</div>` : ''}
    </div>
    <div class="job-card__tags">
      ${job.diversityTags.map(tag => `<span class="diversity-tag">${tag}</span>`).join('')}
    </div>
    <div class="job-card__footer">
      <div style="font-size: 12px; color: var(--color-text-secondary);">
        ${isPMInternship ? 'Government of India Initiative' : 'Apply through official portal'}
      </div>
      <button class="btn btn--primary btn--sm" onclick="applyToRealJob('${job.title.replace(/'/g, "\\'")}', '${job.applyUrl}', '${job.department.replace(/'/g, "\\'")}', ${index})">
        <i class="fas fa-external-link-alt"></i> Apply Now
      </button>
    </div>
  `;
  
  return jobCard;
}

// Updated apply function to redirect to real websites
function applyToRealJob(title, applyUrl, department, index) {
  console.log('Applying to real internship:', title, 'at', department, 'via', applyUrl);
  
  // Show success message
  showNotification(`Redirecting to official application portal for ${title} at ${department}. The website will open in a new tab.`, 'success');
  
  // Add visual feedback to the button
  const buttons = document.querySelectorAll('.job-card .btn--primary');
  if (buttons[index]) {
    const originalText = buttons[index].innerHTML;
    buttons[index].innerHTML = '<i class="fas fa-external-link-alt"></i> Opening...';
    buttons[index].style.background = '#1976D2';
    buttons[index].disabled = true;
    
    // Open the real application URL in a new tab
    setTimeout(() => {
      window.open(applyUrl, '_blank');
      
      // Reset button after opening
      buttons[index].innerHTML = '<i class="fas fa-check"></i> Portal Opened';
      buttons[index].style.background = '#388E3C';
      
      // Reset to original state after 5 seconds
      setTimeout(() => {
        buttons[index].innerHTML = originalText;
        buttons[index].style.background = 'var(--color-primary)';
        buttons[index].disabled = false;
      }, 5000);
    }, 1000);
  }
  
  // Track application attempt for analytics
  trackApplicationAttempt(title, department, applyUrl);
}

// Function to track applications (for analytics)
function trackApplicationAttempt(title, department, applyUrl) {
  const applicationData = {
    title: title,
    department: department,
    url: applyUrl,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  
  console.log('Application tracked:', applicationData);
  
  // In a real implementation, you would send this to your analytics service
  // For now, we'll store it in localStorage for demo purposes
  const existingApplications = JSON.parse(localStorage.getItem('internshipApplications') || '[]');
  existingApplications.push(applicationData);
  localStorage.setItem('internshipApplications', JSON.stringify(existingApplications));
}

// Enhanced search functionality for real internships
function searchInternships(query) {
  const searchQuery = query.toLowerCase();
  let results = [];
  
  // Search through all internship categories
  Object.values(combinedInternshipData).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(job => {
        const titleMatch = job.title.toLowerCase().includes(searchQuery);
        const departmentMatch = job.department.toLowerCase().includes(searchQuery);
        const skillsMatch = job.skills.some(skill => skill.toLowerCase().includes(searchQuery));
        const locationMatch = job.location.toLowerCase().includes(searchQuery);
        const tagsMatch = job.diversityTags.some(tag => tag.toLowerCase().includes(searchQuery));
        
        if (titleMatch || departmentMatch || skillsMatch || locationMatch || tagsMatch) {
          results.push({
            ...job,
            relevanceScore: (titleMatch ? 3 : 0) + (departmentMatch ? 2 : 0) + (skillsMatch ? 2 : 0) + (locationMatch ? 1 : 0) + (tagsMatch ? 1 : 0)
          });
        }
      });
    }
  });
  
  // Sort by relevance score (higher first)
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return results;
}

// Utility functions
function showNotification(message, type = 'info') {
  console.log('Showing notification:', message, type);
  
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
  
  notification.innerHTML = `
    <div class="notification__content">
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    </div>
    <button class="notification__close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add notification styles if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid ${type === 'success' ? '#388E3C' : type === 'error' ? '#D32F2F' : '#1976D2'};
        border-left: 4px solid ${type === 'success' ? '#388E3C' : type === 'error' ? '#D32F2F' : '#1976D2'};
        border-radius: var(--radius-base);
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-12);
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .notification__content {
        display: flex;
        align-items: center;
        gap: var(--space-8);
        color: var(--color-text);
      }
      .notification__close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--space-4);
        border-radius: var(--radius-base);
        transition: background var(--duration-fast) ease;
      }
      .notification__close:hover {
        background: var(--color-secondary);
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 7 seconds (longer for important messages)
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 7000);
}

// Add interactive features for better UX
function addInteractiveFeatures() {
  console.log('Adding interactive features for real internships');
  
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.ai-feature, .story-card, .partner-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Add enhanced hover effects for job cards
  addJobCardInteractions();
}

function addJobCardInteractions() {
  // Enhanced hover effects for job cards
  document.addEventListener('mouseover', function(e) {
    const jobCard = e.target.closest('.job-card');
    if (jobCard) {
      jobCard.style.borderColor = '#FF9933';
      jobCard.style.transform = 'translateY(-8px)';
      jobCard.style.boxShadow = 'var(--shadow-lg)';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    const jobCard = e.target.closest('.job-card');
    if (jobCard) {
      jobCard.style.borderColor = 'var(--color-card-border)';
      jobCard.style.transform = 'translateY(0)';
      jobCard.style.boxShadow = 'var(--shadow-sm)';
    }
  });
}

// Function to get applications from localStorage (for demo)
function getStoredApplications() {
  return JSON.parse(localStorage.getItem('internshipApplications') || '[]');
}

// Function to display application statistics
function showApplicationStats() {
  const applications = getStoredApplications();
  if (applications.length > 0) {
    console.log(`User has applied to ${applications.length} internships:`);
    applications.forEach(app => {
      console.log(`- ${app.title} at ${app.department} (${new Date(app.timestamp).toLocaleDateString()})`);
    });
  }
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Real internship application error:', e.error);
  showNotification('An error occurred while processing your request. Please try again or contact support.', 'error');
});

// Make functions globally available for HTML onclick handlers
window.sendPrompt = sendPrompt;
window.scrollToSection = scrollToSection;
window.applyToRealJob = applyToRealJob;
window.searchInternships = searchInternships;
window.showApplicationStats = showApplicationStats;

// Initialize typing animation CSS if not already added
if (!document.getElementById('typing-styles')) {
  const style = document.createElement('style');
  style.id = 'typing-styles';
  style.textContent = `
    .typing-animation {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 8px 0;
    }
    .typing-animation span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #FF9933;
      animation: typing 1.5s ease-in-out infinite;
    }
    .typing-animation span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-animation span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-10px);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

console.log('Real PM Internship Portal with authentic opportunities loaded successfully!');