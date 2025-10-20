```

### **Step 2: The Updated `style.css`**

You need to add a few new styles to your `style.css` file to support the redesigned contact page.

1.  Open `assets/css/style.css`.
2.  **Add the following CSS code** at the end of the file, right before the start of the "MEDIA QUERIES" section.

```css
/* assets/css/style.css */

/* ... (all your existing styles up to the media queries) ... */

/* NEW: Styles for the redesigned Contact Page */
.contact-grid-new {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 3rem;
    align-items: start;
}

.contact-info-panel {
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 2rem;
}

.btn-whatsapp {
    background-color: #25D366;
    color: #fff;
    width: 100%;
    margin-bottom: 2rem;
}
.btn-whatsapp:hover {
    background-color: #1DA851;
    color: #fff;
}

.contact-details-new {
    list-style: none;
    padding: 0;
    margin: 0;
}

.contact-details-new li {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
}
.contact-details-new .icon {
    color: var(--color-primary);
    font-size: 1.5rem;
}

.social-connect {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
}
.social-connect h4 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
}
.social-connect .footer-socials { /* Reusing footer social styles */
    justify-content: center; 
}


/* 15. MEDIA QUERIES */
@media (max-width: 992px) {
    /* ... (existing styles) ... */
    .contact-grid-new {
        grid-template-columns: 1fr;
    }
}
/* ... (rest of your media queries) ... */
```

### **Final Steps**

1.  **Replace your `contact.html` file** with the new code from Step 1.
2.  **Add the new CSS rules** to your `style.css` file as instructed in Step 2.
3.  **Update Your Links:**
    * In `contact.html`, find the WhatsApp link and replace `94XXXXXXXXX` with your actual phone number in international format (e.g., `94771234567`).
    * Find the Facebook link (`<a href="#"...`) and replace the `#` with the actual URL of your Facebook page.
4.  **Deploy your changes:**
    ```bash
    firebase deploy --only hosting
    


```





<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBzAT0Chvt7xBDf01TxaAYzfhSznr4qhck",
    authDomain: "sandunportfolio.firebaseapp.com",
    projectId: "sandunportfolio",
    storageBucket: "sandunportfolio.firebasestorage.app",
    messagingSenderId: "367143211095",
    appId: "1:367143211095:web:0f0fb1db9b706b60b61312",
    measurementId: "G-MDMDYC2L3F"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

https://i.ibb.co/WvBFDV9Z/Audio-Classification-with-CNN-for-Edge-AI.jpg
https://i.ibb.co/Kx0k8bGd/Battery-Powered-ESP32-Air-Quality-Monitor.jpg
https://i.ibb.co/1fKLJ0Vy/ESPVoice-Net-Scalable-ESP32-Voice-Communication-System.jpg
https://i.ibb.co/ZzGMsjsk/STM32-Based-Sensor-Interface-Board.jpg


Manual Updates: Make your changes locally, then run a single command (firebase deploy) in your terminal to push the updates live. It's fast and simple.

npm install -g firebase-tools
firebase login
firebase deploy --only hosting