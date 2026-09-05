document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STICKY HEADER
  // ==========================================================================
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check in case of page refresh with scroll offset

  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');

    // Prevent body scrolling when menu is active on mobile
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('active');
    nav.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links or navigation CTA
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu with Escape key for keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Close menu if window is resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && nav.classList.contains('active')) {
      closeMenu();
    }
  });

  // ==========================================================================
  // ACTIVE NAV LINK ON SCROLL (SCROLL SPY)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the central area of screen
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // HERO IMAGE SLIDER / CAROUSEL
  // ==========================================================================
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = heroSlider.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const intervalTime = 4000; // 4 seconds between transitions
    let slideTimer = null;

    const showSlide = (index) => {
      // Normalize index
      currentIndex = (index + totalSlides) % totalSlides;

      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.add('active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    };

    const nextSlide = () => {
      showSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      showSlide(currentIndex - 1);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      slideTimer = setInterval(nextSlide, intervalTime);
    };

    const stopAutoSlide = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    // Manual controls
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide(); // Reset timer after manual interaction
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide(); // Reset timer after manual interaction
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAutoSlide(); // Reset timer after manual interaction
      });
    });

    // Pause on hover, resume on mouse leave
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);

    // Keyboard support for accessibility
    heroSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoSlide();
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      stopAutoSlide();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoSlide();
    }, { passive: true });

    // Start auto slide initially
    startAutoSlide();
  }
});

