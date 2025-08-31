// Global Variables
let currentTab = 'personal';
let resumeData = {
    personal: {},
    education: [],
    experience: [],
    skills: [],
    languages: []
};

// Sample job data
const sampleJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Bangalore",
        experience: "1-3",
        salary: "₹6-12 LPA",
        type: "Full-time",
        skills: ["React", "JavaScript", "CSS"],
        description: "Looking for a passionate frontend developer to join our team."
    },
    {
        id: 2,
        title: "Data Scientist",
        company: "DataTech",
        location: "Mumbai",
        experience: "2-4",
        salary: "₹8-15 LPA",
        type: "Full-time",
        skills: ["Python", "Machine Learning", "SQL"],
        description: "Seeking a data scientist with strong analytical skills."
    },
    {
        id: 3,
        title: "Backend Developer",
        company: "CloudSoft",
        location: "Remote",
        experience: "1-3",
        salary: "₹7-13 LPA",
        type: "Remote",
        skills: ["Node.js", "MongoDB", "Express"],
        description: "Remote backend developer position with flexible hours."
    },
    {
        id: 4,
        title: "UI/UX Designer",
        company: "DesignHub",
        location: "Delhi",
        experience: "fresher",
        salary: "₹4-8 LPA",
        type: "Full-time",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        description: "Entry-level UI/UX designer role for creative minds."
    },
    {
        id: 5,
        title: "DevOps Engineer",
        company: "InfraTech",
        location: "Pune",
        experience: "3-5",
        salary: "₹10-18 LPA",
        type: "Full-time",
        skills: ["AWS", "Docker", "Kubernetes"],
        description: "Experienced DevOps engineer for cloud infrastructure."
    },
    {
        id: 6,
        title: "Mobile App Developer",
        company: "AppWorks",
        location: "Hyderabad",
        experience: "2-4",
        salary: "₹8-14 LPA",
        type: "Full-time",
        skills: ["React Native", "Flutter", "iOS"],
        description: "Mobile app developer for cross-platform applications."
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadJobs();
    setupEventListeners();
});

function initializeApp() {
    // Setup tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Setup form input listeners
    setupFormListeners();
    
    // Setup skill input
    setupSkillInput();
    
    // Setup language input
    setupLanguageInput();
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function setupFormListeners() {
    const inputs = ['fullName', 'email', 'phone', 'linkedin', 'summary'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
        }
    });
}

function setupSkillInput() {
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addSkill(this.value.trim());
                this.value = '';
            }
        });
    }
}

function setupLanguageInput() {
    const languageInput = document.getElementById('languageInput');
    if (languageInput) {
        languageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addLanguage(this.value.trim());
                this.value = '';
            }
        });
    }
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;
}

function updatePreview() {
    // Update personal info in preview
    const fullName = document.getElementById('fullName').value || 'Your Name';
    const email = document.getElementById('email').value || 'email@example.com';
    const phone = document.getElementById('phone').value || '+91 9876543210';
    const summary = document.getElementById('summary').value || 'Your professional summary will appear here...';

    document.getElementById('previewName').textContent = fullName;
    document.getElementById('previewEmail').textContent = email;
    document.getElementById('previewPhone').textContent = phone;
    document.getElementById('previewSummary').textContent = summary;

    // Update education preview
    updateEducationPreview();
    
    // Update experience preview
    updateExperiencePreview();
    
    // Update skills preview
    updateSkillsPreview();
}

function addEducation() {
    const educationList = document.getElementById('educationList');
    const index = resumeData.education.length;
    
    const educationItem = {
        degree: '',
        institution: '',
        year: '',
        grade: ''
    };
    
    resumeData.education.push(educationItem);
    
    const educationHTML = `
        <div class="education-item" data-index="${index}">
            <div class="form-group">
                <label>Degree/Course</label>
                <input type="text" placeholder="e.g., B.Tech Computer Science" onchange="updateEducation(${index}, 'degree', this.value)">
            </div>
            <div class="form-group">
                <label>Institution</label>
                <input type="text" placeholder="e.g., IIT Delhi" onchange="updateEducation(${index}, 'institution', this.value)">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" placeholder="e.g., 2020-2024" onchange="updateEducation(${index}, 'year', this.value)">
            </div>
            <div class="form-group">
                <label>Grade/CGPA</label>
                <input type="text" placeholder="e.g., 8.5 CGPA" onchange="updateEducation(${index}, 'grade', this.value)">
            </div>
            <button type="button" class="btn-secondary" onclick="removeEducation(${index})">Remove</button>
            <hr style="margin: 20px 0;">
        </div>
    `;
    
    educationList.insertAdjacentHTML('beforeend', educationHTML);
}

