const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Scroll animations
const animateElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Interactive Futuristic Background Animation
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 70);
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
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 3;
                    this.y -= (dy / dist) * force * 3;
                }
            }
        }

        draw(isDark) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(59, 130, 246, 0.4)';
            ctx.fill();
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
        const isDark = document.body.classList.contains('dark-mode');
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    const opacity = 1 - (dist / 115);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = isDark 
                        ? `rgba(96, 165, 250, ${opacity * 0.2})` 
                        : `rgba(59, 130, 246, ${opacity * 0.12})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw(isDark);
        });

        requestAnimationFrame(animate);
    }

    animate();
}
