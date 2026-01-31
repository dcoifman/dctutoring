/* ============================================
   DC TUTORING - Main JavaScript
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRevealAnimations();
  initCounterAnimations();
  initSmoothScroll();
  initFormHandling();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Scroll handling for nav background
  let lastScroll = 0;
  
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
  
  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      navToggle?.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   REVEAL ANIMATIONS (Intersection Observer)
   ============================================ */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide, .reveal-scale');
  
  if (!revealElements.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing to improve performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  // Trigger hero elements immediately with stagger
  const heroElements = document.querySelectorAll('.hero .reveal-fade, .hero .reveal-slide');
  heroElements.forEach((el, index) => {
    const delay = el.dataset.delay ? parseInt(el.dataset.delay) * 100 : index * 100;
    setTimeout(() => {
      el.classList.add('revealed');
    }, 300 + delay);
  });
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-count]');
  
  if (!counters.length) return;
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
      
      counter.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  });
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initFormHandling() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
      <span>Sending...</span>
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
          <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `;
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success state
    submitBtn.innerHTML = `
      <span>Message Sent!</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    `;
    submitBtn.style.background = '#22c55e';
    
    // Reset form
    form.reset();
    
    // Reset button after delay
    setTimeout(() => {
      submitBtn.innerHTML = originalContent;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  });
  
  // Add focus animations to inputs
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

/* ============================================
   ADDITIONAL MICRO-INTERACTIONS
   ============================================ */

// Add hover parallax effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Add magnetic effect to CTA buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// Add typing effect to hero badge (optional enhancement)
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
  const text = heroBadge.textContent.trim();
  // Badge already has content, so we just add a subtle animation class
  heroBadge.style.animation = 'fadeSlideIn 0.6s ease forwards';
}

// Add CSS for the typing animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .form-group.focused label {
    color: var(--color-accent);
  }
`;
document.head.appendChild(style);

// Console branding
console.log(
  '%cDC Tutoring',
  'font-size: 24px; font-weight: bold; color: #D4A43B; font-family: "Space Grotesk", sans-serif;'
);
console.log(
  '%cBuilt with care for academic excellence.',
  'font-size: 12px; color: #A1A1A6;'
);
