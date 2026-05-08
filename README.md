🗳️ Pehchaan – Smart Voter Verification System
📌 Project Overview
Pehchaan is a full-stack Smart Voter Verification System developed to modernize and secure the voter registration and verification process. The platform uses Machine Learning algorithms to validate voter information, detect duplicate or suspicious records, and ensure accurate identity verification through Aadhaar and Voter ID matching.
The system integrates a modern React-based frontend, a scalable Node.js & Express backend, MongoDB for data management, and a Python FastAPI ML service for intelligent verification and fraud detection.

🚀 Key Features


🔐 Secure User Authentication & Authorization using JWT


🧠 Machine Learning-based Voter Verification


📄 Aadhaar & Voter ID Validation System


🗂️ Master Registry Record Matching


📍 Interactive Voter Location Mapping


📊 Admin Dashboard for Monitoring & Managing Records


⚡ Real-time API Communication between Frontend, Backend & ML Service


🛡️ Duplicate & Fraudulent Record Detection



🛠️ Tech Stack
Frontend


React.js


Tailwind CSS


Axios


React Router DOM


Backend


Node.js


Express.js


MongoDB


JWT Authentication


Machine Learning Service


Python


FastAPI


Pandas


Scikit-learn



📂 Project Architecture
Pehchaan/│├── frontend/        # React Frontend Application├── backend/ 
# Node.js & Express REST APIs├── ml-service/  
# FastAPI Machine Learning Service├── database/
# Master Registry & Verification Data└── README.md

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone <repository-url>cd Pehchaan

2️⃣ Setup Frontend
cd frontendnpm installnpm run dev

3️⃣ Setup Backend
cd backendnpm installnpm start

4️⃣ Setup ML Service
cd ml-servicepip install -r requirements.txtuvicorn app:app --reload

🔗 API Endpoints
Method  Endpoint        Description 
POST    /auth/register  Register New User
POST    /auth/loginUser Login
POST    /verify         Verify Voter Details
GET     /votersFetch    Verified Voter Records

🎯 Objectives


Digitize voter verification processes


Reduce duplicate and fake voter registrations


Improve transparency and accuracy in voter management


Automate identity validation using Machine Learning


📈 Future Enhancements


Face Recognition-based Verification


OCR-based Document Scanning


🌙 Responsive Modern UI with Dark Mode Support


Real-time Election Analytics Dashboard


Blockchain-based Secure Voting Integration



📜 License
This project is developed for educational, research, and learning purposes.


Developers
Simran Kaur, Aareen Anand, Rohit Reji
