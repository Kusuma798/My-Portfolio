// Animate skill bars when scrolled into view
document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar-fill');
  
    const animateSkills = (entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.getPropertyValue('--skill-level') || '0%';
          bar.style.width = width;
          observer.unobserve(bar);
        }
      });
    };
  
    const skillObserver = new IntersectionObserver(animateSkills, {threshold: 0.5});
    bars.forEach(bar => skillObserver.observe(bar));
  
    // Section fade in on scroll
    const sections = document.querySelectorAll('section');
    const revealSection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };
  
    const sectionObserver = new IntersectionObserver(revealSection, {
      threshold: 0.15
    });
    sections.forEach(section => sectionObserver.observe(section));
  
    // Highlight nav link based on scroll position
    const navLinks = document.querySelectorAll('nav ul li a');
    const sectionIds = Array.from(sections).map(s => s.id);
  
    window.addEventListener('scroll', () => {
      let scrollPos = window.scrollY + 100; // offset for header height
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPos) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = Array.from(navLinks).find(link => link.getAttribute('href') === '#' + sectionIds[i]);
          if (activeLink) activeLink.classList.add('active');
          break;
        }
      }
    });
  
    // Contact form submit simulation
    const form = document.getElementById('contact-form');
    const thankyouMsg = form.querySelector('.thankyou');
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Simple validation
      if (form.checkValidity()) {
        thankyouMsg.style.display = 'block';
        form.reset();
        setTimeout(() => {
          thankyouMsg.style.display = 'none';
        }, 4000);
      } else {
        form.reportValidity();
      }
    });
  
    // Theme toggle logic
    const themeToggle = document.getElementById('themeToggle');
  const iconSun = themeToggle.querySelector('.icon-sun');
  const iconMoon = themeToggle.querySelector('.icon-moon');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function updateToggleIcon(isDark) {
    if (isDark) {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  function setTheme(isDark) {
    if(isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    updateToggleIcon(isDark);
  }
  
    // Load saved preference or system preference
    let savedTheme = localStorage.getItem('portfolioTheme');
    if(savedTheme === null) {
      savedTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    }
    setTheme(savedTheme === 'dark');
  
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
      updateToggleIcon(isDark);
    });
  });
  
  // Starfield background animation with shooting stars that adapt colors
  (() => {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  
    const colorsLight = ['#f9c5d1', '#f78da7', '#ffb3c1', '#d1a3ff', '#a58bfc', '#d9cbfb', '#bc6ff1'];
    const colorsDark = ['#f9c5d1', '#e8d3f5', '#d1a3ff', '#9e55f9', '#a58bfc', '#d9cbfb', '#bc6ff1'];
  
    let currentColors = colorsLight;
  
    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.radius = Math.random() * 1.2 + 0.8;
        this.speed = (Math.random() * 1) + 0.2;
        this.color = currentColors[Math.floor(Math.random() * currentColors.length)];
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speed;
        if (this.y > height + this.radius) {
          this.reset();
          this.y = -this.radius;
        }
      }
      draw(ctx) {
        let twinkle = 0.5 + Math.sin(Date.now() / 400 + this.twinkleOffset) * 0.5;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        grad.addColorStop(0, this.color);
        grad.addColorStop(0.6, `rgba(255, 255, 255, ${0.6 * twinkle})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6 * twinkle;
        ctx.arc(this.x, this.y, this.radius * twinkle, 0, Math.PI*2);
        ctx.fill();
      }
    }
  
    class ShootingStar {
      constructor() {
        this.reset();
      }
      reset() {
        const fromTop = Math.random() < 0.5;
        if (fromTop) {
          this.x = Math.random() * width * 0.7;
          this.y = -20;
        } else {
          this.x = -20;
          this.y = Math.random() * height * 0.5;
        }
        this.length = Math.random() * 100 + 80;
        this.speed = Math.random() * 8 + 8;
        this.angle = Math.random() * 0.4 + 0.25; // radians, approx 14 to 23 degrees
        this.opacity = 0;
        this.opacityChange = 0.03;
        this.dead = false;
      }
      update() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        if (this.opacity < 1 && !this.dead) {
          this.opacity += this.opacityChange;
          if (this.opacity > 1) this.opacity = 1;
        }
        if (this.x > width + this.length || this.y > height + this.length) {
          this.dead = true;
          this.opacity -= this.opacityChange * 3;
          if (this.opacity <= 0) {
            this.reset();
            this.opacity = 0;
            this.dead = false;
          }
        }
      }
      draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * Math.cos(this.angle), this.y - this.length * Math.sin(this.angle));
        ctx.stroke();
        ctx.restore();
      }
    }
  
    let stars = [];
    let shootingStars = [];
    let starCount = Math.floor(width * height / 8000);
  
    function createStars() {
      stars = [];
      for(let i=0; i<starCount; i++) {
        stars.push(new Star());
      }
    }
    createStars();
  
    let lastShootingStarTime = 0;
    const shootingStarInterval = 2500;
  
    function animate(time = 0) {
      ctx.clearRect(0,0,width,height);
  
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
  
      if (time - lastShootingStarTime > shootingStarInterval) {
        if (Math.random() < 0.5) {
          shootingStars.push(new ShootingStar());
          lastShootingStarTime = time;
        }
      }
  
      shootingStars.forEach((star, index) => {
        star.update();
        star.draw(ctx);
        if(star.dead && star.opacity <= 0) {
          shootingStars.splice(index, 1);
        }
      });
  
      requestAnimationFrame(animate);
    }
    animate();
  
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      starCount = Math.floor(width * height / 8000);
      createStars();
    });
  
    // Listen for theme changes to update star colors
    function updateStarColors(isDark) {
      currentColors = isDark ? colorsDark : colorsLight;
      stars.forEach(star => star.color = currentColors[Math.floor(Math.random() * currentColors.length)]);
    }
  
    const body = document.body;
    const observer = new MutationObserver(() => {
      const isDark = body.classList.contains('dark-theme');
      updateStarColors(isDark);
    });
    observer.observe(body, { attributes: true, attributeFilter: ['class'] });
  })();
  
  