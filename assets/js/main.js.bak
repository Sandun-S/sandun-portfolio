document.addEventListener('DOMContentLoaded', function() {
    
    // --- Load Header and Footer ---
    const loadComponent = (url, elementId) => {
        fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject('File not found'))
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
                if (elementId === 'main-header') {
                    // Re-initialize event listeners after header is loaded
                    initializeHeader();
                }
            })
            .catch(error => console.error(`Error loading ${elementId}:`, error));
    };

    // Create partial HTML files for header and footer content
    // For this example, we'll define them as strings.
    // In a real project, these would be header.html and footer.html files.
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
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
        </div>
    `;

    const footerHTML = `
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Sandun Siwantha. All rights reserved.</p>
            <p>
                <a href="https://www.linkedin.com/in/sandun-siwantha" target="_blank">LinkedIn</a> |
                <a href="https://github.com/Sandun-S" target="_blank">GitHub</a>
            </p>
        </div>
    `;
    
    // Inject header and footer
    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        initializeHeader();
    }
    if (footerElement) {
        footerElement.innerHTML = footerHTML;
    }


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

});