function updateEducation(index, field, value) {
    resumeData.education[index][field] = value;
    updateEducationPreview();
}

function removeEducation(index) {
    resumeData.education.splice(index, 1);
    document.querySelector(`[data-index="${index}"]`).remove();
    updateEducationPreview();
}

function updateEducationPreview() {
    const previewEducation = document.getElementById('previewEducation');
    previewEducation.innerHTML = '';
    
    resumeData.education.forEach(edu => {
        if (edu.degree || edu.institution) {
            const eduHTML = `
                <div class="education-entry">
                    <strong>${edu.degree}</strong><br>
                    <em>${edu.institution}</em><br>
                    <span>${edu.year} | ${edu.grade}</span>
                </div>
            `;
            previewEducation.insertAdjacentHTML('beforeend', eduHTML);
        }
    });
}

function addExperience() {
    const experienceList = document.getElementById('experienceList');
    const index = resumeData.experience.length;
    
    const experienceItem = {
        title: '',
        company: '',
        duration: '',
        description: ''
    };
    
    resumeData.experience.push(experienceItem);
    
    const experienceHTML = `
        <div class="experience-item" data-index="${index}">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" placeholder="e.g., Software Developer Intern" onchange="updateExperience(${index}, 'title', this.value)">
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" placeholder="e.g., Google" onchange="updateExperience(${index}, 'company', this.value)">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" placeholder="e.g., Jun 2023 - Aug 2023" onchange="updateExperience(${index}, 'duration', this.value)">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your responsibilities and achievements..." onchange="updateExperience(${index}, 'description', this.value)"></textarea>
                <button class="ai-suggest-btn" onclick="generateExperienceDescription(${index})">✨ AI Suggest</button>
            </div>
            <button type="button" class="btn-secondary" onclick="removeExperience(${index})">Remove</button>
            <hr style="margin: 20px 0;">
        </div>
    `;
    
    experienceList.insertAdjacentHTML('beforeend', experienceHTML);
}

function updateExperience(index, field, value) {
    resumeData.experience[index][field] = value;
    updateExperiencePreview();
}

function removeExperience(index) {
    resumeData.experience.splice(index, 1);
    document.querySelector(`[data-index="${index}"]`).remove();
    updateExperiencePreview();
}

function updateExperiencePreview() {
    const previewExperience = document.getElementById('previewExperience');
    previewExperience.innerHTML = '';
    
    resumeData.experience.forEach(exp => {
        if (exp.title || exp.company) {
            const expHTML = `
                <div class="experience-entry">
                    <strong>${exp.title}</strong><br>
                    <em>${exp.company}</em><br>
                    <span>${exp.duration}</span><br>
                    <p>${exp.description}</p>
                </div>
            `;
            previewExperience.insertAdjacentHTML('beforeend', expHTML);
        }
    });
}

function addSkill(skill) {
    if (!resumeData.skills.includes(skill)) {
        resumeData.skills.push(skill);
        updateSkillsDisplay();
        updateSkillsPreview();
    }
}

function removeSkill(skill) {
    const index = resumeData.skills.indexOf(skill);
    if (index > -1) {
        resumeData.skills.splice(index, 1);
        updateSkillsDisplay();
        updateSkillsPreview();
    }
}

