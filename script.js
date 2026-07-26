// ===== FASHION BOUTIQUE - INTERACTIVE SCRIPT =====

// ===== NAVIGATION TOGGLE =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.main-nav a');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  mainNav.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('active');
  });
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('siteHeader');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  
  if (lastScrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== REVEAL ANIMATIONS ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(element => {
  observer.observe(element);
});

// ===== SMOOTH SCROLL WITH OFFSET =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== CONTACT FORM VALIDATION & SUBMISSION =====
const contactForm = document.getElementById('contactForm');
const successToast = document.getElementById('successToast');

// Form validation patterns
const patterns = {
  fullName: /^[a-zA-Z\s]{3,50}$/,
  phone: /^[0-9]{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: /^.{10,1000}$/s
};

// Clear error messages
function clearError(fieldId) {
  const errorSpan = document.getElementById(`err-${fieldId}`);
  if (errorSpan) {
    errorSpan.classList.remove('show');
    errorSpan.textContent = '';
  }
}

// Show error message
function showError(fieldId, message) {
  const errorSpan = document.getElementById(`err-${fieldId}`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
  }
}

// Validate field
function validateField(fieldId, pattern, errorMessage) {
  const field = document.getElementById(fieldId);
  
  if (!field.value.trim()) {
    showError(fieldId, 'This field is required');
    return false;
  }
  
  if (pattern && !pattern.test(field.value)) {
    showError(fieldId, errorMessage);
    return false;
  }
  
  clearError(fieldId);
  return true;
}

// Real-time validation
document.getElementById('fullName').addEventListener('blur', () => {
  validateField('fullName', patterns.fullName, 'Please enter a valid name (3-50 characters)');
});

document.getElementById('phone').addEventListener('blur', () => {
  validateField('phone', patterns.phone, 'Please enter a valid 10-digit phone number');
});

document.getElementById('email').addEventListener('blur', () => {
  if (document.getElementById('email').value) {
    validateField('email', patterns.email, 'Please enter a valid email address');
  } else {
    clearError('email');
  }
});

document.getElementById('message').addEventListener('blur', () => {
  validateField('message', patterns.message, 'Message must be between 10-1000 characters');
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate all fields
  const isFullNameValid = validateField('fullName', patterns.fullName, 'Please enter a valid name');
  const isPhoneValid = validateField('phone', patterns.phone, 'Please enter a valid 10-digit phone number');
  const isEmailValid = document.getElementById('email').value ? 
    validateField('email', patterns.email, 'Please enter a valid email address') : true;
  const isMessageValid = validateField('message', patterns.message, 'Message must be between 10-1000 characters');
  
  if (!isFullNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
    return;
  }
  
  // Prepare form data
  const formData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value || 'Not provided',
    message: document.getElementById('message').value,
    timestamp: new Date().toLocaleString()
  };
  
  try {

    await emailjs.send(
        "service_jjl85c2",
        "template_fv4kamh",
        {
            from_name: formData.fullName,
            phone: formData.phone,
            from_email: formData.email,
            message: formData.message
        }
    );

    showSuccessToast();

    const whatsappMessage = `Hello Fashion Boutique,

I have submitted an enquiry through your website.

Name: ${formData.fullName}

Phone: ${formData.phone}

Email: ${formData.email}

Message:
${formData.message}`;

    window.open(
        `https://wa.me/917729038710?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank"
    );

    contactForm.reset();

    localStorage.removeItem("contactFormData");

    ['fullName', 'phone', 'email', 'message'].forEach(id => clearError(id));

    function showSuccessToast() {
    successToast.classList.add('show');

    setTimeout(() => {
        successToast.classList.remove('show');
    }, 4000);
}

} catch (error) {
    console.error(error);
    showError('message', 'Failed to send message. Please try again.');
}
});

// ===== YEAR IN FOOTER =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== LAZY LOADING IMAGES (for future image implementation) =====
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== ACTIVE LINK HIGHLIGHTING =====
function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  
  const currentScroll = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.main-nav a[href="#${sectionId}"]`);
      
      navLinks.forEach(link => link.classList.remove('active'));
      if (correspondingLink) {
        correspondingLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightActiveNavLink);

// ===== COUNTER ANIMATION (if needed in future) =====
function animateCounter(element, targetValue, duration = 1000) {
  let startValue = 0;
  const increment = targetValue / (duration / 16);
  
  const counter = setInterval(() => {
    startValue += increment;
    if (startValue >= targetValue) {
      element.textContent = targetValue;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(startValue);
    }
  }, 16);
}

// ===== SMOOTH FADE IN UP ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ===== HANDLE ACTIVE STATES ON CLICK =====
document.querySelectorAll('.btn, a').forEach(element => {
  element.addEventListener('click', function() {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 100);
  });
});

// ===== PERFORMANCE: DEBOUNCE SCROLL EVENTS =====
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const debouncedScroll = debounce(() => {
  highlightActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ===== WHATSAPP MESSAGE TEMPLATE =====
function generateWhatsAppMessage() {
  const formData = {
    name: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    service: 'Styling Consultation'
  };
  
  const message = `Hello! I'm interested in scheduling a styling consultation. Name: ${formData.name}, Phone: ${formData.phone}`;
  return encodeURIComponent(message);
}

// ===== ACCESSIBILITY: KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // Close mobile menu on Escape
  if (e.key === 'Escape' && mainNav.classList.contains('active')) {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('active');
  }
});

// ===== PAGE LOAD ANIMATIONS =====
window.addEventListener('load', () => {
  // Trigger reveal animations for elements in viewport on page load
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.style.animation = 'fadeInUp 0.8s ease forwards';
    }
  });
});

