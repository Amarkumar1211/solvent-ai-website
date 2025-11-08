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

  const formData = {
    name: form.querySelector('[name="name"]')?.value || '',
    email: form.querySelector('[name="email"]')?.value || '',
    phone: form.querySelector('[name="phone"]')?.value || '',
    message: form.querySelector('[name="message"]')?.value || '',
    source: form.classList.contains('footer-form') ? 'footer' : 'contact'
  };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const status = form.querySelector('#formStatus') || form.querySelector('#inquiryStatus') || form.querySelector('#newsletter-status');
      if (status) { 
        status.textContent = '✅ Message sent. We will contact you shortly.'; 
      }
      // small success visual
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { 
        btn.disabled = true; 
        btn.style.opacity = '0.8'; 
        setTimeout(()=>{ btn.disabled=false; btn.style.opacity='1'; }, 1800); 
      }
      form.reset();
      // if popup open, close after short delay
      if (form.closest && form.closest('.inquiry-popup')) setTimeout(closeInquiryPopup, 900);
    } else {
      throw new Error('Failed to submit form');
    }
  } catch (error) {
    console.error('Error:', error);
    const status = form.querySelector('#formStatus') || form.querySelector('#inquiryStatus') || form.querySelector('#newsletter-status');
    if (status) { 
      status.textContent = '❌ Error submitting form. Please try again.'; 
    }
  }
});

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