function updateSkillsDisplay() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    resumeData.skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <span class="remove" onclick="removeSkill('${skill}')">&times;</span>
        `;
        skillsList.appendChild(skillTag);
    });
}

function addLanguage(language) {
    if (!resumeData.languages.includes(language)) {
        resumeData.languages.push(language);
        updateLanguagesDisplay();
    }
}

function removeLanguage(language) {
    const index = resumeData.languages.indexOf(language);
    if (index > -1) {
        resumeData.languages.splice(index, 1);
        updateLanguagesDisplay();
    }
}

function updateLanguagesDisplay() {
    const languagesList = document.getElementById('languagesList');
    languagesList.innerHTML = '';
    
    resumeData.languages.forEach(language => {
        const languageTag = document.createElement('div');
        languageTag.className = 'skill-tag';
        languageTag.innerHTML = `
            ${language}
            <span class="remove" onclick="removeLanguage('${language}')">&times;</span>
        `;
        languagesList.appendChild(languageTag);
    });
}

function updateSkillsPreview() {
    const previewSkills = document.getElementById('previewSkills');
    const allSkills = [...resumeData.skills, ...resumeData.languages];
    
    if (allSkills.length > 0) {
        previewSkills.innerHTML = `
            <div class="skills-section">
                <strong>Technical Skills:</strong> ${resumeData.skills.join(', ')}<br>
                <strong>Languages:</strong> ${resumeData.languages.join(', ')}
            </div>
        `;
    } else {
        previewSkills.innerHTML = '<p>Add skills to see them here...</p>';
    }
}

// AI-powered functions
async function generateSummary() {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.disabled = true;
    
    try {
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const summaries = [
            "Passionate and driven computer science student with strong problem-solving skills and experience in full-stack development. Eager to contribute to innovative projects and grow in a dynamic tech environment.",
            "Detail-oriented software engineering student with hands-on experience in modern web technologies. Demonstrated ability to work in team environments and deliver high-quality solutions under tight deadlines.",
            "Motivated technology enthusiast with a solid foundation in programming and software development. Seeking opportunities to apply technical skills and contribute to meaningful projects in the tech industry."
        ];
        
        const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
        document.getElementById('summary').value = randomSummary;
        updatePreview();
        
    } catch (error) {
        console.error('Error generating summary:', error);
        alert('Failed to generate summary. Please try again.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function suggestSkills() {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Suggesting...';
    btn.disabled = true;
    
    try {
        // Simulate AI skill suggestions
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const skillSuggestions = [
            ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
            ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
            ['Java', 'Spring Boot', 'MySQL', 'Git', 'Jenkins'],
            ['HTML', 'CSS', 'Vue.js', 'Firebase', 'Figma']
        ];
        
        const randomSkills = skillSuggestions[Math.floor(Math.random() * skillSuggestions.length)];
        
        randomSkills.forEach(skill => {
            if (!resumeData.skills.includes(skill)) {
                addSkill(skill);
            }
        });
        
    } catch (error) {
        console.error('Error suggesting skills:', error);
        alert('Failed to suggest skills. Please try again.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function generateExperienceDescription(index) {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.disabled = true;
    
    try {
        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const descriptions = [
            "• Developed and maintained web applications using modern frameworks\n• Collaborated with cross-functional teams to deliver high-quality software solutions\n• Implemented responsive design principles and optimized application performance\n• Participated in code reviews and followed best practices for software development",
            "• Designed and implemented RESTful APIs for mobile and web applications\n• Worked with databases to optimize query performance and data management\n• Contributed to agile development processes and sprint planning\n• Mentored junior developers and provided technical guidance",
            "• Built scalable web applications using cutting-edge technologies\n• Integrated third-party services and APIs to enhance application functionality\n• Conducted testing and debugging to ensure software quality\n• Documented code and created technical specifications for future reference"
        ];
        
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Find the textarea in the experience item
        const experienceItem = document.querySelector(`[data-index="${index}"]`);
        const textarea = experienceItem.querySelector('textarea');
        textarea.value = randomDescription;
        
        updateExperience(index, 'description', randomDescription);
        
    } catch (error) {
        console.error('Error generating description:', error);
        alert('Failed to generate description. Please try again.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function generateResume() {
    // Collect all form data
    resumeData.personal = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        linkedin: document.getElementById('linkedin').value,
        summary: document.getElementById('summary').value
    };
    
    updatePreview();
    alert('Resume generated successfully! You can now download it as PDF.');
}

function downloadResume() {
    // In a real application, this would generate and download a PDF
    alert('PDF download feature will be implemented with a PDF generation library like jsPDF or Puppeteer.');
}

// Job search functionality
function loadJobs() {
    displayJobs(sampleJobs);
}

function searchJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;
    
    let filteredJobs = sampleJobs.filter(job => {
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm));
            
        const matchesLocation = !locationFilter || job.location.toLowerCase() === locationFilter;
        const matchesExperience = !experienceFilter || job.experience === experienceFilter;
        
        return matchesSearch && matchesLocation && matchesExperience;
    });
    
    displayJobs(filteredJobs);
}

function displayJobs(jobs) {
    const jobsList = document.getElementById('jobsList');
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<p class="text-center">No jobs found matching your criteria.</p>';
        return;
    }
    
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div class="job-header">
                <div class="company-logo">
                    ${job.company.charAt(0)}
                </div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p>${job.company} • ${job.location}</p>
                </div>
            </div>
            <div class="job-details">
                <p><strong>Experience:</strong> ${job.experience === 'fresher' ? 'Fresher' : job.experience + ' years'}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
                <p><strong>Type:</strong> ${job.type}</p>
                <p>${job.description}</p>
            </div>
            <div class="job-tags">
                ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="btn-apply" onclick="applyJob(${job.id})">Apply Now</button>
                <button class="btn-save" onclick="saveJob(${job.id})">💾</button>
            </div>
        </div>
    `).join('');
}

