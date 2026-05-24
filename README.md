SmartPrint Campus

A full-stack smart printing management system for college campuses that allows users to upload and book print jobs online while helping print shop owners manage orders efficiently.

🚀 Project Overview

SmartPrint Campus is designed to reduce waiting time at campus printing shops by enabling users to:

Register and login securely
Upload and book print orders
Select print preferences
Choose printing shops and time slots
Track order history and status

The system also provides backend APIs for managing print jobs and user authentication.

✨ Features

👨‍🎓 User Features

User Signup & Login

Book Print Orders

Select:

Number of pages

Copies

Color/BW printing

Binding option

Print shop

Time slot

View Order History

Automatic Price Calculation

🖨️ Admin / Shop Features

Manage print orders

Update order status

View all customer requests

🛠️ Tech Stack

Frontend

Next.js

React.js

TypeScript

Tailwind CSS

Backend

Node.js

Express.js

Database

MySQL

📂 Project Structure

smartprint-campus/


├── frontend/

│   ├── app/

│   ├── public/

│   ├── package.json


├── backend/

│   ├── server.js

│   ├── db.js

│   ├── package.json

│

└── README.md

Run the Application

    Start Backend Server
    
        cd backend
        
        node server.js
     Start Frontend
    
        cd frontend
        
        npm run dev

        
📡 API Endpoints

Authentication APIs

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| POST   | `/signup` | Register new user |
| POST   | `/login`  | User login        |

Print APIs

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/book-print`      | Create print order |
| GET    | `/orders/:user_id` | Get user orders    |

📸 Project Screenshots

🏠 Home Page

<img width="452" height="207" alt="image" src="https://github.com/user-attachments/assets/fcb916e9-9294-40eb-8493-7d77bd88a6b9" />

<img width="452" height="208" alt="image" src="https://github.com/user-attachments/assets/6cc700db-e6dd-44c3-8f8f-f801a7e33e09" />


⬆️ Upload Page

<img width="452" height="206" alt="image" src="https://github.com/user-attachments/assets/5663bf70-e4e4-4b57-9edd-4c3f182b18cd" />

 <img width="452" height="207" alt="image" src="https://github.com/user-attachments/assets/4316c676-8fef-43c8-b132-95dda122c52c" />


👤Sign In Page

<img width="452" height="209" alt="image" src="https://github.com/user-attachments/assets/6dd3f56b-c36e-4111-a2d7-27a3a522284c" />


👤 Sign Up Page

<img width="452" height="209" alt="image" src="https://github.com/user-attachments/assets/8cfde9df-312d-4f68-b5dc-e40b128961a1" />

🏪 Shop Dashboard

<img width="452" height="207" alt="image" src="https://github.com/user-attachments/assets/b905fda4-e699-4d87-bb26-5d16eeecd320" />


👨‍💻 Author

Nikita Yadav

GitHub: https://github.com/nikita712006
