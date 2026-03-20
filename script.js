// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);

    // Toggle icon
    if (newTheme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Re-initialize particles to update colors
    if (typeof init === 'function') {
        init();
    }
});

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');

    // Toggle Icon
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('nav-active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Modal Logic for Certificates
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.querySelector('.close-modal');

function openModal(imgSrc) {
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

closeBtn.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}


// Animated Background (Particles)
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // check particle position, check mouse position, move the particle, draw the particle
    update() {
        // check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // draw particle
        this.draw();
    }
}

// create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    // colors to match neon theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const colors = isLight
        ? ['rgba(0, 153, 179, 0.6)', 'rgba(153, 0, 204, 0.6)', 'rgba(204, 0, 68, 0.6)', 'rgba(0, 0, 0, 0.1)']
        : ['rgba(0, 240, 255, 0.4)', 'rgba(187, 0, 255, 0.4)', 'rgba(255, 0, 85, 0.4)', 'rgba(255, 255, 255, 0.1)'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// connect close particles
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                // line matching neon theme
                const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                const strokeColor = isLight ? 'rgba(0, 153, 179,' : 'rgba(0, 240, 255,';
                ctx.strokeStyle = strokeColor + opacityValue * 0.2 + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// resize event
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

// mouseout event
window.addEventListener('mouseout',
    function () {
        // optionally handle cursor out of window
    }
);

init();
animate();

// --- Admin Panel Logic ---
const adminLoginModal = document.getElementById('adminLoginModal');
const adminEditModal = document.getElementById('adminEditModal');
const openAdminBtn = document.getElementById('openAdminBtn');
const closeAdminLogin = document.querySelector('.close-admin-login');
const closeAdminEdit = document.querySelector('.close-admin-edit');
const loginBtn = document.getElementById('loginBtn');
const adminPasswordInput = document.getElementById('adminPassword');
const adminError = document.getElementById('adminError');

// Dynamic elements
const certsContainer = document.getElementById('certs-container');
const adminCertsList = document.getElementById('admin-certs-list');
const addCertBtn = document.getElementById('addCertBtn');
const newCertTitle = document.getElementById('new-cert-title');
const newCertProvider = document.getElementById('new-cert-provider');
const newCertImg = document.getElementById('new-cert-img');
const addErrorMsg = document.getElementById('addErrorMsg');

const projectsContainer = document.getElementById('projects-container');
const adminProjectsList = document.getElementById('admin-projects-list');
const addProjBtn = document.getElementById('addProjBtn');
const newProjTitle = document.getElementById('new-proj-title');
const newProjDesc = document.getElementById('new-proj-desc');
const newProjTech = document.getElementById('new-proj-tech');
const newProjGithub = document.getElementById('new-proj-github');
const newProjDemo = document.getElementById('new-proj-demo');
const newProjMedia = document.getElementById('new-proj-media');
const addProjErrorMsg = document.getElementById('addProjErrorMsg');

const saveCertsBtn = document.getElementById('saveCertsBtn');
const saveSuccessMsg = document.getElementById('saveSuccessMsg');

// Simple hardcoded password for demonstration
const ADMIN_PASSWORD = "password123";

// Store data
let certsData = [];
let projectsData = [];
let resumeData = null;

// Resume Elements
const adminResumeUpload = document.getElementById('admin-resume-upload');
const uploadResumeBtn = document.getElementById('uploadResumeBtn');
const resumeStatusMsg = document.getElementById('resume-status-msg');
const resumeSuccessMsg = document.getElementById('resumeSuccessMsg');
const resumeDownloadLink = document.getElementById('resume-download-link');
function loadData() {
    const savedResume = localStorage.getItem('portfolio-resume-dynamic');
    if (savedResume) {
        resumeData = savedResume;
        resumeDownloadLink.href = resumeData;
        resumeDownloadLink.setAttribute('download', 'Sahil_Karwatkar_Resume.pdf');
    } else {
        resumeData = null;
        resumeDownloadLink.href = 'resume.pdf';
        resumeDownloadLink.setAttribute('download', 'Sahil_Karwatkar_Resume.pdf');
    }

    const savedCerts = localStorage.getItem('portfolio-certs-dynamic');
    if (savedCerts) {
        certsData = JSON.parse(savedCerts);
    } else {
        // Fallback default certificates
        certsData = [
            { id: Date.now() + 1, title: 'Python for Data Science', provider: 'Coursera', img: 'https://placehold.co/400x300/1e1e24/00ffcc?text=Python+Certificate' },
            { id: Date.now() + 2, title: 'Responsive Web Design', provider: 'freeCodeCamp', img: 'https://placehold.co/400x300/1e1e24/cc00ff?text=Web+Dev+Certificate' },
            { id: Date.now() + 3, title: 'Machine Learning Basics', provider: 'Udacity', img: 'https://placehold.co/400x300/1e1e24/00ccff?text=AI+Certificate' }
        ];
    }

    const savedProjects = localStorage.getItem('portfolio-projects-dynamic');
    if (savedProjects) {
        projectsData = JSON.parse(savedProjects);
    } else {
        // Fallback default projects
        projectsData = [
            { id: Date.now() + 11, title: 'AI Chat Assistant', desc: 'A smart chatbot built using large language models to assist with daily tasks and programming queries.', tech: 'Python, OpenAI API, Flask', github: '#', demo: '#' },
            { id: Date.now() + 12, title: 'Portfolio Website', desc: 'A modern, responsive personal portfolio website with a dark theme, neon accents, and an animated background.', tech: 'HTML, CSS, JavaScript', github: '#', demo: '#' },
            { id: Date.now() + 13, title: 'VLSI Logic Simulator', desc: 'A basic logic gate simulator focusing on basic digital electronics and VLSI concepts.', tech: 'C++, Verilog', github: '#', demo: '' }
        ];
    }

    saveToLocalStorage();
    renderCerts();
    renderProjects();
}

// Image compression helper to prevent localStorage quota issues
function compressImage(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => callback(e.target.result);
        if (file) reader.readAsDataURL(file);
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const MAX_WIDTH = 800; // limit size to keep base64 string small
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = Math.round(height * (MAX_WIDTH / width));
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = Math.round(width * (MAX_HEIGHT / height));
                    height = MAX_HEIGHT;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.6)); // 60% quality JPEG
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('portfolio-certs-dynamic', JSON.stringify(certsData));
        localStorage.setItem('portfolio-projects-dynamic', JSON.stringify(projectsData));
        if (resumeData) {
            localStorage.setItem('portfolio-resume-dynamic', resumeData);
        } else {
            localStorage.removeItem('portfolio-resume-dynamic');
        }
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            alert('Storage limit exceeded! LocalStorage is full (browsers limit this to ~5MB). The files you uploaded together might be too large. We have added image compression, but you may still need to replace large videos or PDFs.');
        } else {
            alert('An error occurred while saving: ' + e.message);
        }
        return false;
    }
}

