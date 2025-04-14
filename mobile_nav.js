document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('nav.mobile-nav ul');
  
    if (hamburger && navList) {
      hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
      });
    }
  });
  