// ===== PRINT STYLES (for contact information) =====
if (window.matchMedia) {
  const mediaQueryList = window.matchMedia('print');
  mediaQueryList.addListener((mql) => {
    if (mql.matches) {
      document.body.style.backgroundColor = 'white';
    }
  });
}

// ===== PERFORMANCE MONITORING =====
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime, 'ms');
  });
}

// ===== FORM DATA PERSISTENCE (Local Storage) =====
function saveFormData() {
  const formData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  localStorage.setItem('contactFormData', JSON.stringify(formData));
}

function loadFormData() {
  const savedData = localStorage.getItem('contactFormData');
  if (savedData) {
    const formData = JSON.parse(savedData);
    document.getElementById('fullName').value = formData.fullName || '';
    document.getElementById('phone').value = formData.phone || '';
    document.getElementById('email').value = formData.email || '';
    document.getElementById('message').value = formData.message || '';
  }
}

// Auto-save form data on input
['fullName', 'phone', 'email', 'message'].forEach(fieldId => {
  document.getElementById(fieldId).addEventListener('input', saveFormData);
});

// Load form data on page load
window.addEventListener('load', loadFormData);

// ===== CURSOR EFFECT FOR INTERACTIVE ELEMENTS =====
document.querySelectorAll('.btn, a, button').forEach(element => {
  element.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });
});

// ===== SCROLL TO TOP BUTTON (Optional) =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 100px;
  right: 30px;
  display: none;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #C41E8C 0%, #E91E8C 100%);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 899;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(196, 30, 140, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.style.display = 'flex';
    scrollToTopBtn.style.alignItems = 'center';
    scrollToTopBtn.style.justifyContent = 'center';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

// Scroll to top on click
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('Fashion Boutique website loaded successfully');
  
  // Add any initialization code here
  highlightActiveNavLink();
});

// ===== UTILITY: SEND ANALYTICS (Optional) =====
function trackPageView(pageName) {
  // Implement Google Analytics or custom tracking here
  console.log('Page view tracked:', pageName);
}

// ===== SERVICE WORKER REGISTRATION (Optional, for PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// ===== PREVENT FORM RESUBMISSION =====
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

console.log('All scripts loaded and ready!');