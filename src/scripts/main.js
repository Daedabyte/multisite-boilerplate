// Progressive enhancement check
document.documentElement.classList.remove('no-js');

// Lazy loading images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Theme toggle
const getStoredTheme = () => localStorage.getItem('theme');
const setStoredTheme = theme => localStorage.setItem('theme', theme);
const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = theme => {
  document.documentElement.setAttribute('data-theme', theme);
};

setTheme(getPreferredTheme());

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!getStoredTheme()) {
    setTheme(getPreferredTheme());
  }
});