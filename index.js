/**
 * Vinay Kambley - Next-Gen Cyber Interactive Engine
 * 3D Grid Canvas, Web Audio API SFX, Custom Cursor, Dynamic Card Tilt & Blueprint Modals
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01. Web Audio API Cyber Synthetics Engine (Optional & Muteable)
     ========================================================================== */
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(type = 'hover') {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        // Subtle cyber blip (high-tech frequency chirp, very quiet)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(1900, now + 0.05);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        // Laser confirmation pulse
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Audio context policy safe ignore
    }
  }

  // SFX Toggle Button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      sfxToggleBtn.classList.toggle('muted', !sfxEnabled);
      if (sfxEnabled) playCyberTone('click');
    });
  }

  // Bind sound events to interactive elements
  document.querySelectorAll('[data-sound="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => playCyberTone('hover'));
  });

  document.querySelectorAll('[data-sound="click"]').forEach(el => {
    el.addEventListener('click', () => playCyberTone('click'));
  });


  /* ==========================================================================
     02. Custom Cyber Cursor (Desktop)
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth spring follow loop for ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover state expansion
    const interactiveTargets = document.querySelectorAll('a, button, input, textarea, .avatar-holo-pod, .cyber-project-card, .matrix-card');
    interactiveTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }


  /* ==========================================================================
     03. Dual Interactive Background: 3D Grid + Constellation Particles
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 13000), 70);
    const mouse = { x: null, y: null, radius: 170 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class CyberParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.75;
        this.vy = (Math.random() - 0.5) * 0.75;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
        this.isPurple = Math.random() > 0.65;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3.5;
            this.y -= (dy / dist) * force * 3.5;
            this.radius = this.baseRadius * 2;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.isPurple) {
          ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(147, 51, 234, 0.65)';
          ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
        } else {
          ctx.fillStyle = isDark ? 'rgba(0, 240, 255, 0.85)' : 'rgba(2, 132, 199, 0.7)';
          ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
        }
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new CyberParticle());
      }
    }

    initParticles();

    // 3D Grid parameters
    let gridOffset = 0;

    function renderCanvas() {
      const isDark = document.body.classList.contains('dark-theme');
      ctx.clearRect(0, 0, width, height);

      // Render perspective moving grid at the bottom third of screen
      const horizonY = height * 0.65;
      gridOffset = (gridOffset + 0.4) % 40;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, width, height - horizonY);
      ctx.clip();

      const gridColor = isDark ? 'rgba(0, 240, 255, 0.12)' : 'rgba(2, 132, 199, 0.08)';
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Horizontal moving lines with exponential perspective
      for (let y = horizonY + gridOffset; y < height; y += (y - horizonY) * 0.25 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical converging lines to horizon center
      const vanishingX = width * 0.5;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // Constellation Connecting Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const opacity = 1 - (dist / 125);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark 
              ? `rgba(0, 240, 255, ${opacity * 0.3})` 
              : `rgba(2, 132, 199, ${opacity * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Mouse Constellation Connection
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const opacity = 1 - (dist / mouse.radius);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark 
              ? `rgba(0, 255, 157, ${opacity * 0.5})` 
              : `rgba(2, 132, 199, ${opacity * 0.35})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }

      // Update and Draw Particles
      particles.forEach(p => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }


  /* ==========================================================================
     04. Terminal Console Typewriter Effect
     ========================================================================== */
  const typewriterElem = document.getElementById('typewriter-text');
  if (typewriterElem) {
    const roles = [
      'Aadhaar Trainer & Portal Developer',
      'ESD MeeSeva (Govt of Telangana)',
      '5 ASK Centers Automated // Supabase Sync',
      'Full-Stack Web & AIML Engineer',
      'VBIT Hyderabad (2022-2025)',
      'UIDAI Client Systems & Release Auditor'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 65;
    const deletingSpeed = 35;
    const pauseDelay = 2200;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElem.textContent = currentRole.substring(0, charIndex);
      } else {
        charIndex++;
        typewriterElem.textContent = currentRole.substring(0, charIndex);
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeEffect, timeout);
    }

    setTimeout(typeEffect, 600);
  }


  /* ==========================================================================
     05. Dark / Light Mode Toggle
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('vk_theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('vk_theme', theme);
  }

  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyDark = document.body.classList.contains('dark-theme');
      applyTheme(isCurrentlyDark ? 'light' : 'dark');
      playCyberTone('click');
    });
  }


  /* ==========================================================================
     06. Mobile Menu Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      playCyberTone('click');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }


  /* ==========================================================================
     07. ScrollSpy Active Highlight & Back to Top Button
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playCyberTone('click');
    });
  }


  /* ==========================================================================
     08. Project Filtering Engine
     ========================================================================== */
  const projectFilterBtns = document.querySelectorAll('#project-filters .cyber-filter-btn');
  const projectCards = document.querySelectorAll('.cyber-project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  /* ==========================================================================
     09. Skills Category Filtering
     ========================================================================== */
  const skillFilterBtns = document.querySelectorAll('#skills-filter .cyber-filter-btn');
  const skillCards = document.querySelectorAll('.skill-cyber-node');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ==========================================================================
     10. Dynamic 3D Card Tilt & Specular Sheen (Hero Photo + Cards)
     ========================================================================== */
  // Hero Photo Pod Extreme Hover Zoom & 3D Tilt
  const avatarPod = document.getElementById('avatar-holo-pod');
  if (avatarPod) {
    avatarPod.addEventListener('mousemove', (e) => {
      const rect = avatarPod.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      avatarPod.style.transform = `perspective(1000px) scale(1.22) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });

    avatarPod.addEventListener('mouseleave', () => {
      avatarPod.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  // 3D Tilt for Project Cards
  document.querySelectorAll('.cyber-project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });


  /* ==========================================================================
     11. Project Architecture Blueprint Modal
     ========================================================================== */
  const projectData = {
    'esd-ask-desk': {
      title: 'ESD ASK Desk – Operations & EOD Management Portal',
      subtitle: 'Multi-Center Operations & Automated EOD Analytics',
      badge: 'Operations & Analytics // Govt TS',
      desc: 'Developed a comprehensive multi-center operations web portal for 5 Aadhaar Seva Kendra (ASK) centers with real-time Supabase cloud synchronization. Automated client-side parsing of official daily EOD reports (Excel/PDF) using SheetJS and regex extraction, eliminating manual calculation errors. Built an interactive executive dashboard with day-by-day compliance tracking, operator deployment rosters, and hardware grievance ticketing.',
      features: [
        'Multi-center operations web portal deployed across 5 Aadhaar Seva Kendra (ASK) centers',
        'Real-time Supabase (PostgreSQL) and Firebase cloud database synchronization',
        'Automated client-side parsing of official daily EOD reports (Excel/PDF) via SheetJS and regex extraction',
        'Complete elimination of manual calculation errors with automated reconciliation algorithms',
        'Interactive executive dashboard with day-by-day compliance tracking and Chart.js analytics',
        'Dynamic operator deployment rosters and integrated hardware grievance ticketing workflow'
      ],
      tech: ['JavaScript', 'Supabase (PostgreSQL)', 'Firebase', 'SheetJS', 'Chart.js', 'Bootstrap'],
      liveUrl: 'https://ask-managers-portal.web.app/',
      githubUrl: 'https://github.com/vinaykambley/esd-ask-desk'
    },
    'skillconnect': {
      title: 'SkillConnect',
      subtitle: 'On-Demand Skilled Service Marketplace',
      badge: 'Featured Full-Stack',
      desc: 'Full-stack marketplace connecting homeowners with verified local trade professionals. Includes a 13-step provider onboarding wizard with a 10+ photo showcase gallery, a 9-stage real-time booking lifecycle, direct in-app messaging, verified reviews, and admin verification desk for evaluating trade licenses and credentials.',
      features: [
        '13-step provider onboarding wizard with document verification and license check',
        '10+ work photo portfolio gallery per verified service professional',
        '9-stage real-time booking lifecycle with dynamic state progression',
        'Direct in-app messaging between customers and service providers',
        'Verified customer review & star rating system',
        'Administrative verification desk for inspecting trade certificates'
      ],
      tech: ['React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
      liveUrl: 'https://skillconnect-app.netlify.app/',
      githubUrl: 'https://github.com/vinaykambley/skillconnect'
    },
    'daily-work-portal': {
      title: 'Engineering Daily Work & Verification Portal',
      subtitle: 'Enterprise Reporting & Workflow Platform',
      badge: 'Enterprise Architecture',
      desc: 'Mission-critical enterprise reporting platform built for engineering operations. Features a 3-tier approval hierarchy (Engineer -> Team Lead -> Plant Head), real-time cross-device synchronization with Firestore onSnapshot listeners, role-based access control (RBAC), and automated 1-click export engines for Excel and PDF.',
      features: [
        '3-Tier hierarchical approval workflow (Engineer -> Team Lead -> Admin/Plant Head)',
        'Live cross-device synchronization using Cloud Firestore onSnapshot listeners',
        'Role-Based Access Control (RBAC) with granular security rules',
        'Touch-optimized mobile user interface tailored for field engineers',
        'Full-screen side-by-side audit and revision comparisons',
        'Automated 1-click Excel & PDF export engines for management reporting'
      ],
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Google Firebase', 'Cloud Firestore'],
      liveUrl: 'https://engineering-work-portal.web.app',
      githubUrl: 'https://github.com/vinaykambley/engineering-work-portal'
    },
    'edplus-nihongo-path': {
      title: 'EdPlus-Nihongo-Path',
      subtitle: 'Japanese Language Learning Platform',
      badge: 'EdTech & Gamification',
      desc: 'An interactive Japanese learning portal built to take learners from absolute basics to intermediate fluency. Features structured modules for Hiragana, Katakana, and Kanji, interactive retention quizzes, grammar breakdowns, audio pronunciation helpers, and progress tracking.',
      features: [
        'Structured curriculum covering Hiragana, Katakana, Kanji, and JLPT foundations',
        'Interactive quizzes with instant scoring and explanation feedback',
        'Visual student progress tracking with milestone completion badges',
        'Fast server-side rendering for optimal lesson delivery and smooth transitions'
      ],
      tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      liveUrl: 'https://edplus-nihongo-path.vercel.app/',
      githubUrl: 'https://github.com/vinaykambley/edplus-nihongo-path'
    },
    'careconnect': {
      title: 'CareConnect',
      subtitle: 'Role-Based Healthcare Management System',
      badge: 'Healthcare Management',
      desc: 'A multi-role clinical management web application designed to coordinate patient care across departments. Receptionists register patients and assign them to doctors. Doctors examine patients, record vital signs, and issue digital prescriptions. Pharmacists review the prescriptions and dispense medications.',
      features: [
        '3 Dedicated role modules: Receptionist, Doctor, and Pharmacist',
        'Patient intake registration and real-time doctor queue assignment',
        'Digital prescription creation and clinical treatment logs',
        'Pharmacy verification module with medication dispensing confirmation'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'DOM Storage'],
      liveUrl: 'https://vinaykambley7.github.io/Careconnect/',
      githubUrl: 'https://github.com/vinaykambley7/Careconnect'
    },
    'ticket-world': {
      title: 'Ticket World',
      subtitle: 'Event, Movie & Concert Booking Platform',
      badge: 'Entertainment Portal',
      desc: 'Ticket World brings a sleek, movie-and-concert booking experience directly to the browser. Features categorized event catalogues, interactive seating tiers, dynamic total cost computation, and an intuitive checkout flow.',
      features: [
        'Multi-category entertainment discovery (Cinema, Concerts, Sports)',
        'Interactive seat map and tier selector',
        'Real-time price calculation and instant booking confirmation preview',
        'Modern dark UI aesthetic tailored for entertainment browsing'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      liveUrl: 'https://vinaykambley7.github.io/ticketWorld/',
      githubUrl: 'https://github.com/vinaykambley7/ticketWorld'
    },
    'grievance-support-hub': {
      title: 'Grievance Support Hub',
      subtitle: 'Aadhaar Training Support & Resolution Tracker',
      badge: 'Support & Ticketing',
      desc: 'A user-friendly grievance reporting and tracking web application specifically crafted for training support. Users fill out a streamlined form to register issues, immediately receive a tracked grievance ticket, and monitor its real-time lifecycle from submission to resolution.',
      features: [
        'Instant unique Grievance ID generation on submission',
        'Dynamic ticket timeline with stage-by-stage status tracking',
        'Form validation with clear error feedback and category tagging',
        'Clean UI designed for fast issue resolution monitoring'
      ],
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
      liveUrl: 'https://gravience-support-hub.vercel.app/',
      githubUrl: 'https://github.com/vinaykambley/grievance-support-hub'
    },
    's-truck-delivery': {
      title: 'S-Truck Delivery',
      subtitle: 'Industrial & Goods Transport Booking',
      badge: 'Logistics System',
      desc: 'A logistics web portal designed for simple and reliable truck booking. Users can browse various transport vehicle categories based on tonnage, specify pickup and delivery waypoints, and seamlessly schedule dispatch times with instant route summaries.',
      features: [
        'Fleet category selection (Mini truck, medium cargo, heavy freight)',
        'Structured pickup and drop location input forms',
        'Date and time scheduler for on-demand logistics dispatch',
        'Responsive design and interactive dynamic DOM components'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      liveUrl: 'https://vinaykambley.github.io/s-truck-delivery/',
      githubUrl: 'https://github.com/vinaykambley/s-truck-delivery'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const archButtons = document.querySelectorAll('.btn-blueprint');

  archButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];

      if (data && modal) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-subtitle').textContent = data.subtitle;
        document.getElementById('modal-badge').textContent = data.badge;
        document.getElementById('modal-desc').textContent = data.desc;

        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = '';
        data.features.forEach(feat => {
          const li = document.createElement('li');
          li.innerHTML = `<i class="fa-solid fa-check text-cyan"></i> <span>${feat}</span>`;
          featuresContainer.appendChild(li);
        });

        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        data.tech.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-pill';
          span.textContent = t;
          techContainer.appendChild(span);
        });

        const liveLink = document.getElementById('modal-live-link');
        const githubLink = document.getElementById('modal-github-link');
        liveLink.href = data.liveUrl;
        githubLink.href = data.githubUrl;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        playCyberTone('click');
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      playCyberTone('click');
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });


  /* ==========================================================================
     12. Transmission Console Form Simulation
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<span class="cyber-btn-content"><i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING PAYLOAD...</span>';
      }
      playCyberTone('click');

      setTimeout(() => {
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> TRANSMISSION CONFIRMED // PACKET RECEIVED BY VINAY KAMBLEY';
        }

        contactForm.reset();
        playCyberTone('hover');

        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<span class="cyber-btn-content"><i class="fa-solid fa-paper-plane"></i> DISPATCH TRANSMISSION</span>';
        }

        setTimeout(() => {
          if (formStatus) formStatus.innerHTML = '';
        }, 6000);
      }, 1400);
    });
  }

});