// Render certificates on the main page
function renderCerts() {
    certsContainer.innerHTML = '';

    if (certsData.length === 0) {
        certsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No certificates added yet.</p>';
        return;
    }

    certsData.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'cert-card glass-panel';
        card.onclick = () => openModal(cert.img);

        card.innerHTML = `
            <img src="${cert.img}" alt="${cert.title} Certificate">
            <div class="cert-info">
                <h3>${cert.title}</h3>
                <p>${cert.provider}</p>
            </div>
        `;
        certsContainer.appendChild(card);
    });
}

// Render projects on the main page
function renderProjects() {
    projectsContainer.innerHTML = '';

    if (projectsData.length === 0) {
        projectsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No projects added yet.</p>';
        return;
    }

    projectsData.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card glass-panel';

        let techHtml = '';
        if (proj.tech) {
            const techs = proj.tech.split(',').map(t => t.trim()).filter(t => t);
            techHtml = `<div class="tech-stack">${techs.map(t => `<span>${t}</span>`).join('')}</div>`;
        }

        let linksHtml = '<div class="project-links">';
        if (proj.github) linksHtml += `<a href="${proj.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
        if (proj.demo) linksHtml += `<a href="${proj.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
        linksHtml += '</div>';

        let mediaHtml = '';
        if (proj.media && proj.media.length > 0) {
            mediaHtml = '<div class="project-media-slider" style="margin-bottom: 15px; display: flex; overflow-x: auto; gap: 10px; padding-bottom: 5px;">';
            proj.media.forEach(m => {
                if (m.type === 'image') {
                    mediaHtml += `<img src="${m.src}" style="height: 150px; border-radius: 4px; border: 1px solid var(--glass-border); flex-shrink: 0; object-fit: cover;">`;
                } else if (m.type === 'video') {
                    mediaHtml += `<video src="${m.src}" style="height: 150px; border-radius: 4px; border: 1px solid var(--glass-border); flex-shrink: 0;" controls mute></video>`;
                }
            });
            mediaHtml += '</div>';
        }

        card.innerHTML = `
            <div class="project-content">
                ${mediaHtml}
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                ${techHtml}
                ${linksHtml}
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

// Render certificates in the admin modal for editing
function renderAdminCerts() {
    adminCertsList.innerHTML = '';

    if (certsData.length === 0) {
        adminCertsList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No certificates to manage.</p>';
        return;
    }

    certsData.forEach((cert, index) => {
        const group = document.createElement('div');
        group.className = 'edit-cert-group';
        group.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;">Certificate ${index + 1}</h3>
                <button class="btn btn-secondary delete-cert-btn" data-id="${cert.id}" style="padding: 5px 10px; margin: 0; font-size: 0.8rem; border-color: var(--neon-pink); color: var(--neon-pink); box-shadow: none;">Delete</button>
            </div>
            <input type="text" class="admin-input edit-title" data-id="${cert.id}" value="${cert.title}" placeholder="Title">
            <input type="text" class="admin-input edit-provider" data-id="${cert.id}" value="${cert.provider}" placeholder="Provider">
            <div style="margin-bottom: 10px;">
                <label style="color: var(--text-muted); font-size: 0.9rem; display: block; margin-bottom: 5px;">Change Image:</label>
                <input type="file" accept="image/*" class="admin-input edit-img" data-id="${cert.id}" style="padding: 9px 15px;">
            </div>
            <div style="margin-bottom: 15px;">
                <img src="${cert.img}" style="max-width: 100px; max-height: 100px; border-radius: 4px; border: 1px solid var(--glass-border);">
            </div>
        `;
        adminCertsList.appendChild(group);
    });

    // Add delete listeners
    document.querySelectorAll('.delete-cert-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idToRemove = parseInt(e.target.getAttribute('data-id'));
            certsData = certsData.filter(c => c.id !== idToRemove);
            renderAdminCerts(); // Re-render admin list
        });
    });

    // Add input listeners to update array dynamically as user types
    document.querySelectorAll('.edit-title').forEach(input => {
        input.addEventListener('change', (e) => updateCertField(e, 'title'));
    });
    document.querySelectorAll('.edit-provider').forEach(input => {
        input.addEventListener('change', (e) => updateCertField(e, 'provider'));
    });
    document.querySelectorAll('.edit-img').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const file = e.target.files[0];
            if (file) {
                compressImage(file, (base64String) => {
                    const certIndex = certsData.findIndex(c => c.id === id);
                    if (certIndex > -1) {
                        certsData[certIndex]['img'] = base64String;
                        renderAdminCerts(); // Re-render to show updated image preview
                    }
                });
            }
        });
    });
}