function applyJob(jobId) {
    alert(`Application submitted for job ID: ${jobId}. You will be redirected to the company's application portal.`);
}

function saveJob(jobId) {
    alert(`Job ID: ${jobId} saved to your favorites!`);
}

// Career guidance functions
function openCareerAssessment() {
    showModal('Career Assessment', `
        <div class="assessment-form">
            <h4>Tell us about yourself:</h4>
            <div class="form-group">
                <label>What are your main interests?</label>
                <select id="interests">
                    <option value="">Select your interest</option>
                    <option value="technology">Technology & Programming</option>
                    <option value="design">Design & Creativity</option>
                    <option value="business">Business & Management</option>
                    <option value="science">Science & Research</option>
                    <option value="healthcare">Healthcare & Medicine</option>
                </select>
            </div>
            <div class="form-group">
                <label>What's your current education level?</label>
                <select id="education">
                    <option value="">Select education level</option>
                    <option value="highschool">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                </select>
            </div>
            <div class="form-group">
                <label>Preferred work environment?</label>
                <select id="workEnv">
                    <option value="">Select preference</option>
                    <option value="office">Traditional Office</option>
                    <option value="remote">Remote Work</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="travel">Travel Required</option>
                </select>
            </div>
            <button class="btn-primary" onclick="processAssessment()">Get Career Recommendations</button>
        </div>
    `);
}

function processAssessment() {
    const interests = document.getElementById('interests').value;
    const education = document.getElementById('education').value;
    const workEnv = document.getElementById('workEnv').value;
    
    if (!interests || !education || !workEnv) {
        alert('Please fill all fields to get accurate recommendations.');
        return;
    }
    
    // Simple career recommendation logic
    let recommendations = [];
    
    if (interests === 'technology') {
        recommendations = ['Software Developer', 'Data Scientist', 'DevOps Engineer', 'Cybersecurity Analyst'];
    } else if (interests === 'design') {
        recommendations = ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Creative Director'];
    } else if (interests === 'business') {
        recommendations = ['Business Analyst', 'Product Manager', 'Marketing Manager', 'Consultant'];
    } else if (interests === 'science') {
        recommendations = ['Research Scientist', 'Data Analyst', 'Lab Technician', 'Quality Analyst'];
    } else if (interests === 'healthcare') {
        recommendations = ['Healthcare IT', 'Medical Researcher', 'Health Data Analyst', 'Telemedicine Specialist'];
    }
    
    showModal('Career Recommendations', `
        <div class="recommendations">
            <h4>Based on your preferences, here are some career paths:</h4>
            <ul>
                ${recommendations.map(career => `<li><strong>${career}</strong></li>`).join('')}
            </ul>
            <p><em>These are general recommendations. Consider exploring each field further and talking to professionals in these areas.</em></p>
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `);
}

