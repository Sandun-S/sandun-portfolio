// assets/js/theme-switcher.js

function initializeTheme() {
    const themeSwitcher = document.getElementById('theme-switcher');
    if (!themeSwitcher) {
        // If the switcher isn't on the page yet, wait a bit
        setTimeout(initializeTheme, 100);
        return;
    }

    const doc = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = localStorage.getItem('theme');

    // Set initial theme based on localStorage or OS preference
    if (currentTheme) {
        doc.setAttribute('data-theme', currentTheme);
    } else {
        doc.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    // Handle button click
    themeSwitcher.addEventListener('click', () => {
        currentTheme = doc.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        doc.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Run the initialization
document.addEventListener('DOMContentLoaded', initializeTheme);
