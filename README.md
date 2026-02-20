# ELI5 - Explain Like I'm Five

A AI-powered web tool that rewrites complex science or legal paragraphs into simple, child-friendly explanations. 

## ✨ Features
- **AI Rewriting**: Uses Gemini 1.5 Flash to simplify complex vernacular.
- **Premium UI**: "Soft UI" aesthetic with premium typography and glassmorphism.
- **FastAPI Backend**: High-performance asynchronous API.
- **Micro-animations**: Smooth transitions and loading states.
- **Copy to Clipboard**: One-click sharing of simplified text.

## 🚀 How to Run

### 1. Backend Setup
1. Navigate to the project directory:
   ```bash
   cd bhques/eli5-tool
   ```
2. Create a `.env` file and add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python main.py
   ```
   The backend will be running at `http://localhost:8000`.

### 2. Frontend Setup
1. Open `index.html` directly in any modern web browser.
2. Paste complex text into the input field and click **"Rewrite for a Child"**.

## 🛠️ Tech Stack
- **Backend**: FastAPI, Google Generative AI (Gemini), Pydantic.
- **Frontend**: HTML5, Vanilla CSS3 (Soft UI), Javascript (ES6+).
- **Design System**: UI/UX Pro Max inspired.

## 📁 Project Structure
- `main.py`: FastAPI backend server.
- `requirements.txt`: Python dependencies.
- `index.html`: Main frontend structure.
- `style.css`: Premium styling and animations.
- `script.js`: Frontend logic and API integration.
- `planning/`: Project planning documents.
