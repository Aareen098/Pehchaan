# 🧠 Pehchaan – Voter Verification System (ML API)

An AI-powered identity verification system that validates user records using **machine learning + rule-based logic**.
This project ensures secure and intelligent verification of voter identities based on multiple attributes.

---

## 🚀 Features

* 🔍 Fuzzy matching for **Name** and **Address**
* 🔒 Strict validation for:

  * Aadhaar ID
  * Voter ID
  * Date of Birth
* 🤖 Machine Learning model (Random Forest)
* ⚡ FastAPI-based REST API
* 📊 Returns:

  * Verification Status (`Verified / Review / Suspicious`)
  * Similarity Scores

---

## 🧠 System Logic

1. **Strict Rules (High Priority)**

   * DOB mismatch → Suspicious
   * Aadhaar mismatch → Suspicious
   * Voter ID mismatch → Suspicious

2. **Similarity-Based Decision**

   * Medium similarity → Review
   * High similarity → Verified

3. **ML Model**

   * Uses engineered features:

     * `name_sim`
     * `addr_sim`
     * `dob_sim`
     * `aadhaar_sim`
     * `id_sim`

---

## 🛠️ Tech Stack

* Python
* FastAPI
* Scikit-learn
* Pandas
* RapidFuzz

---

## 📂 Project Structure

```
Pehchaan ML/
│
├── ml_api/
│   ├── app.py
│   ├── utils.py
│   ├── decision.py
│
├── ml_model/
│   └── voter_rf_model.pkl
│
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/Pehchaan-Voter-Verification-System.git
cd Pehchaan-Voter-Verification-System
```

---

### 2. Install dependencies

```
pip install -r requirements.txt
```

---

### 3. Run the API

```
python -m uvicorn ml_api.app:app --host 0.0.0.0 --port 8000
```

---

### 4. Access API Docs

Open in browser:

```
http://127.0.0.1:8000/docs
```

---

## 📥 API Usage

### Endpoint

```
POST /verify
```

### Sample Input

```json
{
  "user": {
    "name": "Simrann Kaur",
    "dob": "2004-01-31",
    "address": "Street 10 Rd",
    "aadhaar": "123412341234",
    "voter_id": "ABC1234567"
  },
  "record": {
    "name": "Simran Kaur",
    "dob": "2004-01-31",
    "address": "Street 10 Road",
    "aadhaar": "123412341234",
    "voter_id": "ABC1234567"
  }
}
```

---

### Sample Output

```json
{
  "status": "Review",
  "features": {
    "name_sim": 0.92,
    "addr_sim": 0.88,
    "dob_sim": 1,
    "aadhaar_sim": 1,
    "id_sim": 1
  }
}
```

---

## 🧪 Test Cases

| Case             | Expected Output |
| ---------------- | --------------- |
| Perfect match    | Verified        |
| Minor typo       | Review          |
| Aadhaar mismatch | Suspicious      |
| DOB mismatch     | Suspicious      |

---

## 🌍 Deployment

The API can be deployed using platforms like:

* Render
* Railway
* AWS

---

## 🧠 Key Highlights

* Combines **rule-based validation + ML prediction**
* Handles real-world inconsistencies (typos, formatting)
* Designed for scalable backend integration

---

## 📌 Future Enhancements

* MongoDB integration for storing results
* Node.js backend integration
* Admin dashboard for review cases
* Model optimization and tuning

---

## 👩‍💻 Author

Simran
(Data Science & ML Enthusiast)

---

## 📄 License

This project is for academic and learning purposes.
