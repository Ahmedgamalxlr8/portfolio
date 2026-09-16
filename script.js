/**
 * Ahmed Gamal El Horigy - Portfolio Interactive JavaScript
 * Lightweight, Vanilla JS for smooth UX, theme toggle, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Dark / Light Mode Toggle with Persistence
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Respect the data-theme attribute already set on <html> (HTML-level default)
    const htmlTheme = htmlElement.getAttribute('data-theme');
    if (htmlTheme) {
      return htmlTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // 3. Fixed Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // 4. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenuBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 5. Scroll-Spy Navigation (Active Nav Item Highlighting)
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // 6. Smooth Scrolling for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 7. Key Metric Counter Animation (Runs Once When In View)
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const animateCounters = () => {
    if (animated) return;

    counters.forEach(counter => {
      const targetStr = counter.getAttribute('data-target');
      const isDecimal = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const decimals = isDecimal ? (targetStr.split('.')[1].length || 2) : 0;
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = isDecimal 
          ? (easeOut * target).toFixed(decimals) 
          : Math.floor(easeOut * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = targetStr;
        }
      };

      requestAnimationFrame(updateCount);
    });

    animated = true;
  };

  const heroSection = document.getElementById('home');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
      }
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);
  }

  // 8. Projects Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 9. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 10. Contact Form Interactive Validation & Submission
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formAlert = document.getElementById('formAlert');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const clearErrors = () => {
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => input.classList.remove('error'));
      [nameError, emailError, subjectError, messageError].forEach(err => { if (err) err.textContent = ''; });
      if (formAlert) {
        formAlert.style.display = 'none';
        formAlert.className = 'form-status-alert';
        formAlert.textContent = '';
      }
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      // Validate email
      if (!emailInput.value.trim()) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate subject
      if (!subjectInput.value.trim()) {
        subjectInput.classList.add('error');
        subjectError.textContent = 'Please provide a subject.';
        isValid = false;
      }

      // Validate message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('error');
        messageError.textContent = 'Please write your message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('error');
        messageError.textContent = 'Message should be at least 10 characters long.';
        isValid = false;
      }

      if (!isValid) return;

      // Simulate asynchronous form submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        formAlert.className = 'form-status-alert success';
        formAlert.textContent = '✓ Message sent successfully! Ahmed will respond within 24 hours.';
        formAlert.style.display = 'block';

        contactForm.reset();

        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 8000);
      }, 1000);
    });

    // Realtime error clearing
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          input.classList.remove('error');
          const errorSpan = document.getElementById(`${input.id}Error`);
          if (errorSpan) errorSpan.textContent = '';
        }
      });
    });
  }

  // 11. CV / Resume Modal Controls
  const viewCvBtn = document.getElementById('viewCvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModal = document.getElementById('closeCvModal');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');
  const hireFromCvBtn = document.getElementById('hireFromCvBtn');

  const openModal = () => {
    if (cvModal) cvModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (cvModal) cvModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  if (viewCvBtn) {
    viewCvBtn.addEventListener('click', (e) => {
      const href = viewCvBtn.getAttribute('href');
      if (href && href.startsWith('http')) {
        // Allow default navigation to Google Drive CV
        return;
      }
      e.preventDefault();
      openModal();
    });
  }

  if (closeCvModal) closeCvModal.addEventListener('click', closeModal);
  if (closeCvModalBtn) closeCvModalBtn.addEventListener('click', closeModal);
  if (hireFromCvBtn) {
    hireFromCvBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.style.display === 'flex') {
      closeModal();
    }
  });
});
