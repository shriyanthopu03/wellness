# 🌿 AroMi-AI Agent – Adaptive Health & Wellness Coach

AroMi is an intelligent, adaptive health and wellness coaching system designed to evolve with users over time. Unlike static wellness apps, AroMi continuously learns from user behavior, context, and feedback to provide personalized, empathetic, and sustainable health guidance.

---

## 🚀 Features

* 🤖 **Adaptive AI Agent** – Continuously learns from user inputs and feedback
* 🧠 **Context-Aware Recommendations** – Adjusts suggestions based on mood, activity, and routine
* 🏃 **Holistic Wellness Support** – Physical, mental, and lifestyle guidance
* 💬 **Conversational Interface** – Natural, empathetic chat-based interactions
* 🔄 **Real-Time Adaptation** – Recommendations evolve as the user progresses

---

## 🏗️ Project Architecture

```
AroMi-AI-Agent/
│
├── backend/                # FastAPI backend
│   ├── main.py             # FastAPI app entry point (exceptions & routing)
│   ├── agent.py            # AroMiAgent core logic
│   ├── database.py         # MongoDB connection logic
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment (optional)
│
├── frontend/               # React + Tailwind frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Node.js

### Backend

* Python
* FastAPI
* Uvicorn
* MongoDB (Database)
* Groq API (LLM Inference)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/username/aromi-ai-agent.git
cd aromi-ai-agent
```

---

## 🔙 Backend Setup (FastAPI + MongoDB)

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**Mac / Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 🔐 Environment Variables

Create a `.env` file in the backend folder:

```env
GROQ_API_KEY=your_groq_api_key

MONGODB_URI=mongodb://localhost:27017/aromi
```

Run the backend server:

```bash
uvicorn main:app --reload
```

📍 Backend available at:

```
http://127.0.0.1:8000
```

📘 API Docs:

```
http://127.0.0.1:8000/docs
```

---

## 🔜 Frontend Setup (Vite + React + Tailwind)

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

📍 Frontend available at:

```
http://localhost:5173
```

---

## 🔗 Connecting Frontend & Backend

Update the API base URL in frontend:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

Ensure MongoDB is running locally or via cloud (MongoDB Atlas).

Both frontend and backend servers must be running simultaneously.

---

## 🧪 Usage

1. Open the frontend in your browser
2. Start chatting with AroMi
3. Provide context (mood, goals, habits)
4. Receive adaptive wellness guidance

---

## 🧩 Future Enhancements

* 📊 Wearable & sensor data integration
* 🧠 Advanced LLM-based reasoning
* ☁️ Cloud deployment (Docker / AWS)
* 🔐 User authentication & profiles

---

## 🤝 Contributing

Contributions are welcome!

```bash
1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request
```

---