function updateCertField(event, fieldType) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const newValue = event.target.value;
    const certIndex = certsData.findIndex(c => c.id === id);
    if (certIndex > -1) {
        certsData[certIndex][fieldType] = newValue;
    }
}

// Render projects in the admin modal for editing
function renderAdminProjects() {
    adminProjectsList.innerHTML = '';

    if (projectsData.length === 0) {
        adminProjectsList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No projects to manage.</p>';
        return;
    }

    projectsData.forEach((proj, index) => {
        const group = document.createElement('div');
        group.className = 'edit-cert-group';
        let mediaThumbsHtml = '';
        if (proj.media && proj.media.length > 0) {
            mediaThumbsHtml = '<div style="display: flex; gap: 5px; margin-top: 10px; overflow-x: auto;">';
            proj.media.forEach(m => {
                if (m.type === 'image') {
                    mediaThumbsHtml += `<img src="${m.src}" style="height: 60px; width: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--glass-border);">`;
                } else if (m.type === 'video') {
                    mediaThumbsHtml += `<video src="${m.src}" style="height: 60px; width: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--glass-border);" mute></video>`;
                }
            });
            mediaThumbsHtml += '</div>';
        }

        group.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;">Project ${index + 1}</h3>
                <button class="btn btn-secondary delete-proj-btn" data-id="${proj.id}" style="padding: 5px 10px; margin: 0; font-size: 0.8rem; border-color: var(--neon-pink); color: var(--neon-pink); box-shadow: none;">Delete</button>
            </div>
            <input type="text" class="admin-input edit-proj-title" data-id="${proj.id}" value="${proj.title}" placeholder="Title">
            <textarea class="admin-input edit-proj-desc" data-id="${proj.id}" placeholder="Description" rows="3" style="resize: vertical;">${proj.desc}</textarea>
            <input type="text" class="admin-input edit-proj-tech" data-id="${proj.id}" value="${proj.tech}" placeholder="Tech Stack (comma separated)">
            <input type="text" class="admin-input edit-proj-github" data-id="${proj.id}" value="${proj.github}" placeholder="GitHub Link">
            <input type="text" class="admin-input edit-proj-demo" data-id="${proj.id}" value="${proj.demo}" placeholder="Live Demo Link">
            <div style="margin-top: 10px;">
                <label style="color: var(--text-muted); font-size: 0.9rem; display: block; margin-bottom: 5px;">Add more Media:</label>
                <input type="file" accept="image/*,video/*" multiple class="admin-input edit-proj-media" data-id="${proj.id}" style="padding: 9px 15px;">
                ${mediaThumbsHtml}
                ${proj.media && proj.media.length > 0 ? `<button class="btn btn-secondary clear-proj-media-btn" data-id="${proj.id}" style="margin-top: 5px; font-size: 0.8rem; padding: 4px 8px; border-color: var(--neon-pink); color: var(--neon-pink);">Clear Media</button>` : ''}
            </div>
        `;
        adminProjectsList.appendChild(group);
    });

    // Add delete listeners
    document.querySelectorAll('.delete-proj-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idToRemove = parseInt(e.target.getAttribute('data-id'));
            projectsData = projectsData.filter(p => p.id !== idToRemove);
            renderAdminProjects();
        });
    });

    // Add media clear listeners
    document.querySelectorAll('.clear-proj-media-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idToClear = parseInt(e.target.getAttribute('data-id'));
            const projIndex = projectsData.findIndex(p => p.id === idToClear);
            if (projIndex > -1) {
                projectsData[projIndex].media = [];
                renderAdminProjects();
            }
        });
    });

    // Add media add listeners
    document.querySelectorAll('.edit-proj-media').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const files = Array.from(e.target.files);

            if (files.length > 0) {
                const mediaPromises = files.map(file => {
                    return new Promise((resolve) => {
                        if (file.type.startsWith('image/')) {
                            compressImage(file, (base64String) => {
                                resolve({ type: 'image', src: base64String });
                            });
                        } else {
                            const reader = new FileReader();
                            reader.onload = (ev) => resolve({
                                type: 'video',
                                src: ev.target.result
                            });
                            reader.readAsDataURL(file);
                        }
                    });
                });

                Promise.all(mediaPromises).then(mediaArray => {
                    const projIndex = projectsData.findIndex(p => p.id === id);
                    if (projIndex > -1) {
                        // Append new media to existing media array or create new one
                        projectsData[projIndex].media = [...(projectsData[projIndex].media || []), ...mediaArray];
                        renderAdminProjects();
                    }
                });
            }
        });
    });

    // Add input listeners
    const fields = ['title', 'desc', 'tech', 'github', 'demo'];
    fields.forEach(field => {
        document.querySelectorAll(`.edit-proj-${field}`).forEach(input => {
            input.addEventListener('change', (e) => updateProjField(e, field));
        });
    });
}

function updateProjField(event, fieldType) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const newValue = event.target.value;
    const projIndex = projectsData.findIndex(p => p.id === id);
    if (projIndex > -1) {
        projectsData[projIndex][fieldType] = newValue;
    }
}

function renderAdminResume() {
    if (resumeData) {
        resumeStatusMsg.textContent = "Resume currently uploaded and ready.";
        resumeStatusMsg.style.color = "var(--text-muted)";
    } else {
        resumeStatusMsg.textContent = "No resume uploaded.";
        resumeStatusMsg.style.color = "var(--neon-pink)";
    }
}



// --- Event Listeners for Modals ---

openAdminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminLoginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

closeAdminLogin.addEventListener('click', () => {
    adminLoginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    adminPasswordInput.value = '';
    adminError.style.display = 'none';
});

loginBtn.addEventListener('click', () => {
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
        adminLoginModal.style.display = 'none';
        adminPasswordInput.value = '';
        adminError.style.display = 'none';

        // Render current list
        renderAdminCerts();
        renderAdminProjects();
        renderAdminResume();
        adminEditModal.style.display = 'flex';
    } else {
        adminError.style.display = 'block';
    }
});

closeAdminEdit.addEventListener('click', () => {
    adminEditModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    saveSuccessMsg.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == adminLoginModal) {
        adminLoginModal.style.display = "none";
        document.body.style.overflow = 'auto';
        adminPasswordInput.value = '';
        adminError.style.display = 'none';
    }
    if (event.target == adminEditModal) {
        adminEditModal.style.display = "none";
        document.body.style.overflow = 'auto';
        saveSuccessMsg.style.display = 'none';
    }
});

// --- Action Listeners ---

uploadResumeBtn.addEventListener('click', () => {
    const file = adminResumeUpload.files[0];
    if (!file) {
        resumeStatusMsg.textContent = "Please select a PDF file first.";
        resumeStatusMsg.style.color = "var(--neon-pink)";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        resumeData = event.target.result;
        renderAdminResume();

        resumeSuccessMsg.style.display = 'block';
        setTimeout(() => {
            resumeSuccessMsg.style.display = 'none';
        }, 2000);

        resumeDownloadLink.href = resumeData;
        resumeDownloadLink.setAttribute('download', 'Sahil_Karwatkar_Resume.pdf');
    };
    reader.readAsDataURL(file);
});



addCertBtn.addEventListener('click', () => {
    const title = newCertTitle.value.trim();
    const provider = newCertProvider.value.trim();
    const file = newCertImg.files[0];

    if (!title || !provider || !file) {
        addErrorMsg.style.display = 'block';
        return;
    }

    addErrorMsg.style.display = 'none';

    // Read and compress file
    compressImage(file, (base64String) => {
        // Create new cert object
        const newCert = {
            id: Date.now(),
            title,
            provider,
            img: base64String
        };

        // Add to array
        certsData.push(newCert);

        // Clear inputs
        newCertTitle.value = '';
        newCertProvider.value = '';
        newCertImg.value = '';

        // Re-render admin list
        renderAdminCerts();
    });
});

addProjBtn.addEventListener('click', () => {
    const title = newProjTitle.value.trim();
    const desc = newProjDesc.value.trim();
    const tech = newProjTech.value.trim();
    const github = newProjGithub.value.trim();
    const demo = newProjDemo.value.trim();

    if (!title || !desc || !tech) {
        addProjErrorMsg.style.display = 'block';
        return;
    }

    addProjErrorMsg.style.display = 'none';

    // Helper to read/compress multiple files
    const files = Array.from(newProjMedia.files);
    const mediaPromises = files.map(file => {
        return new Promise((resolve) => {
            if (file.type.startsWith('image/')) {
                compressImage(file, (base64String) => {
                    resolve({ type: 'image', src: base64String });
                });
            } else {
                const reader = new FileReader();
                reader.onload = (e) => resolve({
                    type: 'video',
                    src: e.target.result
                });
                reader.readAsDataURL(file);
            }
        });
    });

    Promise.all(mediaPromises).then(mediaArray => {
        const newProj = {
            id: Date.now(),
            title,
            desc,
            tech,
            github,
            demo,
            media: mediaArray
        };

        projectsData.push(newProj);

        newProjTitle.value = '';
        newProjDesc.value = '';
        newProjTech.value = '';
        newProjGithub.value = '';
        newProjDemo.value = '';
        newProjMedia.value = ''; // clear file input

        renderAdminProjects();
    });
});

saveCertsBtn.addEventListener('click', () => {
    // Overwrite local storage with the new current state of certsData and projectsData
    const success = saveToLocalStorage();

    // If saving failed (e.g. quota exceeded), don't close the modal
    if (!success) return;

    // Update main page DOM
    renderCerts();
    renderProjects();

    // Show success message briefly
    saveSuccessMsg.style.display = 'block';
    setTimeout(() => {
        saveSuccessMsg.style.display = 'none';
        adminEditModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 1500);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadData);
