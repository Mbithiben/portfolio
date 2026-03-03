/**
 * ================================================================
 * BEN MBITHI PORTFOLIO — MAIN JAVASCRIPT
 * Author : Ben Mbithi
 * Version: 1.0.0
 * ================================================================
 *
 * TABLE OF CONTENTS
 * 1.  DOM Ready Initializer
 * 2.  Theme Toggle (Dark / Light)
 * 3.  Sidebar Navigation (Desktop + Mobile)
 * 4.  Smooth Scrolling & Active Nav Link
 * 5.  Typed Text Animation (Hero)
 * 6.  Scroll-triggered Animations (IntersectionObserver)
 * 7.  Skill Progress Bars Animation
 * 8.  Animated Counter (Stats)
 * 9.  Contact Form Validation & Submission
 * 10. Scroll-to-Top Button
 * 11. Footer Year
 * 12. Utility Helpers
 * ================================================================
 */

'use strict';

/* ================================================================
   1. DOM READY INITIALIZER
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initSmoothScroll();
  initTypedText();
  initScrollAnimations();
  initSkillBars();
  initCounters();
  initContactForm();
  initScrollTop();
  initFooterYear();
});


/* ================================================================
   2. THEME TOGGLE (DARK / LIGHT)
   ================================================================ */
function initTheme() {
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('themeToggle');
  const themeIcon    = document.getElementById('themeIcon');
  const themeLabel   = document.getElementById('themeLabel');
  const topbarTheme  = document.getElementById('topbarTheme');
  const topbarIcon   = document.getElementById('topbarThemeIcon');

  // Load saved preference or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  // Sidebar toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Topbar toggle button (mobile)
  if (topbarTheme) {
    topbarTheme.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /**
   * Apply a theme and persist the preference.
   * @param {string} theme - 'dark' | 'light'
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    const isDark = theme === 'dark';

    // Update sidebar button
    if (themeIcon)  themeIcon.className  = isDark ? 'bx bx-sun' : 'bx bx-moon';
    if (themeLabel) themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';

    // Update topbar button
    if (topbarIcon) topbarIcon.className = isDark ? 'bx bx-sun' : 'bx bx-moon';
  }
}


/* ================================================================
   3. SIDEBAR NAVIGATION (DESKTOP + MOBILE)
   ================================================================ */
function initSidebar() {
  const sidebar        = document.getElementById('sidebar');
  const menuToggle     = document.getElementById('menuToggle');
  const sidebarClose   = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (!sidebar) return;

  /**
   * Open the mobile sidebar.
   */
  function openSidebar() {
    sidebar.classList.add('is-open');
    sidebarOverlay.classList.add('is-active');
    sidebarOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    menuToggle && menuToggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close the mobile sidebar.
   */
  function closeSidebar() {
    sidebar.classList.remove('is-open');
    sidebarOverlay.classList.remove('is-active');
    sidebarOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
  }

  // Event listeners
  menuToggle     && menuToggle.addEventListener('click', openSidebar);
  sidebarClose   && sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay && sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar when a nav link is clicked (mobile)
  const navLinks = sidebar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });
}


/* ================================================================
   4. SMOOTH SCROLLING & ACTIVE NAV LINK
   ================================================================ */
function initSmoothScroll() {
  // Handle all anchor links that point to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const topbarHeight = window.innerWidth <= 768 ? 60 : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - topbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // Active nav link highlighting based on scroll position
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));
}


/* ================================================================
   5. TYPED TEXT ANIMATION (HERO)
   ================================================================ */
function initTypedText() {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const phrases = [
    'Full Stack Web Developer',
    'PHP & MySQL Expert',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Freelance Developer',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPE_SPEED   = 80;   // ms per character when typing
  const DELETE_SPEED = 40;   // ms per character when deleting
  const PAUSE_AFTER  = 2000; // ms to pause at full phrase
  const PAUSE_BEFORE = 500;  // ms to pause before typing next phrase

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        // Finished typing — pause then delete
        isPaused   = true;
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Start after a short delay
  setTimeout(type, 800);
}


/* ================================================================
   6. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
   ================================================================ */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.animate-fade-up, .animate-fade-right, .animate-fade-left'
  );

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedEls.forEach(el => observer.observe(el));
}


