import os
import time
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, '.env')
load_dotenv(env_path)

app = FastAPI(title="ELI5 Tool API")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # This might happen in Vercel if .env is not pushed
    print("Warning: GOOGLE_API_KEY not found in .env. Attempting to use system environment variable.")
    
if api_key:
    genai.configure(api_key=api_key)

class RewriteRequest(BaseModel):
    text: str

class RewriteResponse(BaseModel):
    original: str
    simplified: str
    duration: float

def get_eli5_explanation(text: str):
    prompt = (
        f"Act as a teacher who specializes in explaining complex topics to five-year-olds. "
        f"Take the following text and rewrite it so a child can understand it. "
        f"Use simple words, analogies, and a friendly tone. "
        f"Text to rewrite:\n\n{text}"
    )
    
    try:
        start_time = time.time()
        # Using gemini-2.0-flash for better performance
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Empty response from AI")
            
        results = response.text
        end_time = time.time()
        
        return results, end_time - start_time
        
    except Exception as e:
        print(f"Error in AI generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Generation Error: {str(e)}")

@app.post("/rewrite", response_model=RewriteResponse)
async def rewrite_text(request: RewriteRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    simplified, duration = get_eli5_explanation(request.text)
    
    return RewriteResponse(
        original=request.text,
        simplified=simplified,
        duration=duration
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "api_key_configured": bool(api_key)}

@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/style.css")
async def serve_css():
    return FileResponse(os.path.join(BASE_DIR, "style.css"))

@app.get("/script.js")
async def serve_js():
    return FileResponse(os.path.join(BASE_DIR, "script.js"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
