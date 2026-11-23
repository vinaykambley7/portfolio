/**
 * Vinay Kambley - Portfolio Interactive Engine
 * Standalone Vanilla JavaScript (Clean, Fast, Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     01. Interactive Futuristic Particle Background Canvas
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const mouse = { x: null, y: null, radius: 150 };

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

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
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
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
            this.radius = this.baseRadius * 1.8;
          } else {
            this.radius = this.baseRadius;
          }
        }
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.7)' : 'rgba(2, 132, 199, 0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = isDark ? 'rgba(6, 182, 212, 0.5)' : 'rgba(2, 132, 199, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animate() {
      const isDark = document.body.classList.contains('dark-theme');
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = 1 - (dist / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark 
              ? `rgba(6, 182, 212, ${opacity * 0.25})` 
              : `rgba(2, 132, 199, ${opacity * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Connect to mouse if nearby
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
              ? `rgba(56, 189, 248, ${opacity * 0.4})` 
              : `rgba(2, 132, 199, ${opacity * 0.3})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }


  /* ==========================================================================
     02. Typewriter Effect for Hero
     ========================================================================== */
  const typewriterElem = document.getElementById('typewriter-text');
  if (typewriterElem) {
    const roles = [
      'Aadhaar Trainer & Portal Developer',
      'ESD MeeSeva (Govt of Telangana)',
      'Full-Stack Web Developer',
      'AIML Engineer',
      'React & TypeScript Specialist',
      'UI/UX Driven Systems Builder'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 40;
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
     03. Dark / Light Theme Toggle
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
    });
  }


  /* ==========================================================================
     04. Mobile Navigation Menu Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }


  /* ==========================================================================
     05. ScrollSpy - Active Navbar Link Highlight
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
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

    // Back to top visibility
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
    });
  }


  /* ==========================================================================
     06. Project Category Filtering
     ========================================================================== */
  const projectFilterBtns = document.querySelectorAll('#project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

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
     07. Skills Category Filtering
     ========================================================================== */
  const skillFilterBtns = document.querySelectorAll('#skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

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
     08. Project Architecture Modal
     ========================================================================== */
  const projectData = {
    'esd-ask-desk': {
      title: 'ESD ASK Desk – Operations & EOD Management Portal',
      subtitle: 'Multi-Center Operations & Automated EOD Analytics',
      badge: 'Operations & Analytics (Govt. TS)',
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
  const archButtons = document.querySelectorAll('.btn-arch');

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

        // Features
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = '';
        data.features.forEach(feat => {
          const li = document.createElement('li');
          li.innerHTML = `<i class="fa-solid fa-check"></i> <span>${feat}</span>`;
          featuresContainer.appendChild(li);
        });

        // Tech tags
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        data.tech.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t;
          techContainer.appendChild(span);
        });

        // Links
        const liveLink = document.getElementById('modal-live-link');
        const githubLink = document.getElementById('modal-github-link');
        liveLink.href = data.liveUrl;
        githubLink.href = data.githubUrl;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
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
     09. Interactive Cursor Tilt & Zoom on Hero Profile Photo
     ========================================================================== */
  const avatarFrame = document.getElementById('avatar-frame');
  if (avatarFrame) {
    avatarFrame.addEventListener('mousemove', (e) => {
      const rect = avatarFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      avatarFrame.style.transform = `perspective(1000px) scale(1.18) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    avatarFrame.addEventListener('mouseleave', () => {
      avatarFrame.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }


  /* ==========================================================================
     10. Contact Form Simulation
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. Vinay will reply soon.';
        }

        contactForm.reset();

        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }

        setTimeout(() => {
          if (formStatus) formStatus.innerHTML = '';
        }, 6000);
      }, 1200);
    });
  }

});
