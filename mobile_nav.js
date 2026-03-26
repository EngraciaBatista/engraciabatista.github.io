// Mobile menu toggle
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 20
    ? 'rgba(10,10,26,0.97)'
    : 'rgba(10,10,26,0.85)';
});

// Scroll fade-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
