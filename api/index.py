import os
import time
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="ELI5 Tool API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
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
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Empty response from AI")
            
        return response.text, time.time() - start_time
        
    except Exception as e:
        print(f"Error in AI generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Generation Error: {str(e)}")

@app.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_text(request: RewriteRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    simplified, duration = get_eli5_explanation(request.text)
    
    return RewriteResponse(
        original=request.text,
        simplified=simplified,
        duration=duration
    )

@app.get("/api/health")
async def health_check():
    # In Vercel, api_key will be in the system environment
    return {"status": "healthy", "api_key_configured": bool(os.getenv("GOOGLE_API_KEY"))}