function analyzeSkills() {
    if (resumeData.skills.length === 0) {
        alert('Please add some skills in the Resume Builder section first.');
        return;
    }
    
    // Simple skill gap analysis
    const skillGaps = {
        'JavaScript': ['React', 'Node.js', 'TypeScript'],
        'Python': ['Django', 'Flask', 'Pandas'],
        'Java': ['Spring Boot', 'Hibernate', 'Maven'],
        'React': ['Redux', 'Next.js', 'Testing Library'],
        'Node.js': ['Express', 'MongoDB', 'Socket.io']
    };
    
    let suggestions = [];
    resumeData.skills.forEach(skill => {
        if (skillGaps[skill]) {
            suggestions.push(...skillGaps[skill]);
        }
    });
    
    // Remove duplicates and skills already known
    suggestions = [...new Set(suggestions)].filter(skill => !resumeData.skills.includes(skill));
    
    showModal('Skill Gap Analysis', `
        <div class="skill-analysis">
            <h4>Your Current Skills:</h4>
            <p>${resumeData.skills.join(', ')}</p>
            
            <h4>Recommended Skills to Learn:</h4>
            ${suggestions.length > 0 ? 
                `<ul>${suggestions.slice(0, 8).map(skill => `<li>${skill}</li>`).join('')}</ul>` :
                '<p>Great! You have a solid skill set. Consider exploring advanced topics in your current skills.</p>'
            }
            
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `);
}

