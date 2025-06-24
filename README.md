BlogNest 📝
BlogNest is a full-stack blogging platform built with:

Node.js

Express.js

EJS (Embedded JavaScript Templating)

MongoDB + Mongoose

Tailwind CSS

Multer (for file uploads)

express-session + connect-mongo (for user session management)

🌐 Live Demo
👉 https://blognest-8.onrender.com

✨ Features
User Authentication (Register, Login, Logout)

Add and Manage Blog Posts

Upload Images with Posts (Multer)

Responsive UI with Tailwind CSS

Session-based authentication with MongoDB session store

Server-side rendering with EJS templates

Image hosting via Express static serving

Protected routes for authors

Error Handling pages

🛠️ Installation
bash
Copy
Edit
git clone <repo-url>
cd blognest
npm install
⚙️ Usage
Start the server (development):
bash
Copy
Edit
npm run dev
Start the server (production):
bash
Copy
Edit
npm start
📁 Project Structure
csharp
Copy
Edit
BlogNest/
├── models/
├── routes/
├── controllers/
├── views/         # EJS templates
├── public/        # Static assets (CSS, images)
├── app.js         # Main server file
├── package.json
└── README.md
🖥️ Deployment
The app is deployed on Render Free Web Service.

Live URL: https://blognest-8.onrender.com

📜 License
This project is licensed under the MIT License.
