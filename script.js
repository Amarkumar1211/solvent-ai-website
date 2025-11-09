// ===== DOM helpers =====
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// MENU toggle
const menuToggle = $('#menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('show');
  });
  // Close menu on click-away
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-inner')) {
      nav.classList.remove('show');
      menuToggle.classList.remove('active');
    }
  });
}

// HEADER shrink on scroll
const header = document.querySelector('.site-header');
const SCROLL_Y = 60;
function onScrollHeader() {
  if (!header) return;
  if (window.scrollY > SCROLL_Y) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader(); // initial

// FADE-IN on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add('visible');
  });
}, { threshold: 0.12 });
$$('.fade-in').forEach(el => io.observe(el));

// COUNTERS (simple)
$$('.counter').forEach(counter => {
  const update = () => {
    const target = +counter.dataset.target || 0;
    const current = +counter.innerText.replace(/\D/g,'') || 0;
    const inc = Math.max(1, Math.round(target / 120));
    if (current < target) {
      counter.innerText = (current + inc) + (counter.innerText.includes('%') ? '%' : '');
      setTimeout(update, 18);
    } else {
      counter.innerText = (counter.innerText.includes('%') ? `${target}%` : `${target}+`);
    }
  };
  update();
});

// INQUIRY popup + chat bubble behavior
const chatBtn = $('#chatBtn');
const inquiryPopup = $('#inquiry-popup');
const inquiryClose = inquiryPopup ? inquiryPopup.querySelector('#closePopup') : null;
const waOpen = $('#waOpen');

function openInquiryPopup() {
  if (!inquiryPopup) return;
  inquiryPopup.classList.add('show');
  document.body.classList.add('inquiry-open'); // shift chat bubble
}
function closeInquiryPopup() {
  if (!inquiryPopup) return;
  inquiryPopup.classList.remove('show');
  document.body.classList.remove('inquiry-open');
}

if (chatBtn) chatBtn.addEventListener('click', () => {
  if (!inquiryPopup) {
    // fallback open whatsapp
    window.open('https://wa.me/919810961797', '_blank');
    return;
  }
  inquiryPopup.classList.toggle('show');
  document.body.classList.toggle('inquiry-open');
});

if (inquiryClose) inquiryClose.addEventListener('click', closeInquiryPopup);

if (waOpen) waOpen.addEventListener('click', () => {
  window.open('https://wa.me/919810961797', '_blank');
});

// Form handling with database storage
document.addEventListener('submit', async (ev) => {
  const form = ev.target;
  if (form.tagName !== 'FORM') return;
  ev.preventDefault();

  // Get status element
  const statusEl = form.querySelector('#formStatus') || form.querySelector('#inquiryStatus') || form.querySelector('#newsletter-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Reset previous status
  if (statusEl) {
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }

  // Validate form
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  });

  if (!isValid) {
    if (statusEl) {
      statusEl.textContent = '❌ Please fill in all required fields.';
      statusEl.classList.add('error');
    }
    return;
  }

  // Email validation
  const emailField = form.querySelector('[type="email"]');
  if (emailField && !isValidEmail(emailField.value)) {
    if (statusEl) {
      statusEl.textContent = '❌ Please enter a valid email address.';
      statusEl.classList.add('error');
    }
    emailField.classList.add('error');
    return;
  }

  // Disable submit button and show loading
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  }

  // Prepare form data
  const formData = {
    name: form.querySelector('[name="name"]')?.value.trim() || '',
    email: form.querySelector('[name="email"]')?.value.trim() || '',
    phone: form.querySelector('[name="phone"]')?.value.trim() || '',
    company: form.querySelector('[name="company"]')?.value.trim() || '',
    topic: form.querySelector('[name="topic"]')?.value || '',
    message: form.querySelector('[name="message"]')?.value.trim() || '',
    source: form.classList.contains('footer-form') ? 'footer' : 'contact'
  };

  try {
    // Determine API URL based on environment
    const apiUrl = 'https://solvent-api.onrender.com/api/contact';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      if (statusEl) {
        statusEl.textContent = '✅ Message sent successfully! We will contact you shortly.';
        statusEl.classList.add('success');
      }

      // Reset form
      form.reset();

      // Success visual feedback
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 2000);
      }

      // Close popup if open
      if (form.closest('.inquiry-popup')) {
        setTimeout(closeInquiryPopup, 1500);
      }
    } else {
      throw new Error(data.message || 'Failed to submit form');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    if (statusEl) {
      statusEl.textContent = '❌ ' + (error.message || 'Error submitting form. Please try again.');
      statusEl.classList.add('error');
    }
    
    // Reset submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  }
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeInquiryPopup();
});
// ===== Animated Particles Background =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;
  const colors = ['#00f0ff', '#6a30ff', '#ffffff'];

  // Set up particles
  function initParticles() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Resize canvas with window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  // Draw particles
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
    requestAnimationFrame(drawParticles);
  }

  initParticles();
  drawParticles();
}