function showResources() {
    const resources = [
        { name: 'Coursera', type: 'Online Courses', url: '#' },
        { name: 'edX', type: 'University Courses', url: '#' },
        { name: 'Udemy', type: 'Practical Skills', url: '#' },
        { name: 'freeCodeCamp', type: 'Programming', url: '#' },
        { name: 'Khan Academy', type: 'Fundamentals', url: '#' },
        { name: 'LinkedIn Learning', type: 'Professional Skills', url: '#' }
    ];
    
    showModal('Learning Resources', `
        <div class="resources">
            <h4>Recommended Learning Platforms:</h4>
            <div class="resources-grid">
                ${resources.map(resource => `
                    <div class="resource-card">
                        <h5>${resource.name}</h5>
                        <p>${resource.type}</p>
                        <button class="btn-secondary">Visit Platform</button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `);
}

// Chat functionality
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        const aiMessage = document.createElement('div');
        aiMessage.className = 'chat-message ai';
        aiMessage.textContent = aiResponse;
        chatMessages.appendChild(aiMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
    const responses = {
        'career': 'Career planning involves identifying your interests, skills, and values, then exploring careers that align with them. Consider taking assessments, networking, and gaining relevant experience.',
        'resume': 'A strong resume should be concise, relevant, and tailored to each job. Include quantifiable achievements, use action verbs, and ensure it\'s error-free.',
        'interview': 'Prepare for interviews by researching the company, practicing common questions, preparing your own questions, and dressing appropriately.',
        'skills': 'Focus on developing both technical and soft skills. Stay updated with industry trends, take online courses, and practice regularly.',
        'job search': 'Use multiple channels: job boards, company websites, networking, and recruitment agencies. Tailor your applications and follow up professionally.',
        'salary': 'Research market rates using sites like Glassdoor, PayScale, and LinkedIn. Consider the total compensation package, not just base salary.',
        'networking': 'Build professional relationships through LinkedIn, industry events, alumni networks, and informational interviews. Always offer value to others.'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return 'That\'s a great question! For personalized career advice, I recommend speaking with a career counselor or industry professional. You can also explore our career assessment tool for more insights.';
}

// Interview preparation functions
function startMockInterview() {
    const questions = [
        "Tell me about yourself.",
        "Why do you want to work here?",
        "What are your greatest strengths?",
        "What is your biggest weakness?",
        "Where do you see yourself in 5 years?",
        "Why should we hire you?",
        "Describe a challenging situation and how you handled it.",
        "What motivates you?"
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    showModal('Mock Interview', `
        <div class="mock-interview">
            <h4>Interview Question:</h4>
            <div class="question-box">
                <p><strong>${randomQuestion}</strong></p>
            </div>
            <div class="form-group">
                <label>Your Answer:</label>
                <textarea id="interviewAnswer" placeholder="Type your answer here..." rows="6"></textarea>
            </div>
            <div class="interview-actions">
                <button class="btn-primary" onclick="submitAnswer()">Submit Answer</button>
                <button class="btn-secondary" onclick="startMockInterview()">Next Question</button>
            </div>
        </div>
    `);
}

function submitAnswer() {
    const answer = document.getElementById('interviewAnswer').value;
    if (!answer.trim()) {
        alert('Please provide an answer before submitting.');
        return;
    }
    
    // Simple feedback based on answer length and content
    let feedback = '';
    if (answer.length < 50) {
        feedback = 'Your answer is quite brief. Try to provide more detailed examples and explanations.';
    } else if (answer.length > 500) {
        feedback = 'Your answer is very detailed, which is good! Make sure to stay concise and focused on the key points.';
    } else {
        feedback = 'Good answer length! Make sure to include specific examples and quantifiable results when possible.';
    }
    
    showModal('Interview Feedback', `
        <div class="interview-feedback">
            <h4>Feedback on Your Answer:</h4>
            <p>${feedback}</p>
            <h5>General Tips:</h5>
            <ul>
                <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                <li>Be specific and provide concrete examples</li>
                <li>Practice your answers out loud</li>
                <li>Maintain good eye contact and confident body language</li>
            </ul>
            <button class="btn-primary" onclick="startMockInterview()">Try Another Question</button>
            <button class="btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `);
}

function showQuestions() {
    const questionCategories = {
        'General': [
            'Tell me about yourself',
            'Why do you want to work here?',
            'What are your career goals?'
        ],
        'Technical': [
            'Explain your experience with [specific technology]',
            'How do you approach problem-solving?',
            'Describe a challenging project you worked on'
        ],
        'Behavioral': [
            'Describe a time you worked in a team',
            'How do you handle stress and pressure?',
            'Tell me about a time you failed'
        ]
    };
    
    let questionsHTML = '';
    for (const [category, questions] of Object.entries(questionCategories)) {
        questionsHTML += `
            <div class="question-category">
                <h5>${category} Questions:</h5>
                <ul>
                    ${questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    showModal('Common Interview Questions', `
        <div class="interview-questions">
            ${questionsHTML}
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `);
}

function showVideoTips() {
    showModal('Video Interview Tips', `
        <div class="video-tips">
            <h4>Video Interview Best Practices:</h4>
            <div class="tips-grid">
                <div class="tip">
                    <h5>🎥 Technical Setup</h5>
                    <ul>
                        <li>Test your camera and microphone beforehand</li>
                        <li>Ensure stable internet connection</li>
                        <li>Have backup plans (phone hotspot, alternative device)</li>
                    </ul>
                </div>
                <div class="tip">
                    <h5>💡 Lighting & Environment</h5>
                    <ul>
                        <li>Use natural light or a ring light</li>
                        <li>Choose a quiet, professional background</li>
                        <li>Minimize distractions and interruptions</li>
                    </ul>
                </div>
                <div class="tip">
                    <h5>👔 Professional Presence</h5>
                    <ul>
                        <li>Dress professionally (full outfit, not just top)</li>
                        <li>Maintain eye contact with the camera</li>
                        <li>Sit up straight and use hand gestures naturally</li>
                    </ul>
                </div>
                <div class="tip">
                    <h5>📝 Preparation</h5>
                    <ul>
                        <li>Have your resume and notes nearby</li>
                        <li>Prepare questions about the role</li>
                        <li>Practice with the video platform beforehand</li>
                    </ul>
                </div>
            </div>
            <button class="btn-primary" onclick="closeModal()">Close</button>
        </div>
    `);
}

// Modal functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Add some sample data for demonstration
setTimeout(() => {
    // Add some sample skills
    ['JavaScript', 'React', 'Node.js'].forEach(skill => addSkill(skill));
    ['English', 'Hindi'].forEach(lang => addLanguage(lang));
}, 1000);