/* ================================================================
   7. SKILL PROGRESS BARS ANIMATION
   ================================================================ */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar     = entry.target;
          const width   = bar.getAttribute('data-width');
          // Slight delay for visual polish
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => observer.observe(bar));
}


/* ================================================================
   8. ANIMATED COUNTER (STATS)
   ================================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));

  /**
   * Animate a counter element from 0 to its target value.
   * @param {HTMLElement} el - The counter element
   */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800; // ms
    const step     = 16;   // ~60fps
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }
}


/* ================================================================
   9. CONTACT FORM VALIDATION & SUBMISSION
   ================================================================ */
function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const msgInput    = document.getElementById('message');
  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = submitBtn.querySelector('.btn-text');
  const btnLoading  = submitBtn.querySelector('.btn-loading');
  const successMsg  = document.getElementById('formSuccess');
  const errorMsg    = document.getElementById('formErrorMsg');

  // ── Real-time validation ──────────────────────────────────────
  nameInput.addEventListener('blur',  () => validateField(nameInput,  'nameError',  validateName));
  emailInput.addEventListener('blur', () => validateField(emailInput, 'emailError', validateEmail));
  msgInput.addEventListener('blur',   () => validateField(msgInput,   'messageError', validateMessage));

  // Clear error on input
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const errId = input.id + 'Error';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });

  // ── Form Submit ───────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameValid  = validateField(nameInput,  'nameError',    validateName);
    const emailValid = validateField(emailInput, 'emailError',   validateEmail);
    const msgValid   = validateField(msgInput,   'messageError', validateMessage);

    if (!nameValid || !emailValid || !msgValid) return;

    // Show loading state
    setLoading(true);
    hideMessages();

    try {
      // Simulate form submission (replace with actual endpoint / EmailJS / FormSubmit)
      await simulateSubmit({
        name:    nameInput.value.trim(),
        email:   emailInput.value.trim(),
        subject: document.getElementById('subject')?.value.trim() || '',
        message: msgInput.value.trim(),
      });

      // Success
      form.reset();
      showElement(successMsg);
      setTimeout(() => hideElement(successMsg), 6000);

    } catch (err) {
      // Error
      showElement(errorMsg);
      setTimeout(() => hideElement(errorMsg), 6000);
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ───────────────────────────────────────────────────

  /**
   * Validate a single field and display error if invalid.
   * @param {HTMLInputElement|HTMLTextAreaElement} input
   * @param {string} errorId
   * @param {Function} validatorFn
   * @returns {boolean}
   */
  function validateField(input, errorId, validatorFn) {
    const errorEl = document.getElementById(errorId);
    const error   = validatorFn(input.value.trim());

    if (error) {
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function validateName(value) {
    if (!value)          return 'Name is required.';
    if (value.length < 2) return 'Name must be at least 2 characters.';
    return null;
  }

  function validateEmail(value) {
    if (!value) return 'Email is required.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return 'Please enter a valid email address.';
    return null;
  }

  function validateMessage(value) {
    if (!value)           return 'Message is required.';
    if (value.length < 10) return 'Message must be at least 10 characters.';
    return null;
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden     = loading;
    btnLoading.hidden  = !loading;
  }

  function hideMessages() {
    hideElement(successMsg);
    hideElement(errorMsg);
  }

  function showElement(el) { if (el) el.hidden = false; }
  function hideElement(el) { if (el) el.hidden = true; }

  /**
   * Simulate an async form submission.
   * Replace this with a real fetch() call to your backend / FormSubmit / EmailJS.
   * @param {Object} data
   * @returns {Promise<void>}
   */
  function simulateSubmit(data) {
    console.log('Form data:', data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate for demo purposes
        Math.random() > 0.05 ? resolve() : reject(new Error('Network error'));
      }, 1500);
    });
  }
}


/* ================================================================
   10. SCROLL-TO-TOP BUTTON
   ================================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', throttle(() => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, 100));

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================================
   11. FOOTER YEAR
   ================================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}


/* ================================================================
   12. UTILITY HELPERS
   ================================================================ */

/**
 * Throttle a function to run at most once per `limit` milliseconds.
 * @param {Function} fn
 * @param {number} limit - ms
 * @returns {Function}
 */
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce a function — delay execution until `wait` ms after last call.
 * @param {Function} fn
 * @param {number} wait - ms
 * @returns {Function}
 */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
