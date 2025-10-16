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
```

---

### **Step 4: Add the New Script to All Your HTML Files**

Finally, you need to tell your HTML pages to load this new script. In **every single one** of your `.html` files (`index.html`, `about.html`, etc.), add the following line right before the closing `</body>` tag.

```html
    <!-- Add this to all .html files before </body> -->
    <script src="assets/js/theme-switcher.js"></script>
</body>
</html>
```

### **Step 5: Deploy Your Changes**

You've edited `style.css`, `main.js`, created `theme-switcher.js`, and updated all your HTML files. Now, deploy the changes.

1.  Save all your updated files.
2.  In your terminal, run:
    ```bash
    firebase deploy --only hosting
    
