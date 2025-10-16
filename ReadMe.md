Guide: How to Use & Deploy Your New Portfolio Website
This guide is broken down into three main parts:

Local Development: How to run and edit the website on your computer using the static projects.json file. This is the quickest way to get started.

Optional Firebase Integration: How to set up a Firebase backend and modify the code to pull project data from a database instead of the static file.

Deployment: How to publish your website to the world for free using Firebase Hosting.

1. Local Development & Content Management (Static Method)
This is the default way your new website is configured. All your project data is stored in a single, easy-to-edit file.

Step 1.1: Run the Website Locally
Because the website loads components like the header and footer using JavaScript (fetch), you cannot simply open the .html files in your browser. You need a simple local server.

Prerequisites: You need Node.js installed on your computer.

Install live-server: Open your terminal or Command Prompt and run this command once to install it globally:

Bash

npm install -g live-server
Run the Server:

Navigate to your main project folder (/sandun-portfolio/) in your terminal.

Run the command:

Bash

live-server
Your default web browser will automatically open, and your website will be running locally. Any changes you save to the files will cause the browser to auto-reload.

Step 1.2: How to Add or Edit Projects
All your portfolio content is managed in one place.

Locate the Data File: Open the /assets/data/projects.json file in your code editor.

Understand the Structure: You will see a list of "project" objects. Each project looks like this:

JSON

{
    "id": "agri-tech-iot",
    "title": "Agri-Tech IoT Soil Monitoring System",
    "category": "IoT",
    "summary": "An end-to-end IoT solution for real-time soil...",
    "thumbnailUrl": "https://i.ibb.co/3cYfGDB/agritech-iot.jpg",
    "heroUrl": "https://i.ibb.co/3cYfGDB/agritech-iot.jpg",
    "overview": "Developed a complete IoT solution...",
    "technologies": ["ESP32", "C++", "Firebase", "React", "KiCad"],
    "features": [
        "Real-time data collection...",
        "Low-power design..."
    ],
    "challenges": "The primary challenge was ensuring reliable...",
    "githubUrl": "https://github.com/Sandun-S"
}
To Add a New Project:

Copy an entire project object (from the opening { to the closing }).

Add a comma , after the last existing project.

Paste the copied object and change all the values (id, title, summary, etc.) for your new project.

Important: The "id" must be unique for each project.

For images (thumbnailUrl, heroUrl), you can use a free image hosting service like Postimages or ImgBB to upload your images and get a public URL.

2. Optional Upgrade: Firebase Integration Guide
Follow these steps if you want to manage your projects from the admin.html page and store them in a database.

Step 2.1: Firebase Project Setup
Create a Firebase Project:

Go to the Firebase Console.

Click "Add project" and follow the on-screen instructions. Name it something like "sandun-portfolio".

Create a Web App:

Inside your project, click the Web icon (</>).

Register the app (give it a nickname).

Firebase will provide you with a firebaseConfig object. Copy this object; it is crucial.

Update Your admin.html File:

Open the /sandun-portfolio/admin.html file.

Find the firebaseConfig variable inside the <script type="module"> tag.

Replace the placeholder values with the actual keys you copied from your Firebase project.

Enable Firebase Services:

In the Firebase Console, go to the "Build" section on the left.

Authentication:

Click "Authentication" -> "Get started".

Go to the "Sign-in method" tab and enable the "Email/Password" provider.

Go to the "Users" tab and click "Add user". Create your first admin user with your email and a secure password. This is what you'll use to log in to admin.html.

Firestore Database:

Click "Firestore Database" -> "Create database".

Start in Production mode.

Choose a location for your data (e.g., asia-south1).

Important: Set Security Rules: Go to the "Rules" tab in Firestore and replace the existing rules with these:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read the portfolio data
    match /portfolio/{projectId} {
      allow read: if true;
      // Only allow authenticated users (you) to write/edit/delete
      allow write, delete: if request.auth != null;
    }
  }
}
Click Publish. This makes your portfolio data public (so the website can show it) but protects it from being changed by anyone but you.

Step 2.2: Modify portfolio.html to Use Firebase
You need to tell your portfolio page to fetch data from Firestore instead of the local projects.json file.

Open /sandun-portfolio/portfolio.html.

Find the <script> tag at the bottom of the file.

Replace the entire script with the following new script. This new version includes the Firebase SDKs and logic to query the Firestore database.

HTML

<!-- REPLACE the existing script in portfolio.html with this one -->
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

    // IMPORTANT: Paste the same firebaseConfig object here
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    document.addEventListener('DOMContentLoaded', async () => {
        const grid = document.getElementById('portfolio-grid');

        try {
            // Fetch projects from Firestore
            const projectsCol = collection(db, 'portfolio');
            const q = query(projectsCol, orderBy('title'));
            const projectSnapshot = await getDocs(q);

            const allProjects = projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            grid.innerHTML = ''; // Clear spinner
            allProjects.forEach(project => {
                const projectCard = document.createElement('a');
                projectCard.href = `project-detail.html?id=${project.id}`; // Note: This will require modifications to project-detail.html to fetch from Firebase as well.
                projectCard.className = 'project-card fade-in';
                projectCard.innerHTML = `
                    <img src="${project.thumbnailUrl}" alt="${project.title}">
                    <div class="project-card-content">
                        <span class="project-category">${project.category}</span>
                        <h3>${project.title}</h3>
                        <p>${project.summary}</p>
                    </div>
                `;
                grid.appendChild(projectCard);
            });

        } catch (error) {
            grid.innerHTML = '<p class="error-message">Could not load projects from Firebase. Please check the configuration.</p>';
            console.error('Error fetching projects from Firebase:', error);
        }
    });
</script>
Note: You would also need to update project-detail.html and index.html in a similar way to fetch individual projects and featured projects from Firebase. For simplicity, starting with portfolio.html is the best first step.

3. Deployment Guide (Using Firebase Hosting)
Firebase Hosting is the easiest, fastest, and most reliable way to deploy this website for free.

Install Firebase CLI: In your terminal, run:

Bash

npm install -g firebase-tools
Login to Firebase:

Bash

firebase login
This will open a browser window for you to log in to your Google account.

Initialize Your Project:

Navigate to your project root folder (/sandun-portfolio/) in your terminal.

Run the command:

Bash

firebase init
Follow the command-line prompts:

Are you ready to proceed? -> Yes

Which Firebase features do you want to set up? -> Use the arrow keys to select Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys. Press Spacebar to select, then Enter to confirm.

Please select an option: -> Use an existing project

Select the Firebase project you created earlier (e.g., "sandun-portfolio").

What do you want to use as your public directory? -> Just press Enter. (It defaults to public, but the next step will fix this).

Configure as a single-page app (rewrite all urls to /index.html)? -> No (This is very important for a multi-page site).

Set up automatic builds and deploys with GitHub? -> No (For now).

Final Configuration:

After initialization, a file named firebase.json is created. Open it and make one small but important change. Change "public": "public" to "public": ".". This tells Firebase that your entire current folder is the website.

Your firebase.json should look like this:

JSON

{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
Deploy!

In your terminal, from the same project folder, run:

Bash

firebase deploy
After a few moments, the command line will give you a Hosting URL. Your website is now live!












npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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




Manual Updates: Make your changes locally, then run a single command (firebase deploy) in your terminal to push the updates live. It's fast and simple.

npm install -g firebase-tools
firebase login
firebase deploy --only hosting