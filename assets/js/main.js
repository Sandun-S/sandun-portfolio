document.addEventListener('DOMContentLoaded', function() {
    
    // --- Define Header and Footer HTML as templates ---
    const headerHTML = `
        <div class="container navbar">
            <a href="index.html" class="logo">Sandun<span>.S</span></a>
            <nav>
                <ul class="nav-links" id="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="portfolio.html">Portfolio</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </nav>
            <div class="nav-controls">
                <!-- THEME SWITCHER BUTTON -->
                <button class="theme-switcher" id="theme-switcher" aria-label="Toggle theme">
                    <span class="icon-sun">☀️</span>
                    <span class="icon-moon">🌙</span>
                </button>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
            </div>
        </div>
    `;

    const footerHTML = `
        <div class="container footer-content">
            <p>&copy; ${new Date().getFullYear()} Sandun Siwantha. All rights reserved.</p>
            <p>
                <a href="https://www.linkedin.com/in/sandun-siwantha" target="_blank">LinkedIn</a> |
                <a href="https://github.com/Sandun-S" target="_blank">GitHub</a>
            </p>
        </div>
    `;
    
    // --- Function to inject components ---
    function injectHTML(elementId, htmlContent, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = htmlContent;
            if (callback) {
                callback();
            }
        }
    }

    // --- Function to set up header-specific logic ---
    function initializeHeader() {
        // --- Mobile Menu Toggle ---
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.getElementById('nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // --- Active Nav Link Styling ---
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        const navAnchors = document.querySelectorAll('#nav-links a');

        navAnchors.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // --- Load components into the page ---
    injectHTML('main-header', headerHTML, initializeHeader);
    injectHTML('main-footer', footerHTML);

});

